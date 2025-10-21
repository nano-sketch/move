import { get_collection, get_database } from "$lib/db/index.js";
import type { User } from "$lib/db/index.js";
import { error, fail, redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    const username = cookies.get("username");
    if (username) throw redirect(303, "/start");
    return {};
};

export const actions = {
    login: async ({ request, cookies }) => {
        /* request the form data and check if they exist, if they dont  create a new user */
        const fdata = await request.formData();
        const username = fdata.get("username")?.toString().trim();

        if (!username) return fail(400, { error: "a username is required" });

        try {
            const users = await get_collection<User>("users");
            let user = await users.findOne({ username });

            if (!user) {
                const nusr: User = {
                    username,
                    progress: 0,
                    completed: [],
                    createdAt: new Date(),
                };
                await users.insertOne(nusr);
            }
        } catch (err) {
            console.error("db error:", err);
            return fail(500, { error: "Failed to process request" });
        }

        cookies.set("username", username, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
        });

        throw redirect(303, "/start");
    },
};
