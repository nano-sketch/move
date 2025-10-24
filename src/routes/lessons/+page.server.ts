import { redirect } from "@sveltejs/kit";
import { get_collection, get_user } from "$lib/db";
import type { Session, User } from "$lib/db";
import { ObjectId } from "mongodb";

export const load = async ({ cookies }) => {
    const session_tok = cookies.get("session_tok");

    if (!session_tok) throw redirect(303, "/login");

    try {
        const sessions = await get_collection<Session>("sessions");
        const ses = await sessions.findOne({ token: session_tok });

        /* has it expired yet */
        if (!ses || ses.expiresAt < new Date()) {
            if (ses) await sessions.deleteOne({ token: session_tok });

            cookies.delete("session_tok", { path: "/" });
            throw redirect(303, "/login");
        }

        const users = await get_collection<User>("users");
        const user = await users.findOne({ _id: new ObjectId(ses.userId) });

        if (!user) {
            await sessions.deleteOne({ token: session_tok });
            cookies.delete("session_tok", { path: "/" });
            throw redirect(303, "/login");
        }

        return {
            user: {
                username: user.username,
                progress: user.progress,
                completed: user.completed,
            },
        };
    } catch (err) {
        cookies.delete("session_tok", { path: "/" });
        throw redirect(303, "/login");
    }
};
