import React, { experimental_taintObjectReference } from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import RegisterForm from "@/components/auth/register-form";
import { time } from "console";

// Mock the translation function from next-intl
jest.mock("next-intl", () => ({
    useTranslations: jest.fn(() => (key: string) => {
        const translations: Record<string, string> = {
            firstName: "Vorname",
            lastName: "Nachname",
            phone: "Phone",
            email: "Email",
            password: "Passwort",
            confirmPassword: "Passwort bestätigen",
            passwordMismatch: "Passwort stimmt nicht überein",
            passwordMatch: "Passwortübereinstimmung",
            agree1: "Ich stimme zu",
            termsAndConditions: "Allgemeine Geschäftsbedingungen",
            privacyPolicy: "Datenschutzrichtlinie",
            createAccount: "Konto erstellen",
        };
        return translations[key] || key;
    }),
}));

// Mock the validatePassword function
jest.mock('@/lib/validate-password', () => ({
    __esModule: true,
    validatePassword: (password: string) => ({
        isValid:
            password.length >= 8 &&
            /[A-Z]/.test(password) &&      // Uppercase
            /[a-z]/.test(password) &&      // Lowercase
            /\d/.test(password) &&         // Number
            /[^A-Za-z0-9]/.test(password), // Special character
        requirements: [
            { text: "Mindestens 8 Zeichen", met: password.length >= 8 },
            { text: "Groß- und Kleinbuchstaben", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
            { text: "Mindestens 1 Zahl", met: /\d/.test(password) },
            { text: "Mindestens 1 Sonderzeichen", met: /[^A-Za-z0-9]/.test(password) },
        ],
    }),
}));

// Mock Time Zone fron getClientUTCOffset function
jest.mock('@/lib/get-timezone', () => ({
    getClientUTCOffset: () => "+07:00",
}));

describe("Register Form Test Black Box", () => {
    it("renders all main fields and labels", () => {
        render(<RegisterForm />);
        expect(screen.getByLabelText("Vorname")).toBeInTheDocument();
        expect(screen.getByLabelText("Nachname")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Passwort bestätigen")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Allgemeine Geschäftsbedingungen" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Datenschutzrichtlinie" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Konto erstellen" })).toBeInTheDocument();
    });

    it("shows password mismatch message when passwords do not match", () => {
        render(<RegisterForm />);
        fireEvent.change(screen.getByLabelText(/passwort/i), { target: { value: "SicherePasswort123!" } });
        fireEvent.change(screen.getByLabelText("Passwort bestätigen"), { target: { value: "AnderePasswort123!" } });
        expect(screen.getByText("Passwort stimmt nicht überein")).toBeInTheDocument();
    });

    it("disables submit button when form is incomplete", () => {
        render(<RegisterForm />);
        expect(screen.getByRole("button", { name: "Konto erstellen" })).toBeDisabled();
    });

});

describe("RegisterForm White Box Tests", () => {
    it("enables submit when all fields valid and calls onSubmit", async () => {
        const handleSubmit = jest.fn();
        render(<RegisterForm onSubmit={handleSubmit} />);
        // Fill required fields using userEvent for proper async updates
        await userEvent.type(screen.getByLabelText("Vorname"), "John");
        await userEvent.type(screen.getByLabelText("Nachname"), "Doe");
        await userEvent.type(screen.getByLabelText("Phone"), "+628123456789");
        await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
        await userEvent.type(screen.getByLabelText(/passwort/i), "SicherePasswort123!");
        await userEvent.type(screen.getByLabelText("Passwort bestätigen"), "SicherePasswort123!");

        const allChecbox = screen.getAllByRole("checkbox");
        for (const checkboxes of allChecbox) {
            await userEvent.click(checkboxes);
        }

        screen.getAllByRole("checkbox").forEach((checkboxes) => {
            console.log(checkboxes.outerHTML);
        });

        // screen.debug();

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Konto erstellen" })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole("button", { name: "Konto erstellen" }));

        await waitFor(() =>
            expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
                firstname: "John",
                lastname: "Doe",
                phone: "+628123456789",
                email: "john@example.com",
                password: "SicherePasswort123!",
                confirmPassword: "SicherePasswort123!",
                privacyAccepted: true,
                termsAccepted: true,
                timezone: "+07:00"
            }))
        );
    });

    it("toggles password and confirm password visibility", () => {
        render(<RegisterForm />);
        const passwordInput = screen.getByLabelText(/passwort/i);
        const passwordToggle = screen.getAllByRole("button")[0];
        expect(passwordInput).toHaveAttribute("type", "password");
        fireEvent.click(passwordToggle);
        expect(passwordInput).toHaveAttribute("type", "password");

        const confirmPasswordInput = screen.getByLabelText("Passwort bestätigen");
        const confirmPasswordToggle = screen.getAllByRole("button")[1];
        expect(confirmPasswordInput).toHaveAttribute("type", "password");
        fireEvent.click(confirmPasswordToggle);
        expect(confirmPasswordInput).toHaveAttribute("type", "text");
    });

    // it("shows password strength requirements", () => {
    //     render(<RegisterForm />);
    //     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "test" } });
    //     expect(screen.getByText("Min 8 chars")).toBeInTheDocument();
    //     expect(screen.getByText("Upper & lowercase")).toBeInTheDocument();
    //     expect(screen.getByText("At least 1 number")).toBeInTheDocument();
    //     expect(screen.getByText("At least 1 special char")).toBeInTheDocument();

    // });
});