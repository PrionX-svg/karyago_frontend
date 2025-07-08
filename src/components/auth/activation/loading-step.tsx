"use client"

import { Loader2, Shield, CheckCircle } from "lucide-react"

export default function LoadingStep() {
    return (
        <div className="animate-in fade-in-0 duration-500 text-center space-y-6">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    </div>

                    {/* Animated rings */}
                    <div className="absolute inset-0 w-20 h-20 border-2 border-orange-200 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 w-16 h-16 border-2 border-orange-300 rounded-full animate-pulse"></div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">Verifying Your Account</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                    We&apos;re processing your activation token and setting up your account. This should only take a moment.
                </p>
            </div>

            {/* Progress indicators */}
            <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Token received</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-orange-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with server...</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Activating account</span>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Please don&apos;t close this page</strong> while we&apos;re activating your account.
                </p>
            </div>
        </div>
    )
}
