"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users } from "lucide-react"
import DLanguageSwitcher from "@/components/dashboard-language-switcher"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import { useTranslations } from "next-intl"

export default function AuthPage() {
  const handleLogin = (data: { email: string; password: string; remember: boolean }) => {
    console.log("Login data:", data)
    // Handle login logic here
  }

  const handleRegister = (data: {
    email: string
    password: string
    confirmPassword: string
    termsAccepted: boolean
    privacyAccepted: boolean
  }) => {
    console.log("Register data:", data)
    // Handle registration logic here
  }

  const BrandingPage = useTranslations("brand")
  const AuthPage = useTranslations("auth")

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-10">
        <DLanguageSwitcher />
      </div>
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{BrandingPage("brandingTitle")}</h1>
                <p className="text-base text-gray-600">{BrandingPage("brandingSubtitle")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">{BrandingPage("brand1")}</h3>
                <p className="text-base text-gray-600">
                  {BrandingPage("brand1Description")}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">{BrandingPage("brand2")}</h3>
                <p className="text-base text-gray-600">
                  {BrandingPage("brand2Description")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">{BrandingPage("welcomeMessage")}</h3>
            <p className="text-base opacity-90">{BrandingPage("welcomeDescription")}</p>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-gray-800">{AuthPage("title")}</CardTitle>
              <CardDescription className="text-base text-center text-gray-600">
                {AuthPage("description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login" className="w-full">
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

                  {/* Login Form */}
                  <TabsContent 
                    value="login"
                    className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out"
                  >
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <LoginForm onSubmit={handleLogin} />
                    </div>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent 
                    value="register"
                    className="animate-in fade-in-0 slide-in-from-top-4 duration-700 ease-out"
                  >
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <RegisterForm onSubmit={handleRegister} />
                    </div>
                  </TabsContent>
                </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
