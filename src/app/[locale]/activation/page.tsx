"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DLanguageSwitcher from "@/components/dashboard-language-switcher"
import LoadingStep from "@/components/auth/activation/loading-step"
import SuccessStep from "@/components/auth/activation/success-step"
import ErrorStep from "@/components/auth/activation/error-step"
import postAPI from "@/lib/api/postAPI"
import OtpSentStep from "@/components/auth/activation/otp-sent-step"
import { useTranslations } from "next-intl"

type ActivationState = "loading" | "success" | "error" | "otp-sent"

export default function ActivationPage() {
    const [activationState, setActivationState] = useState<ActivationState>("loading")
    const [errorMessage, setErrorMessage] = useState("")
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const ac = useTranslations("activation")
    const ap = useTranslations("api")
    const nav = useTranslations("navigation")

    const activateAccount = async (activationToken?: string) => {
        try {
            const response = await postAPI({
                uuid: activationToken,
            }, "/auth/verify")
            if (!response || response.status !== 200) {
                throw new Error(ap('accountActivationFailed'))
            }
            return { success: true, message: ac("accountActivationSuccess") }
        } catch (error) {
            throw error
        }
    }

    const requestNewOTP = async (activationToken: string) => {
        try {
            const response = await postAPI(
                {
                    uuid: activationToken,
                },
                "/auth/resend-verification",
            )
            if (!response || response.status !== 200) {
                throw new Error(ap('resendFail'))
            }
            setActivationState("otp-sent")
            setErrorMessage("")
            return response
        } catch (error) {
            throw error
        }
    }
    useEffect(() => {
        const handleActivation = async () => {
            if (activationState === "otp-sent") {
                return
            }
            if (!token) {
                setErrorMessage(ac("noTokenProvided"))
                setActivationState("error")
                return
            }
            try {
                await activateAccount(token)
                setActivationState("success")
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : ac("accountActivationFailed"))
                setActivationState("error")
            }
        }
        handleActivation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    useEffect(() => {
        console.log("state", activationState)
    }, [activationState])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-1000 ease-out">
            <div className="absolute top-4 right-4 z-10 animate-in slide-in-from-top-2 duration-700 delay-300">
                <DLanguageSwitcher />
            </div>

            <div className="absolute top-4 left-4 z-10 animate-in slide-in-from-top-2 duration-700 delay-300">
                <Link href="/auth">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {nav("backToLogin")}
                    </Button>
                </Link>
            </div>

            <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-800 delay-400">
                <Card className="border-0 shadow-xl">
                    <CardContent>
                        <div className="min-h-[300px] flex items-center justify-center">
                            {activationState === "loading" && <LoadingStep />}
                            {activationState === "success" && <SuccessStep />}
                            {activationState === "error" && <ErrorStep message={errorMessage} onRetry={() => requestNewOTP(token || "")} />}
                            {activationState === "otp-sent" && <OtpSentStep />}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
