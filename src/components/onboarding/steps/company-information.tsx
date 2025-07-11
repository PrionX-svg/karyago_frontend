"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Upload, Building2, Mail, Phone, MapPin, ChevronRight, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompanyPayload } from "@/lib/interfaces/onboarding-interface"
import { toast } from "sonner"
import postAPI from "@/lib/api/postAPI"
import { HelpFooter } from "../layout/help-footer"
import { Progress } from "@/components/ui/progress"
import FileDropUploader from "@/lib/upload-image"
import { useUserStore } from "@/stores/user-store"
import { useTranslations } from "next-intl"

interface CompanyInformationProps {
    onNext: (data: CompanyPayload, companyUuid: string) => void
}

export function CompanyInformation({ onNext }: CompanyInformationProps) {
    const [formData, setFormData] = useState<CompanyPayload>({
        user_uuid: "",
        name: "",
        address: "",
        email: "",
        phone: "",
        logo: "",
    })
    const user = useUserStore((state) => state.user)
    const [isLoading, setIsLoading] = useState(false)
    const completionPercentage = Object.values(formData).filter((value) => value !== "" && value !== null).length * 20

    const ap = useTranslations("api")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await postAPI(formData, "/companies/create")
            if (response.status === 201) {
                toast.success(ap('companyCreated'))
                setTimeout(() => {
                    onNext(formData, response.data!.uuid)
                    console.log(response.data)
                }, 1000)
            } else {
                toast.error(ap('companyCreationFailed'), {
                    description: ap('checkInputs')
                })
            }
        } catch {
            toast.error(ap('somethingWentWrong'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: keyof CompanyPayload, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        if (user.uuid) {
            setFormData((prev) => ({
                ...prev,
                user_uuid: user.uuid,
            }))
        } else {
            toast.warning("User UUID missing!")
        }
    }, [user.uuid])

    useEffect(() => {
        console.log("data:", formData)
    }, [formData])

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col lg:flex-row items-start px-8 py-8 gap-4 sm:gap-16 max-w-7xl mx-auto w-full">
                <div className="lg:w-80 space-y-6 py-4">
                    <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Building2 className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Getting Started</CardTitle>
                                    <CardDescription>Step 1 of 4</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-medium text-orange-600">{completionPercentage}%</span>
                                </div>
                                <Progress value={completionPercentage} className="h-2 [&>div]:bg-green-600" />
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Start by providing your company&apos;s basic information. This will be used throughout your HRIS system.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-amber-600" />
                                <CardTitle className="text-lg text-amber-800">Pro Tips</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                    <p className="text-sm text-amber-700">
                                        Use your official company name as registered with authorities
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                    <p className="text-sm text-amber-700">
                                        Upload a high-quality logo (PNG/JPG, max 2MB) for better branding
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                    <p className="text-sm text-amber-700">
                                        Provide a complete address for official documents and communications
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex-1">
                    <div className="max-w-2xl mx-auto p-4 lg:mx-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Company Information</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 lg:mb-8">
                            Let&apos;s start with your company&apos;s basic details
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                            <div className="space-y-3">
                                <Label className="text-base font-medium flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Company Logo
                                </Label>
                                <FileDropUploader
                                    value={formData.logo}
                                    folder="company/logo"
                                    onChange={(val) => setFormData({ ...formData, logo: val })}
                                />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                <div>
                                    <Label
                                        htmlFor="company-name"
                                        className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm lg:text-base"
                                    >
                                        <Building2 className="w-4 h-4 text-orange-400" />
                                        Company Name*
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
                                        Company Email*
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
                                    Phone Number*
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
                                    Company Address*
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
                    <div className="flex justify-between items-center px-4 max-w-2xl lg:mx-0">
                        <div />
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
                                <>
                                    Next Step
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <HelpFooter />
        </div>
    )
}
