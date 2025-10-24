import { redirect } from "@sveltejs/kit";
import { get_collection, get_user } from "$lib/db";
import type { Session, User } from "$lib/db";
import { ObjectId } from "mongodb";

// {
//   leaderboard: [
//     {
//       username: string,
//       level: string,
//       xp: number,
//       completed: number,
//       rank: number
//     }
//   ],
//   current_user?: {
//     username: string,
//     level: string,
//     xp: number,
//     completed: number,
//     rank: number
//   }
// }
//
interface LeaderboardRow {
    username: string;
    level: string;
    xp: number;
    completed: number;
    rank: number;
}

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
        const all: LeaderboardRow[] = [];
        // const current: undefine;
        const cursor = users.find(
            {},
            {
                projection: {
                    username: 1,
                    experience: 1,
                    completed: 1,
                },
            },
        );

        for await (const user of cursor) {
            all.push({
                username: user.username,
                level: `Level ${Math.floor(user.experience / 100)}`,
                xp: user.experience,
                completed: user.completed.length,
                rank: 0,
            });
        }

        return {
            leaderboard: all,
            current_user: undefined,
        };
    } catch (err) {
        cookies.delete("session_tok", { path: "/" });
        throw redirect(303, "/login");
    }
};
