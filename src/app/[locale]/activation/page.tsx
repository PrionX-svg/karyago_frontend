"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DLanguageSwitcher from "@/components/dashboard-language-switcher"
import LoadingStep from "@/components/auth/activation/loading-step"
import SuccessStep from "@/components/auth/activation/success-step"
import ErrorStep from "@/components/auth/activation/error-step"
import postAPI from "@/lib/api/postAPI"
import OtpSentStep from "@/components/auth/activation/otp-sent-step"

type ActivationState = "loading" | "success" | "error" | "otp-sent"

export default function ActivationPage() {
    const [activationState, setActivationState] = useState<ActivationState>("loading")
    const [errorMessage, setErrorMessage] = useState("")
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    // Function to send token to backend (placeholder for user to implement)
    const activateAccount = async (activationToken?: string) => {
        try {
            const response = await postAPI({
                uuid: activationToken,
            }, "/auth/verify")

            if (!response || response.status !== 200) {
                throw new Error("Failed to activate account")
            }

            return { success: true, message: "Account activated successfully" }
        } catch (error) {
            throw error
        }
    }


    // Function to request new activation OTP
    const requestNewOTP = async (activationToken: string) => {
        try {
            const response = await postAPI(
                {
                    uuid: activationToken,
                },
                "/auth/resend-verification",
            )
            if (!response || response.status !== 200) {
                throw new Error("Failed to send new activation code")
            }
            return response
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        const handleActivation = async () => {
            if (!token) {
                setErrorMessage("No activation token provided")
                setActivationState("error")
                return
            }
            try {
                await activateAccount(token)
                setActivationState("success")
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Activation failed")
                setActivationState("error")
            }
        }
        handleActivation()
    }, [token])

    const getStateTitle = (state: ActivationState) => {
        switch (state) {
            case "loading":
                return "Activating Account"
            case "success":
                return "Account Activated"
            case "error":
                return "Activation Failed"
            case "otp-sent":
                return "New Code Sent"
            default:
                return "Account Activation"
        }
    }

    const getStateDescription = (state: ActivationState) => {
        switch (state) {
            case "loading":
                return "Please wait while we activate your account..."
            case "success":
                return "Your account has been successfully activated"
            case "error":
                return "We couldn't activate your account. Please try again."
            case "otp-sent":
                return "A new activation code has been sent to your email"
            default:
                return ""
        }
    }

    const retryActivation = async () => {
        if (token) {
            setActivationState("loading")
            setErrorMessage("")

            try {
                await requestNewOTP(token)
                setActivationState("otp-sent")
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Failed to send new activation code")
                setActivationState("error")
            }
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
                    <CardHeader className="pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center animate-in zoom-in-50 duration-600 delay-800">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <CardTitle className="text-2xl text-center text-gray-800">{getStateTitle(activationState)}</CardTitle>
                        <CardDescription className="text-base text-center text-gray-600">
                            {getStateDescription(activationState)}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="min-h-[300px] flex items-center justify-center">
                            {activationState === "loading" && <LoadingStep />}
                            {activationState === "success" && <SuccessStep />}
                            {activationState === "error" && <ErrorStep message={errorMessage} onRetry={retryActivation} />}
                            {activationState === "otp-sent" && <OtpSentStep />}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
