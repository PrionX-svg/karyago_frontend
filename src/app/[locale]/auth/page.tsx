"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users } from "lucide-react"
import DLanguageSwitcher from "@/components/dashboard-language-switcher"
import LoginFormComponent from "@/components/auth/login-form"
import RegisterFormComponent from "@/components/auth/register-form"
import { useTranslations } from "next-intl"
import RegisterSuccessStep from "@/components/auth/register-success-step"
import postAPI from "@/lib/api/postAPI"
import { toast } from "sonner"
import type { LoginForm, RegisterForm } from "@/lib/interfaces/auth-interface"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const router = useRouter()

  const handleLogin = async (data: LoginForm) => {
    try {
      const result = await postAPI(data, "/auth/login")
      if (result.status === 200) {
        document.cookie = "authOK=true; path=/";
        router.push("/dashboard")
        toast.success("Login successful!", {
          description: "Welcome back!",
        })
      } else {
        console.error("Login failed:", result)
      }
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleRegister = async (data: RegisterForm) => {
    try {
      const result = await postAPI(data, "/auth/register")
      if (result.status === 201) {
        setRegisteredEmail(data.email)
        setRegistrationSuccess(true)
        toast.success("Registration successful!", {
          description: "Please check your email for the activation link.",
        })
      } else {
        console.error("Registration failed:", result)
      }
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  const handleBackToRegister = () => {
    setRegistrationSuccess(false)
    setRegisteredEmail("")
  }

  const BrandingPage = useTranslations("brand")
  const AuthPage = useTranslations("auth")

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-1000 ease-out">
      <div className="absolute top-4 right-4 z-10 animate-in slide-in-from-top-2 duration-700 delay-300">
        <DLanguageSwitcher />
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
                <h1 className="text-2xl font-bold text-gray-800">{BrandingPage("brandingTitle")}</h1>
                <p className="text-base text-gray-600">{BrandingPage("brandingSubtitle")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 animate-in slide-in-from-left-4 duration-600 delay-700">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">{BrandingPage("brand1")}</h3>
                <p className="text-base text-gray-600">{BrandingPage("brand1Description")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 animate-in slide-in-from-left-4 duration-600 delay-900">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">{BrandingPage("brand2")}</h3>
                <p className="text-base text-gray-600">{BrandingPage("brand2Description")}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white animate-in slide-in-from-left-4 duration-600 delay-1100">
            <h3 className="font-semibold mb-2">{BrandingPage("welcomeMessage")}</h3>
            <p className="text-base opacity-90">{BrandingPage("welcomeDescription")}</p>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex justify-center animate-in slide-in-from-right-8 duration-800 delay-400">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center animate-in zoom-in-50 duration-600 delay-800">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-gray-800">{AuthPage("title")}</CardTitle>
              <CardDescription className="text-base text-center text-gray-600">
                {AuthPage("description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {!registrationSuccess && (
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1">
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
                <div className="relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(${activeTab === "login" ? "0%" : "-50%"})`,
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
                      <TabsContent value="register" className="m-0 animate-in fade-in-0 duration-300">
                        <div className="transform transition-all duration-300">
                          {registrationSuccess ? (
                            <RegisterSuccessStep email={registeredEmail} onBackToRegister={handleBackToRegister} />
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
  )
}
