import { get_collection } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Session, User } from "$lib/db";
import { ObjectId } from "mongodb";

export const load: PageServerLoad = async ({ cookies }) => {
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

        return {
            user: {
                username: user.username,
                completed_challenges: user.completedchallenges || [],
            },
        };
    } catch (err) {
        cookies.delete("session_tok", { path: "/" });
        throw redirect(302, "/login");
    }
};
