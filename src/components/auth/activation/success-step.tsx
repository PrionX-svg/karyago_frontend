"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function SuccessStep() {
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    // Auto redirect to login page
                    window.location.href = "/auth"
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 text-center space-y-6">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-600 delay-200">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>

                    {/* Success sparkles */}
                    <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-1 -left-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse delay-300" />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">Welcome to Our Platform!</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                    Your account has been successfully activated. You can now access all features and start using our platform.
                </p>
            </div>

            {/* Success features */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Account verified and activated</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Full access granted</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Ready to get started</span>
                </div>
            </div>

            <div className="space-y-3">
                <Link href="/auth">
                    <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                        Sign In Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>

                <p className="text-sm text-gray-500 mt-2">
                    Redirecting automatically in <span className="font-semibold text-orange-600">{countdown}</span> seconds...
                </p>
            </div>
        </div>
    )
}
