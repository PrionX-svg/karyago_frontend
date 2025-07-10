"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function SuccessStep() {
    const fp = useTranslations("forgotPassword")
    return (
        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            <div className="text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-600 delay-200">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>  
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">{fp("passwordResetSuccess")}</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        {fp("passwordResetDescription")}
                    </p>
                </div>               
                <div className="space-y-4">
                    <Link href="/login">
                        <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                            {fp("sendButton4")}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2">
                        {fp("hint4")}
                    </p>
                </div>
            </div>
        </div>
    )
}
