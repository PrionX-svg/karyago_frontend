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
import type { CompanyPayload } from "@/lib/interfaces/company-interface"
import { toast } from "sonner"
import postAPI from "@/lib/api/postAPI"
import { HelpFooter } from "../layout/help-footer"
import { Progress } from "@/components/ui/progress"
import FileDropUploader from "@/lib/upload-image"
import { useUserStore } from "@/stores/user-store"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { useCompanyStore } from "@/stores/company-store"
import { encrypt } from "@/lib/encrypt"

interface CompanyInformationProps {
    onNext: () => void
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
    const setCompanyStore = useCompanyStore((state) => state.setCompany)
    const [isLoading, setIsLoading] = useState(false)

    const completionPercentage = (
        ["name", "address", "email", "phone", "logo"] as (keyof CompanyPayload)[]
    ).filter((key) => formData[key] !== "" && formData[key] !== null).length * 20

    const ap = useTranslations("api")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await postAPI(formData, "/companies/create")
            if (response.status === 201) {
                toast.success(ap("companyCreated"))
                setCompanyStore([response.data.data])

                const encryptedUuid = await encrypt(response.data.data.uuid)
                sessionStorage.setItem("meta", encryptedUuid)
                setTimeout(() => {
                    onNext();
                }, 1000)
            } else if (response.status === 400) {
                toast.error(ap("companyCreationFailed"), {
                    description: ap("checkInputs"),
                })
            } else {
                toast.error(ap("status500"))
                console.error("error: ", response.data?.message)
            }
        } catch {
            toast.error(ap("somethingWentWrong"))
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const formFieldVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 },
        },
    }

    return (
        <motion.div className="min-h-screen flex flex-col" initial="hidden" animate="visible" variants={containerVariants}>
            <div className="flex-1 flex flex-col lg:flex-row items-start px-8 py-8 gap-4 sm:gap-16 max-w-7xl mx-auto w-full">
                <motion.div className="lg:w-80 space-y-6 py-4" variants={itemVariants}>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="p-2 bg-orange-100 rounded-lg"
                                        whileHover={{ rotate: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Building2 className="h-5 w-5 text-orange-600" />
                                    </motion.div>
                                    <div>
                                        <CardTitle className="text-lg">Getting Started</CardTitle>
                                        <CardDescription>Step 1 of 4</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Creating Company Progress</span>
                                        <motion.span
                                            className="font-medium text-orange-600"
                                            key={completionPercentage}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {completionPercentage}%
                                        </motion.span>
                                    </div>
                                    <Progress value={completionPercentage} className="h-2 [&>div]:bg-green-600" />
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Start by providing your company&apos;s basic information. This will be used throughout your HRIS
                                    system.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                                        <CheckCircle className="h-5 w-5 text-amber-600" />
                                    </motion.div>
                                    <CardTitle className="text-lg text-amber-800">Pro Tips</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">
                                            Use your official company name as registered with authorities
                                        </p>
                                    </motion.div>
                                    <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">
                                            Upload a high-quality logo (PNG/JPG, max 2MB) for better branding
                                        </p>
                                    </motion.div>
                                    <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">
                                            Provide a complete address for official documents and communications
                                        </p>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <motion.div className="flex-1" variants={itemVariants}>
                    <div className="max-w-2xl mx-auto p-4 lg:mx-0">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Company Information</h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-6 lg:mb-8">
                                Let&apos;s start with your company&apos;s basic details
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                            <motion.div
                                className="space-y-3"
                                variants={formFieldVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.3 }}
                            >
                                <Label className="text-base font-medium flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Company Logo
                                </Label>
                                <FileDropUploader
                                    value={formData.logo}
                                    folder="company/logo"
                                    onChange={(val) => setFormData({ ...formData, logo: val })}
                                />
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
                                variants={formFieldVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.4 }}
                            >
                                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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
                                        className={`h-10 lg:h-12 focus:border-orange-300 text-sm lg:text-base bg-white ${!formData.name ? "border-red-500" : "border-orange-200"
                                            }`}
                                        required
                                        disabled={isLoading}
                                    />
                                    {!formData.name && (
                                        <motion.p
                                            className="text-red-500 text-xs mt-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Name is required
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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
                                        className={`h-10 lg:h-12 focus:border-orange-300 text-sm lg:text-base bg-white ${!formData.email ? "border-red-500" : "border-orange-200"
                                            }`}
                                        required
                                        disabled={isLoading}
                                    />
                                    {!formData.email && (
                                        <motion.p
                                            className="text-red-500 text-xs mt-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Email is required
                                        </motion.p>
                                    )}
                                    {/* Email validation message */}
                                    {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                        <motion.p
                                            className="text-red-500 text-xs mt-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            Please enter a valid email address
                                        </motion.p>
                                    )}

                                </motion.div>
                            </motion.div>

                            <motion.div
                                variants={formFieldVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                            >
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
                                    className={`h-10 lg:h-12 focus:border-orange-300 text-sm lg:text-base bg-white ${!formData.phone ? "border-red-500" : "border-orange-200"
                                        }`}
                                    required
                                    disabled={isLoading}
                                />
                                {!formData.phone && (
                                    <motion.p
                                        className="text-red-500 text-xs mt-1"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Phone number is required
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                variants={formFieldVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                            >
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
                                    className={`min-h-[80px] lg:min-h-[100px] resize-none focus:border-orange-300 text-sm lg:text-base bg-white ${!formData.address ? "border-red-500" : "border-orange-200"
                                        }`}
                                    required
                                    disabled={isLoading}
                                />
                                {!formData.address && (
                                    <motion.p
                                        className="text-red-500 text-xs mt-1"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Address is required
                                    </motion.p>
                                )}
                            </motion.div>
                        </form>
                    </div>

                    <motion.div
                        className="flex justify-between items-center px-4 max-w-2xl lg:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <div />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleSubmit}
                                className="bg-orange-400 hover:bg-orange-500 text-white px-4 lg:px-6 flex items-center gap-2 text-sm lg:text-base"
                                disabled={isLoading || !formData.name || !formData.email || !formData.phone || !formData.address}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        >
                                            <LoadingSpinner size="sm" />
                                        </motion.div>
                                        Creating Company...
                                    </>
                                ) : (
                                    <>
                                        Next Step
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
            <HelpFooter />
        </motion.div>
    )
}
