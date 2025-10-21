import { get_user } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const username = cookies.get("username");
    if (!username) throw redirect(302, "/login");

    const user = await get_user(username);
    if (!user) throw redirect(302, "/login");

    return {
        user: {
            username: user.username,
            completed_challenges: user.completedchallenges || [],
        },
    };
};
