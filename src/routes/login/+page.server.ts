import { get_collection, get_database } from "$lib/db/index.js";
import type { User } from "$lib/db/index.js";
import { error, fail, redirect } from "@sveltejs/kit";
import crypto from 'crypto';

interface SecurityLog {
    fingerprint: string;
    attempts: number;
    windowStart: Date;
    blockedUntil?: Date;
    suspiciousActivity: boolean;
}

function createSecureFingerprint(request: Request): string {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLang = request.headers.get('accept-language') || '';
    const acceptEnc = request.headers.get('accept-encoding') || '';
    const connection = request.headers.get('connection') || '';
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 15));
    const combined = `${userAgent}-${acceptLang}-${acceptEnc}-${connection}-${timestamp}`;
    return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 16);
}

function detectSuspiciousRequest(request: Request): boolean {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLang = request.headers.get('accept-language') || '';
    const acceptEnc = request.headers.get('accept-encoding') || '';
    if (!userAgent || userAgent.length < 10) return true;
    if (!acceptLang || !acceptEnc) return true;
    if (userAgent.includes('bot') || userAgent.includes('crawler')) return true;
    const headerCount = Array.from(request.headers.keys()).length;
    if (headerCount < 8 || headerCount > 50) return true;
    const xHeaders = Array.from(request.headers.keys()).filter(h => h.startsWith('x-')).length;
    if (xHeaders > 10) return true;
    return false;
}

function validateInput(input: string): boolean {
    if (input.length > 50 || input.length < 2) return false;
    if (!/^[a-zA-Z0-9_-]+$/.test(input)) return false;
    const suspiciousPatterns = [
        /[<>{}[\]\\\/]/,
        /\$[a-z]/i,
        /['"`;]/,
        /\b(null|undefined|true|false)\b/i,
        /\d{10,}/,
        /(script|eval|function|return)/i
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(input));
}

async function checkSecurityLimits(fingerprint: string): Promise<boolean> {
    const security = await get_collection<SecurityLog>("security_logs");
    const now = new Date();
    const windowDuration = 15 * 60 * 1000;
    const maxAttempts = 3;
    let record = await security.findOne({ fingerprint });
    if (!record) {
        await security.insertOne({
            fingerprint,
            attempts: 1,
            windowStart: now,
            suspiciousActivity: false
        });
        return true;
    }
    if (record.blockedUntil && now < record.blockedUntil) return false;
    if (record.suspiciousActivity) return false;
    const windowAge = now.getTime() - record.windowStart.getTime();
    if (windowAge > windowDuration) {
        await security.updateOne(
            { fingerprint },
            { $set: { attempts: 1, windowStart: now }, $unset: { blockedUntil: "" } }
        );
        return true;
    }
    const newAttempts = record.attempts + 1;
    if (newAttempts > maxAttempts) {
        const blockedUntil = new Date(now.getTime() + windowDuration * 4);
        await security.updateOne(
            { fingerprint },
            { $set: { attempts: newAttempts, blockedUntil, suspiciousActivity: true } }
        );
        return false;
    }
    await security.updateOne({ fingerprint }, { $set: { attempts: newAttempts } });
    return true;
}

async function markSuspiciousActivity(fingerprint: string): Promise<void> {
    const security = await get_collection<SecurityLog>("security_logs");
    const blockedUntil = new Date(Date.now() + (60 * 60 * 1000));
    await security.updateOne(
        { fingerprint },
        { $set: { suspiciousActivity: true, blockedUntil } },
        { upsert: true }
    );
}

export const load = async ({ cookies, request }) => {
    const username = cookies.get("username");
    if (username) throw redirect(303, "/lessons");
    const cfRay = request.headers.get('cf-ray');
    const cfCountry = request.headers.get('cf-ipcountry');
    const isCloudflareActive = !!(cfRay || cfCountry);
    return {
        cloudflareActive: isCloudflareActive,
        country: cfCountry || 'unknown'
    };
};

export const actions = {
    login: async ({ request, cookies }) => {
        if (detectSuspiciousRequest(request)) {
            return fail(403, { error: "access denied" });
        }
        const fingerprint = createSecureFingerprint(request);
        if (!(await checkSecurityLimits(fingerprint))) {
            return fail(429, { error: "access temporarily restricted" });
        }
        const fdata = await request.formData();
        const rawUsername = fdata.get("username");
        if (!rawUsername || typeof rawUsername !== 'string') {
            return fail(400, { error: "invalid request" });
        }
        const username = rawUsername.toString().trim();
        if (!validateInput(username)) {
            await markSuspiciousActivity(fingerprint);
            return fail(400, { error: "invalid input detected" });
        }
        if (username.length < 2 || username.length > 30) {
            return fail(400, { error: "invalid username length" });
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return fail(400, { error: "invalid characters" });
        }

        try {
            const users = await get_collection<User>("users");
            const encryptedUsername = crypto.createHash('sha256').update(username + 'salt_key_2024').digest('hex');
            const query = { username: { $eq: encryptedUsername } };
            let user = await users.findOne(query);
            if (!user) {
                const nusr: User = {
                    username: encryptedUsername,
                    progress: 0,
                    completed: [],
                    createdAt: new Date(),
                };
                await users.insertOne(nusr);
            }
        } catch (err) {
            return fail(500, { error: "service unavailable" });
        }

        cookies.set("username", username, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
        });

        throw redirect(303, "/lessons");
    },
};
