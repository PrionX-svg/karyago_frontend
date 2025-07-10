"use client"

import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, ArrowRight, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"

interface RegisterSuccessStepProps {
    email: string
    onBackToRegister: () => void
    onResendEmail?: () => void
}

export default function RegisterSuccessStep({ email, onBackToRegister, onResendEmail }: RegisterSuccessStepProps) {
    const re = useTranslations("registerSuccess")
    return (
        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 text-center space-y-6">
            <div className="flex justify-center">
                <div className="relative mt-2">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-600 delay-200">
                        <Mail className="w-10 h-10 text-green-500" />
                    </div>

                    {/* Success indicator */}
                    <div className="absolute -top-1 -right-1">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">{re("title")}</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                    {re("description", { email: email })}
                </p>
            </div>

            <div className="space-y-3">
                {onResendEmail && (
                    <Button
                        onClick={onResendEmail}
                        variant="outline"
                        className="w-full h-11 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {re("resend")}
                    </Button>
                )}

                <Button
                    onClick={onBackToRegister}
                    className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                    {re("backToRegister")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
                <p>{re("hint1")}</p>
                <p>{re("hint2")}</p>
            </div>
        </div>
    )
}
