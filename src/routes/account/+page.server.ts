import { redirect } from "@sveltejs/kit";
import { get_user } from "$lib/db";

export const load = async ({ cookies }) => {
    const username = cookies.get("username");

    if (!username) {
        throw redirect(303, "/login");
    }

    const user = await get_user(username);
    if (!user) {
        cookies.delete("username", { path: "/" });
        throw redirect(303, "/login");
    }

    return {
        user: {
            username: user.username,
            progress: user.progress,
            completed: user.completed,
            completed_challenges: user.completedchallenges || [],
        },
    };
};

export const actions = {
    logout: async ({ cookies }) => {
        cookies.delete("username", { path: "/" });
        throw redirect(303, "/login");
    },
};
