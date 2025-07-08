"use client"

import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, ArrowRight, Clock, RefreshCw } from "lucide-react"

interface RegisterSuccessStepProps {
    email: string
    onBackToRegister: () => void
    onResendEmail?: () => void
}

export default function RegisterSuccessStep({ email, onBackToRegister, onResendEmail }: RegisterSuccessStepProps) {
    return (
        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 text-center space-y-6">
            <div className="flex justify-center">
                <div className="relative">
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
                <h3 className="text-xl font-semibold text-gray-800">Check Your Email!</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                    We&apos;ve sent an activation link to <span className="font-medium text-gray-800">{email}</span>. Please check your
                    inbox and click the link to activate your account.
                </p>
            </div>

            {/* Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Registration successful</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                    <Mail className="w-4 h-4" />
                    <span>Activation email sent</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                    <Clock className="w-4 h-4" />
                    <span>Link expires in 24 hours</span>
                </div>
            </div>

            <div className="space-y-3">
                {onResendEmail && (
                    <Button
                        onClick={onResendEmail}
                        variant="outline"
                        className="w-full h-11 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Activation Email
                    </Button>
                )}

                <Button
                    onClick={onBackToRegister}
                    className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                    Back to Registration
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
                <p>Don&apos;t see the email? Check your spam folder.</p>
                <p>Make sure to click the activation link within 24 hours.</p>
            </div>
        </div>
    )
}
