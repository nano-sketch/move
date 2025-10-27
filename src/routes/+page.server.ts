import { get_collection } from "$lib/db";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import type { Session, User } from "$lib/db";
import { selected_theme } from "$lib/helpers";
import { ObjectId } from "mongodb";
import { redis } from "$lib/server/redis";

export const load: PageServerLoad = async ({ cookies }: { cookies: any }) => {
    const session_tok = cookies.get("session_tok");
    if (session_tok) {
        try {
            const sesssions = await get_collection<Session>("sessions");
            const ses = await sesssions.findOne({ token: session_tok });

            /* if it is a valid session (it is not expired) set is_logged_in to true */
            if (ses && ses.expiresAt > new Date()) {
                /* lets also update the theme */
                const user = await (
                    await get_collection<User>("users")
                ).findOne({ _id: new ObjectId(ses.userId) });

                selected_theme.set(user?.theme || "default");

                await redis.setex(
                    `online:${ses.userId}`,
                    60,
                    Date.now().toString(),
                );
                const okeys =
                    await redis.keys(
                        "online:*",
                    ); /* key all keys which are "online" */
                const ocount = okeys.length; /* how many users are online */

                return { is_logged_in: true, online_count: ocount };
            }

            if (ses) await sesssions.deleteOne({ token: session_tok });

            cookies.delete("session_tok", { path: "/" });
        } catch (err) {
            /* this is an invalid cookie so just clear */
            cookies.delete("session_tok", { path: "/" });
        }
    }

    return { is_logged_in: false };
};
