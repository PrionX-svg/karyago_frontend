import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/auth/login-form";

jest.mock("next-intl", () => ({
    useTranslations: jest.fn(() => (key: string) => {
        const translations: Record<string, string> = {
            email: "Email",
            password: "Password",
            remember: "Ingat Saya",
            forgotPassword: "Lupa Password?",
            signIn: "Masuk"
        };
        return translations[key] || key;
    }),
}));

describe("Login Form Test Black Box and White Box", () => {

    // Black Box Testing
    it("renders all form elements and labels in Indonesian", () => {
        render(<LoginForm onSubmit={jest.fn()} />);
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText("rememberMe")).toBeInTheDocument();
        expect(screen.getByText("Lupa Password?")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Masuk" })).toBeInTheDocument();

    });
    it("allows typing in email and password fields", () => {
        render(<LoginForm />);
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "tes@example.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
        expect(screen.getByLabelText("Email")).toHaveValue("tes@example.com");
        expect(screen.getByLabelText("Password")).toHaveValue("password123");
    });
    it("calls onSubmit with form data when form is submitted", () => {
        const handleSubmit = jest.fn();
        render(<LoginForm onSubmit={handleSubmit} />);
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "tes@example.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
        fireEvent.click(screen.getByLabelText("rememberMe"));
        fireEvent.click(screen.getByRole("button", { name: "Masuk" }));
        expect(handleSubmit).toHaveBeenCalledWith({
            email: "tes@example.com",
            password: "password123",
            remember: true,
        });

    });

    // White Box Testing
    it("toggles password visibility when the icon button is clicked (white-box)", () => {
        render(<LoginForm />);
        const passwordInput = screen.getByLabelText("Password");
        const toggleBtn = screen.getAllByRole("button")[0]; // the eye icon button

        // Initially, password type should be "password"
        expect(passwordInput).toHaveAttribute("type", "password");

        // Click to show password
        fireEvent.click(toggleBtn);
        expect(passwordInput).toHaveAttribute("type", "text");

        // Click to hide password again
        fireEvent.click(toggleBtn);
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("checkbox updates state (white-box)", () => {
        render(<LoginForm />);
        const checkbox = screen.getByLabelText("rememberMe");
        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });

    it("prevents submit if fields are empty (white-box)", () => {
        const handleSubmit = jest.fn();
        render(<LoginForm onSubmit={handleSubmit} />);
        fireEvent.click(screen.getByRole("button", { name: "Masuk" }));
        expect(handleSubmit).not.toHaveBeenCalled();
    });

});