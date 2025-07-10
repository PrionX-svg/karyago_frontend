"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface EmailStepProps {
    onSubmit: (data: { email: string }) => void
    isLoading: boolean
}

export default function EmailStep({ onSubmit, isLoading }: EmailStepProps) {
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ email })
    }

    const fp = useTranslations("forgotPassword")

    return (
        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-base"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{fp('hint1')}</p>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {fp('loading1')}
                        </>
                    ) : (
                        fp('sendButton1')
                    )}
                </Button>
            </form>
        </div>
    )
}
