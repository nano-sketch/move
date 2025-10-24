/*
    basic = 10 experience points
    medium = 20 experience points
    hard = 30 experience points
*/
export type LevelCompletionType = "basic" | "medium" | "hard";

export const get_experience_for_type = (type: LevelCompletionType | string) => {
    switch (type) {
        case "basic":
            return 10;
        case "medium":
            return 20;
        case "hard":
            return 30;
        default:
            return 0;
    }
};
