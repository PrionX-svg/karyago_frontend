"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import LoginFormComponent from "@/components/auth/login-form";
import RegisterFormComponent from "@/components/auth/register-form";
import { useTranslations } from "next-intl";
import RegisterSuccessStep from "@/components/auth/register-success-step";
import postAPI from "@/lib/api/postAPI";
import { toast } from "sonner";
import type { LoginForm, RegisterForm } from "@/lib/interfaces/auth-interface";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/stores/company-store";
import { api } from "@/lib/api/api";
import {encrypt} from "@/lib/encrypt";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const router = useRouter();
  const ap = useTranslations("api");
  const BrandingPage = useTranslations("brand");
  const AuthPage = useTranslations("auth");

  const handleLogin = async (data: LoginForm) => {
    try {
      const result = await postAPI(data, "/auth/login");

      if (result.status !== 200) {
        toast.error(ap("loginFailed"), {
          description: ap("invalidCredentials"),
        });
        return;
      }

      document.cookie = "authOK=true; path=/";
      toast.success(ap("loginSuccess"));

      const userData = result.data.data;

      if (userData.is_onboarding) return router.push("/onboarding");

      const userUuid = userData.uuid;
      await api.getCompaniesByUserUuid(userUuid);

      const { company } = useCompanyStore.getState();

      if (!company?.length) {
        return toast.error(ap("noCompanyFound"));
      }

      localStorage.setItem("atem", await encrypt(company[0].uuid));

      if (company.length === 1) {
        const formattedName = company[0].name.replace(/\s+/g, "");
        return router.push(`/${formattedName}/`);
      }

      router.push("/select-company");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(ap("somethingWentWrong"));
    }
  };


  const handleRegister = async (data: RegisterForm) => {
    try {
      const result = await postAPI(data, "/auth/register");
      if (result.status === 201) {
        setRegisteredEmail(data.email);
        setRegistrationSuccess(true);
        toast.success(ap("registerSuccess"), {
          description: ap("checkEmailForActivation"),
        });
      } else if (result.status === 500) {
        toast.error(ap("registerFailed"), {
          description: ap("emailAlreadyExists"),
        });
      }
    } catch {
      toast.error(ap("somethingWentWrong"));
    }
  };

  const handleBackToRegister = () => {
    setRegistrationSuccess(false);
    setRegisteredEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-in fade-in-0 duration-1000 ease-out bg-slate-50 dark:bg-gradient-to-bl from-stone-700 to-stone-950">
      <div className="absolute top-4 right-4 z-10 animate-in slide-in-from-top-2 duration-700 delay-300">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8 animate-in slide-in-from-left-8 duration-800 delay-200">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center animate-in zoom-in-50 duration-600 delay-500">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-stone-100">
                  {BrandingPage("brandingTitle")}
                </h1>
                <p className="text-base text-gray-600 dark:text-muted-foreground">
                  {BrandingPage("brandingSubtitle")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 animate-in slide-in-from-left-4 duration-600 ">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-stone-100">
                  {BrandingPage("brand1")}
                </h3>
                <p className="text-base text-gray-600 dark:text-muted-foreground">
                  {BrandingPage("brand1Description")}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 animate-in slide-in-from-left-4 duration-600 ">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-stone-100">
                  {BrandingPage("brand2")}
                </h3>
                <p className="text-base text-gray-600 dark:text-muted-foreground">
                  {BrandingPage("brand2Description")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white animate-in slide-in-from-left-4 duration-600">
            <h3 className="font-semibold mb-2">
              {BrandingPage("welcomeMessage")}
            </h3>
            <p className="text-base opacity-90">
              {BrandingPage("welcomeDescription")}
            </p>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex justify-center animate-in slide-in-from-right-8 duration-800 delay-400">
          <Card className="w-full max-w-md border-0 shadow-xl">
            {!registrationSuccess && (
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center animate-in zoom-in-50 duration-600 delay-800">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center text-gray-800 dark:text-slate-100">
                  {AuthPage("title")}
                </CardTitle>
                <CardDescription className="text-base text-center text-gray-600 dark:text-muted-foreground">
                  {AuthPage("description")}
                </CardDescription>
              </CardHeader>
            )}
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                {!registrationSuccess && (
                  <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl p-1 px-2 h-10 bg-gradient-to-r from-gray-100 to-gray-50 dark:bg-gradient-r dark:from-stone-800 dark:to-stone-900">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-500 rounded-lg font-medium"
                    >
                      {AuthPage("signIn")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-500 rounded-lg font-medium"
                    >
                      {AuthPage("signUp")}
                    </TabsTrigger>
                  </TabsList>
                )}

                {/* Tab Content Container with Horizontal Animation */}
                <div className="relative overflow-hidden p-2">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(${
                        activeTab === "login" ? "0%" : "-50%"
                      })`,
                      width: "200%",
                    }}
                  >
                    {/* Login Form */}
                    <div className="w-1/2 flex-shrink-0 pr-4">
                      <div className="transform transition-all duration-300">
                        <LoginFormComponent onSubmit={handleLogin} />
                      </div>
                    </div>

                    {/* Register Form */}
                    <div className="w-1/2 flex-shrink-0">
                      <TabsContent
                        value="register"
                        className="m-0 animate-in fade-in-0 duration-300"
                      >
                        <div className="transform transition-all duration-300">
                          {registrationSuccess ? (
                            <RegisterSuccessStep
                              email={registeredEmail}
                              onBackToRegister={handleBackToRegister}
                            />
                          ) : (
                            <RegisterFormComponent onSubmit={handleRegister} />
                          )}
                        </div>
                      </TabsContent>
                    </div>
                  </div>
                </div>

                {/* Hidden TabsContent for accessibility */}
                <div className="sr-only">
                  <TabsContent value="login">Login Form</TabsContent>
                  <TabsContent value="register">Register Form</TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
