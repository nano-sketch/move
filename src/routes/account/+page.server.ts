import { redirect, fail } from "@sveltejs/kit";
import { get_collection, get_user } from "$lib/db";
import type { Session, User } from "$lib/db";
import { ObjectId } from "mongodb";

export const load = async ({ cookies }) => {
    const session_tok = cookies.get("session_tok");

    if (!session_tok) throw redirect(303, "/login");

    try {
        const sessions = await get_collection<Session>("sessions");
        const ses = await sessions.findOne({ token: session_tok });

        /* yet again, verify if it's expired */
        if (!ses || ses.expiresAt <= new Date()) {
            if (ses)
                await sessions.deleteOne({
                    token: session_tok,
                }); /* invalid token so get rid of it */
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
                experience: user.experience,
                completed_challenges: user.completedchallenges || [],
            },
        };
    } catch (err) {
        cookies.delete("session_tok", { path: "/" });
        throw redirect(303, "/login");
    }
};

export const actions = {
    logout: async ({ cookies }) => {
        const session_tok = cookies.get("session_tok");

        if (session_tok) {
            try {
                const sessions = await get_collection<Session>("sessions");
                await sessions.deleteOne({
                    token: session_tok,
                }); /* i forgot to do this and i was wondering why it still worked... */
            } catch (err) {
                console.error(
                    `accout/+page.server.ts logout action error: ${err}`,
                );
            }
        }

        cookies.delete("session_tok", { path: "/" });
        throw redirect(303, "/login");
    },

    reset: async ({ cookies }) => {
        const session_tok = cookies.get("session_tok");

        if (session_tok) {
            try {
                const sessions = await get_collection<Session>("sessions");
                const ses = await sessions.findOne({ token: session_tok });

                if (!ses || ses.expiresAt <= new Date()) {
                    if (ses) await sessions.deleteOne({ token: session_tok });
                    cookies.delete("session_tok", { path: "/" });
                    return fail(401, { error: "Not authenticated." });
                }

                const users = await get_collection<User>("users");

                await users.updateOne(
                    { _id: new ObjectId(ses.userId) },
                    {
                        $set: {
                            progress: 0,
                            experience: 0,
                            completed: [],
                            completedchallenges: [],
                        },
                    },
                );

                return { success: true };
            } catch (err) {
                console.error("db error:", err);
                return fail(500, { error: "Failed to update progress." });
            }
        }

        throw redirect(303, "/login");
    },
};
