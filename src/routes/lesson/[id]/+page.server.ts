import { fail } from "@sveltejs/kit";
import { get_collection, get_user, type User } from "$lib/db";

export const actions = {
    complete: async ({ cookies, params }) => {
        const username = cookies.get("username");
        if (!username) return fail(401, { error: "not authenticated" });

        const lesson_id = parseInt(params.id);
        if (isNaN(lesson_id)) return fail(400, { error: "invalid lesson id" });

        try {
            const users = await get_collection<User>("users");

            const user = await get_user(username);
            if (!user) return fail(404, { error: "user not found" });

            if (user.completed.includes(lesson_id))
                return { success: true, already_completed: true };

            await users.updateOne(
                { username },
                { $addToSet: { completed: lesson_id }, $inc: { progress: 1 } },
            );

            return { success: true };
        } catch (err) {
            console.error("db error:", err);
            return fail(500, { error: "failed to update progress" });
        }
    },
};
