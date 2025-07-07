"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuthStore } from "@/stores";
import { ClientOnly } from "@/components/client-only";
import Link from "next/link";

export default function RegisterPage() {
  // Use separate translation hooks for different namespaces
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tEmployees = useTranslations("employees");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError(tAuth("passwordMismatch"));
      return;
    }

    if (formData.password.length < 6) {
      setError(tAuth("passwordTooShort"));
      return;
    }

    try {
      // For demo purposes, we'll just log the user in after registration
      await login(formData.email);
      router.push(`/${locale}/dashboard`);
    } catch {
      setError(tAuth("registrationFailed"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Register Form */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {tAuth("createAccount")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {tAuth("alreadyHaveAccount")}{" "}
            <Link
              href={`/${locale}/login`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {tAuth("signIn")}
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{tCommon("register")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">{tEmployees("firstName")}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">{tEmployees("lastName")}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{tAuth("email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">{tAuth("password")}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    {tAuth("confirmPassword")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? tCommon("loading") : tAuth("createAccount")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Language Switcher at Bottom */}
      <div className="fixed bottom-6 right-6">
        <ClientOnly
          fallback={
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          }
        >
          <LanguageSwitcher />
        </ClientOnly>
      </div>
    </div>
  );
}
