"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Upload, Building2, Mail, Phone, MapPin, Camera } from "lucide-react"
import { SidebarCard } from "../layout/sidebar-card"
import type { CompanyPayload } from "@/lib/interfaces/onboarding-interface"
import { toast } from "sonner"
import postAPI from "@/lib/api/postAPI"

interface CompanyInformationProps {
    onNext: (data: CompanyPayload, companyUuid: string) => void
    onPrevious: () => void
}

export function CompanyInformation({ onNext, onPrevious }: CompanyInformationProps) {
    const [formData, setFormData] = useState<CompanyPayload>({
        user_uuid: "f4d811c2-8583-44f0-ab4c-b2cc1f483387",
        name: "",
        address: "",
        email: "",
        phone: "",
        logo: "",
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await postAPI(formData, "/onboarding/company")
            if (response.status === 201) {
                toast.success("gg")
                setTimeout(() => {
                    onNext(formData, response.data!.company_uuid)
                }, 1000)
            } else {
                toast.error("apalahj")
            }
        } catch {
            toast.error("An unexpected error occurred while creating the company. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: keyof CompanyPayload, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <div className="flex flex-col lg:flex-row items-start px-16 py-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-2xl mx-auto lg:mx-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Company Information</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 lg:mb-8">
                        Let&quot;s start with your company&quot;s basic details
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                        {/* Logo Upload */}
                        <div className="flex justify-start mb-6 lg:mb-8">
                            <div className="relative">
                                <div className="w-20 h-20 lg:w-24 lg:h-24 border-2 border-dashed border-orange-200 rounded-lg flex items-center justify-center bg-orange-25">
                                    <Camera className="w-6 h-6 lg:w-8 lg:h-8 text-orange-300" />
                                </div>
                                <Button
                                    type="button"
                                    className="absolute -bottom-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-orange-400 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors"
                                >
                                    <Upload className="w-3 h-3 lg:w-4 lg:h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            <div>
                                <Label
                                    htmlFor="company-name"
                                    className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm lg:text-base"
                                >
                                    <Building2 className="w-4 h-4 text-orange-400" />
                                    Company Name *
                                </Label>
                                <Input
                                    id="company-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="Enter your company name"
                                    className="h-10 lg:h-12 border-orange-200 focus:border-orange-300 text-sm lg:text-base bg-white"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="company-email"
                                    className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm lg:text-base"
                                >
                                    <Mail className="w-4 h-4 text-orange-400" />
                                    Company Email *
                                </Label>
                                <Input
                                    id="company-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="company@example.com"
                                    className="h-10 lg:h-12 border-orange-200 focus:border-orange-300 text-sm lg:text-base bg-white"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor="company-phone"
                                className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm lg:text-base"
                            >
                                <Phone className="w-4 h-4 text-orange-400" />
                                Phone Number *
                            </Label>
                            <Input
                                id="company-phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                className="h-10 lg:h-12 border-orange-200 focus:border-orange-300 text-sm lg:text-base bg-white"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="company-address"
                                className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm lg:text-base"
                            >
                                <MapPin className="w-4 h-4 text-orange-400" />
                                Company Address *
                            </Label>
                            <Textarea
                                id="company-address"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                placeholder="Enter your complete company address"
                                className="min-h-[80px] lg:min-h-[100px] resize-none border-orange-200 focus:border-orange-300 text-sm lg:text-base bg-white"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 lg:mt-12 max-w-2xl mx-auto lg:mx-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onPrevious}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm lg:text-base"
                        disabled={isLoading}
                    >
                        ← Previous
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-orange-400 hover:bg-orange-500 text-white px-4 lg:px-6 flex items-center gap-2 text-sm lg:text-base"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Creating Company...
                            </>
                        ) : (
                            "Next Step →"
                        )}
                    </Button>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 self-stretch p-4 sm:p-6 grid grid-cols-1 gap-4">
                <SidebarCard
                    icon={Building2}
                    title="Getting Started"
                    description="Start by providing your company's basic information. This will be used throughout your HRIS system."
                    variant="primary"
                />

                <SidebarCard
                    icon={Building2}
                    title="Pro Tips"
                    description=""
                    items={[
                        "Use your official company name as registered",
                        "Upload a high-quality logo (PNG/JPG, max 2MB)",
                        "Provide a complete address for official documents",
                    ]}
                    variant="secondary"
                />
            </div>
        </div>
    )
}
