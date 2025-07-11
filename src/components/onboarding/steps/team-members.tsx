"use client"

import {
    CheckCircle,
    Plus,
    Upload,
    ChevronLeft,
    ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpFooter } from "../layout/help-footer"

interface TeamMembersProps {
    onPrevious: () => void
}

export function TeamMembers({ onPrevious }: TeamMembersProps) {

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
            {/* Main Content */}
            <div className="w-full max-w-4xl">
                <Card className="border-0 shadow-xl backdrop-blur-sm">
                <CardHeader className="pb-6">
                    <div className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                        Setup Complete!
                        </CardTitle>
                        <CardDescription className="text-lg mt-2">
                        Your organizational structure is ready. You can now start adding employees and begin using the HRIS system.
                        </CardDescription>
                    </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Action Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-orange-200 hover:border-orange-300 transition-colors cursor-pointer group">
                        <CardContent className="p-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                            <Plus className="h-8 w-8 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                            Add Employee Manually
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">
                            Add team members one by one with detailed information
                            </p>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Employee Now
                        </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group">
                        <CardContent className="p-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Upload className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                            Import from Excel
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">
                            Upload an Excel file to add multiple employees at once
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Import from Excel
                        </Button>
                        </CardContent>
                    </Card>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onPrevious}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </Button>
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                        Complete Setup
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    </div>
                </CardContent>
                </Card>
            </div>
            </div>
            <HelpFooter />
        </div>
    )
}
