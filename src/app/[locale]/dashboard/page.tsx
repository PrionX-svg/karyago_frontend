'use client';

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthDemo } from "@/components/auth-demo";
import { EmployeeDemo } from "@/components/employee-demo";
import { ClientOnly } from "@/components/client-only";
import { useAuthStore } from "@/stores";

export default function DashboardPage() {
  // Use separate translation hooks for different namespaces
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tNavigation = useTranslations("navigation");
  const tEmployees = useTranslations("employees");
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                HRIS {tNavigation("dashboard")}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {tCommon("welcome")}, {user?.firstName} {user?.lastName}
              </span>
              <ClientOnly
                fallback={
                  <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
                }
              >
                <LanguageSwitcher />
              </ClientOnly>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {tAuth("signOut")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>{tCommon("welcome")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This is a modern HRIS (Human Resource Information System)
                  frontend built with:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>Next.js 15 with TypeScript</li>
                  <li>Tailwind CSS for styling</li>
                  <li>shadcn/ui components</li>
                  <li>Zustand for state management</li>
                  <li>next-intl for internationalization</li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  {tEmployees("addEmployee")}
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  {tNavigation("dashboard")}
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  {tNavigation("settings")}
                </Button>
              </CardContent>
            </Card>

            {/* Auth Demo */}
            <ClientOnly
              fallback={
                <Card>
                  <CardHeader>
                    <CardTitle>{tCommon("loading")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              }
            >
              <AuthDemo />
            </ClientOnly>

            {/* Employee Demo */}
            <ClientOnly
              fallback={
                <Card>
                  <CardHeader>
                    <CardTitle>{tCommon("loading")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              }
            >
              <EmployeeDemo />
            </ClientOnly>
          </div>
        </div>
      </main>
    </div>
  );
}
