"use client"

import { Button } from "@/components/ui/button"
import { XCircle, Mail, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface ErrorStepProps {
    message: string
    onRetry: () => void
}

export default function ErrorStep({ message, onRetry }: ErrorStepProps) {
    const ac = useTranslations("activation")
    const nav = useTranslations("navigation")
    return (
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 text-center space-y-6">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-600 delay-200">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">{ac('title3')}</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                    {message || ac("description3")}
                </p>
            </div>

            {/* Error details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                    <strong>{ac('hintTitle')}</strong>
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1 text-left max-w-xs mx-auto">
                    <li>• {ac('hint1')}</li>
                    <li>• {ac('hint2')}</li>
                    <li>• {ac('hint3')}</li>
                    <li>• {ac('hint4')}</li>
                </ul>
            </div>
            <div className="space-y-3">
                <div className="flex flex-col space-y-2">
                    <Link href="/auth">
                        <Button
                            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                        >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            {nav('backToLogin')}
                        </Button>
                    </Link>
                    <Button variant="ghost" onClick={onRetry} className="w-full h-10 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                        <Mail className="w-4 h-4 mr-2" />
                        {ac('reqNewLink')}
                    </Button>
                </div>
            </div>
            <p className="text-xs text-gray-500">{ac('assistance')}</p>
        </div>
    )
}
