"use client"

import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, ArrowRight, Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function OtpSentStep() {
    const ac = useTranslations("activation")
    return (
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 text-center space-y-6">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-600 delay-200">
                        <Mail className="w-10 h-10 text-blue-500" />
                    </div>
                    {/* Animated mail indicator */}
                    <div className="absolute -top-1 -right-1">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">{ac('resendTitle')}</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                    {ac('resendDescription')}
                </p>
            </div>
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>{ac('hint9')}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span>{ac('hint10')}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span>{ac('hint11')}</span>
                </div>
            </div>
            <div className="space-y-3">
                <Link href="/auth">
                    <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                        {ac('goToSignIn')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
                <div className="text-sm text-gray-500 space-y-1 mt-2">
                    <p>{ac('hint12')}</p>
                    <p>{ac('hint13')}</p>
                </div>
            </div>
        </div>
    )
}
