"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SuccessStep() {
    return (
        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            <div className="text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-600 delay-200">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>  
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">Password Reset Successful!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Your password has been successfully updated. You can now sign in with your new password.
                    </p>
                </div>               
                <div className="space-y-4">
                    <Link href="/login">
                        <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                            Sign In Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2">
                        Remember to keep your password secure and don&apos;t share it with anyone.
                    </p>
                </div>
            </div>
        </div>
    )
}
