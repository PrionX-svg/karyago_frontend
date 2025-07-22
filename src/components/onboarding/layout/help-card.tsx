"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function HelpCard() {
    return (
        <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                    <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400" />
                    <h3 className="font-semibold text-sm lg:text-base text-gray-800">Need Help?</h3>
                </div>
                <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4 leading-relaxed">
                    Our support team is available 24/7 to help you with the setup process.
                </p>
                <Button
                    variant="outline"
                    className="w-full text-xs lg:text-sm text-orange-400 border-orange-200 hover:bg-orange-50 bg-transparent"
                >
                    Contact Support
                </Button>
            </CardContent>
        </Card>
    )
}
