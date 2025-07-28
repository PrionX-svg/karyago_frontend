"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import Link from "next/link";
import { validatePassword } from "@/lib/validate-password";
import type { RegisterForm } from "@/lib/interfaces/auth-interface";
import { getClientUTCOffset } from "@/lib/get-timezone";
import { useTranslations } from "next-intl";

interface RegisterFormProps {
  onSubmit?: (data: RegisterForm) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    privacyAccepted: false,
    timezone: getClientUTCOffset(),
  });
  const { isValid, requirements } = validatePassword(formData.password);
  const Register = useTranslations("auth");

  const isFormValid = useMemo(() => {
    const passwordCheck = validatePassword(formData.password);
    return (
      formData.firstname.trim() !== "" &&
      formData.lastname.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      formData.password === formData.confirmPassword &&
      formData.termsAccepted &&
      formData.privacyAccepted &&
      passwordCheck.isValid
    );
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit?.(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="register-firstname"
            className="text-sm text-gray-700 dark:text-stone-300"
          >
            {Register("firstName")}
          </Label>
          <Input
            id="register-firstname"
            type="text"
            placeholder="John"
            value={formData.firstname}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstname: e.target.value }))
            }
            className="border-gray-300 dark:border-stone-800 focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="register-lastname"
            className="text-sm text-gray-700 dark:text-stone-300"
          >
            {Register("lastName")}
          </Label>
          <Input
            id="register-lastname"
            type="text"
            placeholder="Doe"
            value={formData.lastname}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastname: e.target.value }))
            }
            className="border-gray-300 dark:border-stone-800 focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="register-phone"
          className="text-sm text-gray-700 dark:text-stone-300"
        >
          {Register("phone")}
        </Label>
        <Input
          id="register-phone"
          type="tel"
          placeholder="+62 812 3456 7890"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          className="border-gray-300 dark:border-stone-800 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="register-email"
          className="text-sm text-gray-700 dark:text-stone-300"
        >
          {Register("email")}
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border-gray-300 dark:border-stone-800 focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="register-password"
          className="text-sm text-gray-700 dark:text-stone-300"
        >
          {Register("password")}
        </Label>
        <div className="relative">
          <Input
            id="register-password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className={`border-gray-300 dark:border-stone-800 focus:border-orange-500 focus:ring-orange-500 pr-10 ${
              formData.password && !isValid
                ? "border-red-500 focus:border-red-500"
                : ""
            }`}
            required
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>

        {formData.password && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center text-xs">
                {req.met ? (
                  <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-400 mr-2" />
                )}
                <span className={req.met ? "text-green-600" : "text-gray-500"}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="register-confirm-password"
          className="text-sm text-gray-700 dark:text-stone-300"
        >
          {Register("confirmPassword")}
        </Label>
        <div className="relative">
          <Input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className={`border-gray-300 dark:border-stone-800 focus:border-orange-500 focus:ring-orange-500 pr-10 ${
              formData.confirmPassword && !isValid
                ? "border-red-500 focus:border-red-500"
                : ""
            }`}
            required
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
        {formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500 flex items-center">
              <XCircle className="w-3 h-3 mr-1" />
              {Register("passwordMismatch")}
            </p>
          )}
        {formData.confirmPassword &&
          formData.password === formData.confirmPassword && (
            <p className="text-xs text-green-600 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              {Register("passwordMatch")}
            </p>
          )}
      </div>

      <div className="flex items-start space-x-2">
        <Input
          type="checkbox"
          id="terms"
          checked={formData.termsAccepted}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              termsAccepted: e.target.checked,
            }))
          }
          className="w-4 h-4 text-orange-500 border-gray-300 dark:border-stone-800 rounded focus:ring-orange-500 mt-1"
        />
        <Label
          htmlFor="terms"
          className="text-sm text-gray-600 leading-relaxed dark:text-stone-300"
        >
          {Register("agree1")}{" "}
          <Link
            href="/terms"
            className="text-orange-600 hover:text-orange-700 hover:underline"
          >
            {Register("termsAndConditions")}
          </Link>
        </Label>
      </div>

      <div className="flex items-start space-x-2">
        <Input
          type="checkbox"
          id="privacy"
          checked={formData.privacyAccepted}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              privacyAccepted: e.target.checked,
            }))
          }
          className="w-4 h-4 text-orange-500 border-gray-300 dark:border-stone-800 rounded focus:ring-orange-500 mt-1"
        />
        <Label
          htmlFor="privacy"
          className="text-sm text-gray-600 leading-relaxed dark:text-stone-300"
        >
          {Register("agree1")}{" "}
          <Link
            href="/privacy"
            className="text-orange-600 hover:text-orange-700 hover:underline"
          >
            {Register("privacyPolicy")}
          </Link>
        </Label>
      </div>

      <Button
        type="submit"
        disabled={!isFormValid}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {Register("createAccount")}
      </Button>
    </form>
  );
}
