interface PasswordValidationResult {
    isValid: boolean
    errors: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = []

    if (password.length < 8) {
        errors.push("Minimum 8 characters")
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Must contain at least one lowercase letter (a–z)")
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Must contain at least one uppercase letter (A–Z)")
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
        errors.push("Must include at least one special character (e.g. ! @ # $)")
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}
