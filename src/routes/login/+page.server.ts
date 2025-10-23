import { get_collection, get_database } from "$lib/db/index.js";
import type { User, Session } from "$lib/db/index.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { compare } from "bcrypt-ts";
import { randomBytes } from "crypto";

export const load = async ({ cookies }) => {
    // const username = cookies.get("username");
    // if (username) throw redirect(303, "/lessons");
    // return {};

    const session_tok = cookies.get("session_tok");
    if (session_tok) {
        try {
            const sesssions = await get_collection<Session>("sessions");
            const ses = await sesssions.findOne({ token: session_tok });

            /* if it is a valid session (it is not expired) redirect to lessons */
            if (ses && ses.expiresAt > new Date())
                return redirect(303, "/lessons");

            if (ses) await sesssions.deleteOne({ token: session_tok });

            cookies.delete("session_tok", { path: "/" });
        } catch (err) {
            /* this is an invalid cookie so just clear */
            cookies.delete("session_tok", { path: "/" });
        }
    }

    return {};
};

export const actions = {
    login: async ({ request, cookies }) => {
        /* request the form data and check if they exist, if they dont  create a new user */
        const fdata = await request.formData();
        const username = fdata.get("username")?.toString().trim();
        const password = fdata.get("password")?.toString().trim();

        // return fail(400, { error: "hi" });

        if (!username) return fail(400, { error: "A username is required" });

        try {
            const users = await get_collection<User>("users");
            const exists = await users.findOne({ username });

            if (exists) {
                const password_hash = exists.password;

                if (!password)
                    return fail(500, { error: "Password is undefined" });

                const valid_pass = await compare(password, password_hash);
                if (!valid_pass) {
                    return fail(500, { error: "Invalid password." });
                }

                /*
                    at this point the password is correct,
                    so now generate the session token
                */
                const session_tok = randomBytes(32).toString("hex");
                const sessions = await get_collection<Session>("sessions");
                const expires = new Date();

                /* just like in the sign up impl, set for 30 day expiry */
                expires.setDate(expires.getDate() + 30);

                await sessions.insertOne({
                    token: session_tok,
                    userId: exists._id.toString(),
                    createdAt: new Date(),
                    expiresAt: expires,
                });

                cookies.set("session_tok", session_tok, {
                    path: "/",
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 30,
                });
            } else {
                return fail(500, {
                    error: `User '${username}' does not exist`,
                });
            }
        } catch (err) {
            console.error("Login error:", err);
            return fail(500, { error: "Failed to process request" });
        }

        throw redirect(303, "/lessons");
    },
};
