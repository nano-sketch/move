import { fail } from "@sveltejs/kit";
import { get_collection, type User, type Session } from "$lib/db";
import { ObjectId } from "mongodb";

export const actions = {
    complete: async ({ cookies, params }) => {
        const session_tok = cookies.get("session_tok");
        if (!session_tok) return fail(401, { error: "Not authenticated." });

        const lesson_id = parseInt(params.id);
        if (isNaN(lesson_id)) return fail(400, { error: "Invalid lesson ID." });

        try {
            const sessions = await get_collection<Session>("sessions");
            const ses = await sessions.findOne({ token: session_tok });

            if (!ses || ses.expiresAt <= new Date()) {
                if (ses) await sessions.deleteOne({ token: session_tok });
                cookies.delete("session_tok", { path: "/" });
                return fail(401, { error: "Not authenticated." });
            }

            const users = await get_collection<User>("users");
            const user = await users.findOne({ _id: new ObjectId(ses.userId) });

            if (!user) {
                await sessions.deleteOne({ token: session_tok });
                cookies.delete("session_tok", { path: "/" });
                return fail(404, { error: "User not found." });
            }

            if (user.completed.includes(lesson_id))
                return { success: true, already_completed: true };

            await users.updateOne(
                { _id: new ObjectId(ses.userId) },
                { $addToSet: { completed: lesson_id }, $inc: { progress: 1 } },
            );

            return { success: true };
        } catch (err) {
            console.error("db error:", err);
            return fail(500, { error: "Failed to update progress." });
        }
    },
};
