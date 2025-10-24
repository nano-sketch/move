import { get_collection, get_database } from "$lib/db/index.js";
import type { Session, User } from "$lib/db/index.js";
import { validate_password } from "$lib/helpers.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { hashSync } from "bcrypt-ts";
import { randomBytes } from "crypto";

export const load = async ({ cookies }) => {
    const session_tok = cookies.get("session_tok");
    if (session_tok) {
        try {
            const sesssions = await get_collection<Session>("sessions");
            const ses = await sesssions.findOne({ token: session_tok });

            /* if it is a valid session (it is not expired) redirect to lessons */
            if (ses && ses.expiresAt > new Date())
                throw redirect(303, "/lessons");

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
    signup: async ({ request, cookies }) => {
        /* request the form data and check if they exist, if they dont  create a new user */
        const fdata = await request.formData();
        const username = fdata.get("username")?.toString().trim();
        const password = fdata.get("password")?.toString().trim();

        if (!password) return fail(500, { error: "Password is undefined" });

        const pwd_validation_result = validate_password(password);
        if (!pwd_validation_result.valid)
            return fail(500, {
                error:
                    pwd_validation_result.error ||
                    "Password does not fit the requirements.",
            });

        if (!username) return fail(400, { error: "a username is required" });

        try {
            const users = await get_collection<User>("users");
            const exists = await users.findOne({ username });

            /* if the user exists, then return an error */
            if (exists)
                return fail(500, {
                    error: `A user named '${username}' already exists!`,
                });

            if (!username || !password)
                return fail(500, {
                    error: `Username or password supplied are undefined.`,
                });

            /* generate a salt and hash the password */
            const hashed = hashSync(password, 10);
            const insertion_result = await users.insertOne({
                username,
                password: hashed,
                experience: 0,
                progress: 0,
                completed: [],
                completedchallenges: [],
                createdAt: new Date(),
            });

            const session_tok = randomBytes(32).toString("hex");
            const sessions = await get_collection<Session>("sessions");
            const expires = new Date();

            /* set expiry for 30 days from noww */
            expires.setDate(expires.getDate() + 30);

            await sessions.insertOne({
                token: session_tok,
                userId: insertion_result.insertedId.toString(),
                createdAt: new Date(),
                expiresAt: expires,
            });

            /* finally set the session token  */
            cookies.set("session_tok", session_tok, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30,
            });
            // if (!user) {
            //     const nusr: User = {
            //         username,
            //         progress: 0,
            //         completed: [],
            //         createdAt: new Date(),
            //     };
            //     await users.insertOne(nusr);
            // }
        } catch (err) {
            return fail(500, { error: "A database error occured." });
        }

        return redirect(303, "/lessons");
    },
};
