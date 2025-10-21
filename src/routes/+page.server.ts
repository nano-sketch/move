import { get_user } from "$lib/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const username = cookies.get("username");
    
    if (!username) {
        return {
            isLoggedIn: false,
        };
    }

    const user = await get_user(username);
    
    return {
        isLoggedIn: !!user,
    };
};
