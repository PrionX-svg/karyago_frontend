import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/auth/login-form";

jest.mock("next-intl", () => ({
    useTranslations: jest.fn(() => (key: string) => {
        const translations: Record<string, string> = {
            email: "E-mail",
            password: "Passwort",
            remember: "Angemeldet bleiben",
            forgotPassword: "Passwort vergessen?",
            signIn: "Anmelden",
        };
        return translations[key] || key;
    }),
}));

describe("Login Form Test Black Box and White Box", () => {

    // Black Box Testing
    it("renders all form elements and labels in Germany", () => {
        render(<LoginForm onSubmit={jest.fn()} />);
        expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
        expect(screen.getByLabelText("Passwort")).toBeInTheDocument();
        expect(screen.getByLabelText("rememberMe")).toBeInTheDocument();
        expect(screen.getByText("Passwort vergessen?")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Anmelden" })).toBeInTheDocument();

    });
    it("allows typing in email and password fields", () => {
        render(<LoginForm />);
        fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText("Passwort"), { target: { value: "passwort123" } });
        expect(screen.getByLabelText("E-mail")).toHaveValue("test@example.com");
        expect(screen.getByLabelText("Passwort")).toHaveValue("passwort123");
    });
    it("calls onSubmit with form data when form is submitted", () => {
        const handleSubmit = jest.fn();
        render(<LoginForm onSubmit={handleSubmit} />);
        fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText("Passwort"), { target: { value: "passwort123" } });
        fireEvent.click(screen.getByLabelText("rememberMe"));
        fireEvent.click(screen.getByRole("button", { name: "Anmelden" }));
        expect(handleSubmit).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "passwort123",
            remember: true,
        });

    });

    // White Box Testing
    it("toggles password visibility when the icon button is clicked (white-box)", () => {
        render(<LoginForm />);
        const passwordInput = screen.getByLabelText("Passwort");
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
        fireEvent.click(screen.getByRole("button", { name: "Anmelden" }));
        expect(handleSubmit).not.toHaveBeenCalled();
    });

});