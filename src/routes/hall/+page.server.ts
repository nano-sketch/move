import { fail, type Actions } from "@sveltejs/kit";
import { get_user, get_collection } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
export const prerender = false;
export const load: PageServerLoad = async ({ cookies }) => {
    const username = cookies.get("username");
    if (!username) throw redirect(302, "/login");
    const user = await get_user(username);
    if (!user) throw redirect(302, "/login");
    const hallSolutions = user.solutionshallf?.length || 0;
    return {
        hallSolutions,
        username: user.username
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
        const users = await get_collection("users");
        await users.updateOne(
            { username },
            {
                $addToSet: { solutionshallf: challenge_id },
            },
        );
        return { success: true };
    },
};
