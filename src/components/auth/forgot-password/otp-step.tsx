"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"

interface OtpStepProps {
    onSubmit: (data: { otp: string }) => void
    onResend: () => void
    email: string
    isLoading: boolean
}

export default function OtpStep({ onSubmit, onResend, isLoading }: OtpStepProps) {
    const [otp, setOtp] = useState("")
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const fp = useTranslations("forgotPassword")
    const co = useTranslations("common")

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ otp })
    }

    const handleResend = () => {
        onResend()
        setCountdown(60)
        setCanResend(false)
    }

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
        setOtp(value)
    }

    return (
        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                        {fp('labelVerif')}
                    </Label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            id="otp"
                            type="text"
                            placeholder={fp('placeholderVerif')}
                            value={otp}
                            onChange={handleOtpChange}
                            className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-base text-center tracking-widest font-mono"
                            maxLength={6}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-500">
                            {fp("notSent?")} 
                        </p>
                        {!canResend ? (
                            <p className="text-orange-600 font-medium">{fp("resendIn", { countdown })}</p>
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleResend}
                                className="text-orange-600 hover:text-orange-700 p-1 h-auto font-medium flex items-center gap-1 flex-shrink-0"
                            >
                                <RefreshCw className="w-3 h-3" />
                                <span className="whitespace-nowrap">{fp('resendButton')}</span>
                            </Button>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {co('loading')}
                        </>
                    ) : (
                        fp('sendButton2')
                    )}
                </Button>
            </form>
        </div>
    )
}
