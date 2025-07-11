"use client"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react"

export function HelpFooter() {
    const isMobile = useIsMobile()
    return (
        <div className="bg-white border-t border-gray-200 mt-auto">
            <div className={isMobile ? "px-4 py-4" : "max-w-4xl mx-auto px-6 py-6"}>
                {isMobile ? (
                    <>
                        <div className="text-center mb-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <HelpCircle className="w-5 h-5 text-orange-500" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Need Help?</h3>
                            <p className="text-sm text-gray-600">Our support team is here to assist you</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex flex-col items-center gap-1 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent h-auto py-3"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-xs">Chat</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex flex-col items-center gap-1 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent h-auto py-3"
                            >
                                <Phone className="w-4 h-4" />
                                <span className="text-xs">Call</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex flex-col items-center gap-1 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent h-auto py-3"
                            >
                                <Mail className="w-4 h-4" />
                                <span className="text-xs">Email</span>
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Need Help?</h3>
                                <p className="text-sm text-gray-600">Our support team is here to assist you</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Live Chat
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                            >
                                <Phone className="w-4 h-4" />
                                Call Support
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                            >
                                <Mail className="w-4 h-4" />
                                Email Us
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
