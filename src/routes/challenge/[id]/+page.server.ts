import { fail, type Actions } from "@sveltejs/kit";
import { get_collection } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Session, User } from "$lib/db";
import { ObjectId } from "mongodb";
import challenges from "$lib/challenges/challenges.json";

export const prerender = false;

export const load: PageServerLoad = async ({ cookies, params }) => {
    const session_tok = cookies.get("session_tok");
    if (!session_tok) throw redirect(302, "/login");

    try {
        const sessions = await get_collection<Session>("sessions");
        const ses = await sessions.findOne({ token: session_tok });

        if (!ses || ses.expiresAt <= new Date()) {
            if (ses) await sessions.deleteOne({ token: session_tok });
            cookies.delete("session_tok", { path: "/" });
            throw redirect(302, "/login");
        }

        const users = await get_collection<User>("users");
        const user = await users.findOne({ _id: new ObjectId(ses.userId) });

        if (!user) {
            await sessions.deleteOne({ token: session_tok });
            cookies.delete("session_tok", { path: "/" });
            throw redirect(302, "/login");
        }

        const challenge_id = parseInt(params.id);
        const challenge = challenges.find((c) => c.id === challenge_id);
        if (!challenge) throw redirect(302, "/challenges");

        const is_completed =
            user.completedchallenges?.includes(challenge_id) || false;

        return {
            is_completed,
        };
    } catch (err) {
        cookies.delete("session_tok", { path: "/" });
        throw redirect(302, "/login");
    }
};

export const actions: Actions = {
    complete: async ({ request, cookies }) => {
        const session_tok = cookies.get("session_tok");
        if (!session_tok) return fail(401, { error: "not logged in" });

        try {
            const sessions = await get_collection<Session>("sessions");
            const ses = await sessions.findOne({ token: session_tok });

            if (!ses || ses.expiresAt <= new Date()) {
                if (ses) await sessions.deleteOne({ token: session_tok });
                cookies.delete("session_tok", { path: "/" });
                return fail(401, { error: "not logged in" });
            }

            const users = await get_collection<User>("users");
            const user = await users.findOne({ _id: new ObjectId(ses.userId) });

            if (!user) {
                await sessions.deleteOne({ token: session_tok });
                cookies.delete("session_tok", { path: "/" });
                return fail(404, { error: "user not found" });
            }

            const data = await request.formData();
            const challenge_id = parseInt(data.get("challenge_id") as string);

            if (user.completedchallenges?.includes(challenge_id))
                return { success: true, already_completed: true };

            await users.updateOne(
                { _id: new ObjectId(ses.userId) },
                {
                    $addToSet: { completedchallenges: challenge_id },
                },
            );

            return { success: true };
        } catch (err) {
            return fail(500, { error: "server error" });
        }
    },
};
