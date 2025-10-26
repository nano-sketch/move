import { get_collection } from "$lib/db";
import type { Session } from "$lib/db";
import type { WithId } from "mongodb";

export async function get_session(
    session_token: string,
): Promise<{ session: WithId<Session> | null; error?: string }> {
    if (!session_token)
        return {
            session: null,
            error: "session_token string is undefined or null",
        };

    const sessions = await get_collection<Session>("sessions");
    const session = await sessions.findOne({ token: session_token });

    if (session && session.expiresAt > new Date())
        return {
            session: session,
        };

    /* If the token does exist but it has expired, delete it from db */
    if (session) await sessions.deleteOne({ token: session_token });

    return {
        session: null,
        error: "failed to retrieve session from sessions collection",
    };
}
