export type PasswordRequirement = {
    text: string;
    met: boolean;
};

export function validatePassword(password: string): {
    isValid: boolean;
    requirements: PasswordRequirement[];
} {
    const requirements: PasswordRequirement[] = [
        { text: "Min 8 chars", met: password.length >= 8 },
        { text: "Upper & lowercase", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
        { text: "At least 1 number", met: /[0-9]/.test(password) },
        { text: "At least 1 special char", met: /[^A-Za-z0-9]/.test(password) },
    ];

    return {
        isValid: requirements.every((r) => r.met),
        requirements,
    };
}
