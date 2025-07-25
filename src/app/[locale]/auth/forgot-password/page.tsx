"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import EmailStep from "@/components/auth/forgot-password/email-step"
import OtpStep from "@/components/auth/forgot-password/otp-step"
import PasswordStep from "@/components/auth/forgot-password/password-step"
import SuccessStep from "@/components/auth/forgot-password/success-step"
import { useTranslations } from "next-intl"
import postAPI from "@/lib/api/postAPI"
import { toast } from "sonner"
import { ForgotPasswordForm } from "@/lib/interfaces/auth-interface"

type Step = "email" | "otp" | "password" | "success"

export default function ForgotPasswordPage() {
    const [currentStep, setCurrentStep] = useState<Step>("email")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const rp = useTranslations("forgotPassword")
    const nav = useTranslations("navigation")
    const ap = useTranslations("api")

    const handleEmailSubmit = async (emailData: { email: string }) => {
        setIsLoading(true)
        try {
            await postAPI({
                email: emailData.email
            }, "/auth/forgot-password")
            setEmail(emailData.email)
        } finally {
            setTimeout(() => {
                setCurrentStep("otp")
                setIsLoading(false)
            }, 2000)
        }
    }

    const handleOtpSubmit = async (otpData: { otp: string }) => {
        setIsLoading(true)
        try {
            const response = await postAPI({
                email: email,
                otp_code: otpData.otp
            }, "/auth/forgot-password/verify")
            if (response.status === 200) {
                setCurrentStep("password")
                setOtp(otpData.otp)
            } else {
                toast.error(ap("otpInvalid"), {
                    description: ap("otpErrorDescription")
                })
            }
        } catch {
            // Handle error
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setIsLoading(true)
        try {
            const response = await postAPI({ email: email }, "/auth/forgot-password/resend")
            if (response.status === 200) {
                toast.success(ap("otpResendSuccess"))
            } else {
                toast.error(ap("otpResendError"))
            }
        } catch {
            toast.error(ap("somethingWentWrong"))
            setIsLoading(false)
            return
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true)
        try {
            const response = await postAPI({
                email: data.email,
                otp_code: data.otp,
                new_password: data.newPassword
            }, "/auth/forgot-password/reset")
            if (response.status === 200) {
                toast.success(ap("passwordChangeSuccess"))
                setTimeout(() => {
                    setIsLoading(false)
                    setCurrentStep("success")
                }, 2000)
            } 
        } catch {
            toast.error(ap("somethingWentWrong"))
        } finally {
            setIsLoading(false)
        }
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
                return rp("title1")
            case "otp":
                return rp("title2")
            case "password":
                return rp("title3")
            case "success":
                return rp("titleSuccess")
            default:
                return rp("title1")
        }
    }

    const getStepDescription = (step: Step) => {
        switch (step) {
            case "email":
                return rp('description1')
            case "otp":
                return rp('description2', { email: email })
            case "password":
                return rp('description3')
            case "success":
                return rp('description4')
            default:
                return ""
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-1000 ease-out">
            <div className="absolute top-4 right-4 z-10 animate-in slide-in-from-top-2 duration-700 delay-300">
                <LanguageSwitcher />
            </div>

            <div className="absolute top-4 left-4 z-10 animate-in slide-in-from-top-2 duration-700 delay-300">
                <Link href="/auth">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {nav('backToLogin')}
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

                        {currentStep !== "success" && (
                            <>
                                <CardTitle className="text-2xl text-center text-gray-800">{getStepTitle(currentStep)}</CardTitle>
                                <CardDescription className="text-base text-center text-gray-600">
                                    {getStepDescription(currentStep)}
                                </CardDescription>
                            </>
                        )}
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
                                    <PasswordStep onSubmit={handlePasswordSubmit} isLoading={isLoading} email={email} otp={otp} />
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
