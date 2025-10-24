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
interface UserRow {
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
        const all: UserRow[] = [];
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

        all.sort((a, b) => b.xp - a.xp);
        all.forEach((user, index) => {
            user.rank = index + 1;
        });

        let current_user: UserRow | undefined = undefined;
        const current_user_obj = await users.findOne({
            _id: new ObjectId(ses.userId),
        });

        if (current_user_obj) {
            current_user = {
                username: current_user_obj.username,
                level: `Level ${Math.floor(current_user_obj.experience / 100)}`,
                xp: current_user_obj.experience,
                completed: current_user_obj.completed.length,
                rank: 0,
            } as UserRow;
        }

        return {
            leaderboard: all,
            current_user: current_user,
        };
    } catch (err) {
        cookies.delete("session_tok", { path: "/" });
        throw redirect(303, "/login");
    }
};
