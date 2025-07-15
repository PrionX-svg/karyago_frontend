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
            firstName: "Nama Depan",
            lastName: "Nama Belakang",
            phone: "Phone",
            email: "Email",
            password: "Password",
            confirmPassword: "Konfirmasi Password",
            passwordMismatch: "Password tidak cocok",
            passwordMatch: "Password cocok",
            agree1: "Saya setuju dengan",
            termsAndConditions: "Syarat dan Ketentuan",
            privacyPolicy: "Syarat Privasi",
            createAccount: "Buat Akun",
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
            { text: "Minimal 8 karakter", met: password.length >= 8 },
            { text: "Huruf besar & kecil", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
            { text: "Minimal 1 angka", met: /\d/.test(password) },
            { text: "Minimal 1 karakter khusus", met: /[^A-Za-z0-9]/.test(password) },
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
        expect(screen.getByLabelText("Nama Depan")).toBeInTheDocument();
        expect(screen.getByLabelText("Nama Belakang")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Konfirmasi Password")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Syarat dan Ketentuan" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Syarat Privasi" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Buat Akun" })).toBeInTheDocument();
    });

    it("shows password mismatch message when passwords do not match", () => {
        render(<RegisterForm />);
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "PasswordAman123!" } });
        fireEvent.change(screen.getByLabelText("Konfirmasi Password"), { target: { value: "PasswordLain123!" } });
        expect(screen.getByText("Password tidak cocok")).toBeInTheDocument();
    });

    it("disables submit button when form is incomplete", () => {
        render(<RegisterForm />);
        expect(screen.getByRole("button", { name: "Buat Akun" })).toBeDisabled();
    });

});

describe("RegisterForm White Box Tests", () => {
    it("enables submit when all fields valid and calls onSubmit", async () => {
        const handleSubmit = jest.fn();
        render(<RegisterForm onSubmit={handleSubmit} />);
        // Fill required fields using userEvent for proper async updates
        await userEvent.type(screen.getByLabelText("Nama Depan"), "John");
        await userEvent.type(screen.getByLabelText("Nama Belakang"), "Doe");
        await userEvent.type(screen.getByLabelText("Phone"), "+628123456789");
        await userEvent.type(screen.getByLabelText("Email"), "john@contoh.com");
        await userEvent.type(screen.getByLabelText(/password/i), "PasswordAman123!");
        await userEvent.type(screen.getByLabelText("Konfirmasi Password"), "PasswordAman123!");

        const allChecbox = screen.getAllByRole("checkbox");
        for (const checkboxes of allChecbox) {
            await userEvent.click(checkboxes);
        }

        screen.getAllByRole("checkbox").forEach((checkboxes) => {
            console.log(checkboxes.outerHTML);
        });

        // screen.debug();

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Buat Akun" })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole("button", { name: "Buat Akun" }));

        await waitFor(() =>
            expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
                firstname: "John",
                lastname: "Doe",
                phone: "+628123456789",
                email: "john@contoh.com",
                password: "PasswordAman123!",
                confirmPassword: "PasswordAman123!",
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

        const confirmPasswordInput = screen.getByLabelText("Konfirmasi Password");
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