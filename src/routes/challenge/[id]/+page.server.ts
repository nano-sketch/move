import { fail, type Actions } from "@sveltejs/kit";
import { get_user, get_collection } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const prerender = false;

export const load: PageServerLoad = async ({ cookies, params }) => {
    const username = cookies.get("username");
    if (!username) throw redirect(302, "/login");

    const user = await get_user(username);
    if (!user) throw redirect(302, "/login");

    const challenge_id = parseInt(params.id);
    const is_completed =
        user.completedchallenges?.includes(challenge_id) || false;

    return {
        is_completed,
    };
};

export const actions: Actions = {
    complete: async ({ request, cookies }) => {
        const username = cookies.get("username");
        if (!username) return fail(401, { error: "not logged in" });

        const data = await request.formData();
        const challenge_id = parseInt(data.get("challenge_id") as string);

        const user = await get_user(username);
        if (!user) return fail(404, { error: "user not found" });

        if (user.completedchallenges?.includes(challenge_id))
            return { success: true, already_completed: true };

        const users = await get_collection("users");
        await users.updateOne(
            { username },
            {
                $addToSet: { completedchallenges: challenge_id },
            },
        );

        return { success: true };
    },
};
