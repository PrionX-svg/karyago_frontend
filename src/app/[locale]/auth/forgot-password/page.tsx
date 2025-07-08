"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DLanguageSwitcher from "@/components/dashboard-language-switcher"
import EmailStep from "@/components/auth/forgot-password/email-step"
import OtpStep from "@/components/auth/forgot-password/otp-step"
import PasswordStep from "@/components/auth/forgot-password/password-step"
import SuccessStep from "@/components/auth/forgot-password/success-step"

type Step = "email" | "otp" | "password" | "success"

export default function ForgotPasswordPage() {
    const [currentStep, setCurrentStep] = useState<Step>("email")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailSubmit = async (emailData: { email: string }) => {
        setIsLoading(true)
        setEmail(emailData.email)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setCurrentStep("otp")
        }, 2000)
    }

    const handleOtpSubmit = async (otpData: { otp: string }) => {
        setIsLoading(true)

        // Simulate OTP verification
        setTimeout(() => {
            setIsLoading(false)
            if (otpData.otp === "123456") {
                // Mock validation
                setCurrentStep("password")
            } else {
                alert("Invalid OTP. Please try again.")
            }
        }, 1500)
    }

    const handlePasswordSubmit = async (passwordData: { password: string; confirmPassword: string }) => {
        setIsLoading(true)
        console.log("New Password:", passwordData)

        // Simulate password reset
        setTimeout(() => {
            setIsLoading(false)
            setCurrentStep("success")
        }, 2000)
    }

    const handleResendOtp = async () => {
        setIsLoading(true)

        // Simulate resend OTP
        setTimeout(() => {
            setIsLoading(false)
            alert("OTP has been resent to your email")
        }, 1000)
    }

    const getStepNumber = (step: Step) => {
        switch (step) {
            case "email":
                return 1
            case "otp":
                return 2
            case "password":
                return 3
            case "success":
                return 4
            default:
                return 1
        }
    }

    const getStepTitle = (step: Step) => {
        switch (step) {
            case "email":
                return "Reset Password"
            case "otp":
                return "Verify Email"
            case "password":
                return "New Password"
            case "success":
                return "Password Reset"
            default:
                return "Reset Password"
        }
    }

    const getStepDescription = (step: Step) => {
        switch (step) {
            case "email":
                return "Enter your email address and we'll send you a verification code"
            case "otp":
                return `We've sent a verification code to ${email}`
            case "password":
                return "Create a new password for your account"
            case "success":
                return "Your password has been successfully reset"
            default:
                return ""
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-1000 ease-out">
            <div className="absolute top-4 right-4 z-10 animate-in slide-in-from-top-2 duration-700 delay-300">
                <DLanguageSwitcher />
            </div>

            <div className="absolute top-4 left-4 z-10 animate-in slide-in-from-top-2 duration-700 delay-300">
                <Link href="/auth">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Button>
                </Link>
            </div>

            <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-800 delay-400">
                <Card className="border-0 shadow-xl">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center animate-in zoom-in-50 duration-600 delay-800">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${getStepNumber(currentStep) >= step
                                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {step}
                                        </div>
                                        {step < 4 && (
                                            <div
                                                className={`w-8 h-0.5 mx-1 transition-all duration-300 ${getStepNumber(currentStep) > step
                                                    ? "bg-gradient-to-r from-orange-500 to-red-500"
                                                    : "bg-gray-200"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <CardTitle className="text-2xl text-center text-gray-800">{getStepTitle(currentStep)}</CardTitle>
                        <CardDescription className="text-base text-center text-gray-600">
                            {getStepDescription(currentStep)}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Step Content Container with Horizontal Animation */}
                        <div className="relative overflow-hidden">
                            {getStepNumber(currentStep) === 1 && (
                                <div className="px-2">
                                    <EmailStep onSubmit={handleEmailSubmit} isLoading={isLoading} />
                                </div>
                            )}

                            {getStepNumber(currentStep) === 2 && (
                                <div className="px-2">
                                    <OtpStep onSubmit={handleOtpSubmit} onResend={handleResendOtp} email={email} isLoading={isLoading} />
                                </div>
                            )}

                            {getStepNumber(currentStep) === 3 && (
                                <div className="px-2">
                                    <PasswordStep onSubmit={handlePasswordSubmit} isLoading={isLoading} />
                                </div>
                            )}

                            {getStepNumber(currentStep) === 4 && (
                                <div className="px-2">
                                    <SuccessStep />
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
