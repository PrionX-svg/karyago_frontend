import React, { experimental_taintObjectReference } from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import RegisterForm from "@/components/auth/register-form";

// Mock the translation function from next-intl
jest.mock("next-intl", () => ({
    useTranslations: jest.fn(() => (key: string) => {
        const translations: Record<string, string> = {
            firstname: "First Name",
            lastname: "Last Name",
            phone: "Phone",
            email: "Email",
            password: "Password",
            confirmPassword: "Confirm Password",
            passwordMismatch: "Passwords do not match",
            passwordMatch: "Passwords match",
            agree1: "I agree to",
            termsAndConditions: "Terms and Conditions",
            privacyPolicy: "Privacy Policy",
            createAccount: "Create Account",
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
            { text: "Min 8 chars", met: password.length >= 8 },
            { text: "Upper & lowercase", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
            { text: "At least 1 number", met: /[0-9]/.test(password) },
            { text: "At least 1 special char", met: /[^A-Za-z0-9]/.test(password) },
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
        expect(screen.getByLabelText("firstName")).toBeInTheDocument();
        expect(screen.getByLabelText("lastName")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Terms and Conditions" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
    });

    it("shows password mismatch message when passwords do not match", () => {
        render(<RegisterForm />);
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "StrongPass123!" } });
        fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "AnotherPass" } });
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    it("disables submit button when form is incomplete", () => {
        render(<RegisterForm />);
        expect(screen.getByRole("button", { name: "Create Account" })).toBeDisabled();
    });

    it("enables submit button when all fields are valid", async () => {
        render(<RegisterForm />);
        // Fill required fields using userEvent for proper async updates
        await userEvent.type(screen.getByLabelText("firstName"), "John");
        await userEvent.type(screen.getByLabelText("lastName"), "Doe");
        await userEvent.type(screen.getByLabelText("Phone"), "+628123456789");
        await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "StrongPass123!");
        await userEvent.type(screen.getByLabelText("Confirm Password"), "StrongPass123!");
        const cbs = screen.getAllByRole("checkbox");
        for (const cb of cbs) {
            await userEvent.click(cb);
        }
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Create Account" })).toBeEnabled();
        });
    });

});

describe("RegisterForm White Box Tests", () => {
    it("enables submit when all fields valid and calls onSubmit", async () => {
        const handleSubmit = jest.fn();
        render(<RegisterForm onSubmit={handleSubmit} />);
        // Fill required fields using userEvent for proper async updates
        await userEvent.type(screen.getByLabelText("firstName"), "John");
        await userEvent.type(screen.getByLabelText("lastName"), "Doe");
        await userEvent.type(screen.getByLabelText("Phone"), "+628123456789");
        await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "StrongPass123!");
        await userEvent.type(screen.getByLabelText("Confirm Password"), "StrongPass123!");

        const cbs = screen.getAllByRole("checkbox");
        for (const cb of cbs) {
            await userEvent.click(cb);
        }

        screen.getAllByRole("checkbox").forEach((cb) => {
            console.log(cb.outerHTML);
        });

        // screen.debug();

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Create Account" })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole("button", { name: "Create Account" }));

        await waitFor(() =>
            expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
                firstname: "John",
                lastname: "Doe",
                phone: "+628123456789",
                email: "john@example.com",
                password: "StrongPass123!",
                confirmPassword: "StrongPass123!",
                privacyAccepted: true,
                termsAccepted: true,
                timezone: "+07:00"
            }))
        );
    });

    it("toggles password and confirm password visibility", () => {
        render(<RegisterForm />);
        const passwordInput = screen.getByLabelText(/password/i);
        const passwordToggle = screen.getAllByRole("button")[0];
        expect(passwordInput).toHaveAttribute("type", "password");
        fireEvent.click(passwordToggle);
        expect(passwordInput).toHaveAttribute("type", "password");

        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const confirmPasswordToggle = screen.getAllByRole("button")[1];
        expect(confirmPasswordInput).toHaveAttribute("type", "password");
        fireEvent.click(confirmPasswordToggle);
        expect(confirmPasswordInput).toHaveAttribute("type", "text");
    });

    it("shows password strength requirements", async () => {
        render(<RegisterForm />);
        await userEvent.type(screen.getByLabelText(/password/i), "StrongPass123!");
        expect(screen.getByText("Min 8 chars")).toBeInTheDocument();
        expect(screen.getByText("Upper & lowercase")).toBeInTheDocument();
        expect(screen.getByText("At least 1 number")).toBeInTheDocument();
        expect(screen.getByText("At least 1 special char")).toBeInTheDocument();

    });
});