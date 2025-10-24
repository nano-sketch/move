import { get_collection } from "$lib/db";
import type { PageServerLoad } from "./$types";
import type { Session, User } from "$lib/db";
import { ObjectId } from "mongodb";
import type { Themes } from "$lib/helpers";

export const load: PageServerLoad = async ({ cookies }) => {
    const session_tok = cookies.get("session_tok");
    let theme: Themes = "default";

    if (session_tok) {
        try {
            const sessions = await get_collection<Session>("sessions");
            const ses = await sessions.findOne({ token: session_tok });

            if (ses && ses.expiresAt > new Date()) {
                const user = await (
                    await get_collection<User>("users")
                ).findOne({ _id: new ObjectId(ses.userId) });

                theme = user?.theme || "default";

                return {
                    is_logged_in: true,
                    theme,
                };
            }
            if (ses) await sessions.deleteOne({ token: session_tok });
            cookies.delete("session_tok", { path: "/" });
        } catch (err) {
            cookies.delete("session_tok", { path: "/" });
        }
    }

    return {
        is_logged_in: false,
        theme,
    };
};
