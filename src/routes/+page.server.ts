import { get_collection } from "$lib/db";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";
import type { Session, User } from "$lib/db";
import { selected_theme } from "$lib/helpers";
import { ObjectId } from "mongodb";

export const load: PageServerLoad = async ({ cookies }) => {
    // const username = cookies.get("username");

    // if (!username) {
    //     return {
    //         isLoggedIn: false,
    //     };
    // }

    // const user = await get_user(username);

    // return {
    //     isLoggedIn: !!user,
    // };

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

                return { is_logged_in: true };
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
