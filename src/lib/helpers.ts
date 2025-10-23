export const password_requirements = new Map([
    [
        "minimum-length",
        {
            test: (str: string) => str.length >= 7,
            error: "Password must be at least 7 characters.",
        },
    ],
    [
        "maximum-length",
        {
            test: (str: string) => str.length <= 24,
            error: "Password must not exceed 24 characters.",
        },
    ],
    [
        "has-uppercase",
        {
            test: (str: string) => /[A-Z]/.test(str),
            error: "Password must contain at least one uppercase letter.",
        },
    ],
    [
        "has-lowercase",
        {
            test: (str: string) => /[a-z]/.test(str),
            error: "Password must contain at least one lowercase letter.",
        },
    ],
    [
        "has-number",
        {
            test: (str: string) => /\d/.test(str),
            error: "Password must contain at least one number.",
        },
    ],
    [
        "has-special-char",
        {
            test: (str: string) =>
                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str),
            error: "Password must contain at least one special character.",
        },
    ],

    [
        "no-repeated-chars",
        {
            test: (str: string) => !/(.)\1{2,}/.test(str),
            error: "Password must not contain more than 2 consecutive characters.",
        },
    ],
]);

export function validate_password(password: string): {
    valid: boolean;
    error?: string;
} {
    for (const [_, requirement] of password_requirements) {
        if (!requirement.test(password)) {
            return { valid: false, error: requirement.error };
        }
    }

    return { valid: true };
}
