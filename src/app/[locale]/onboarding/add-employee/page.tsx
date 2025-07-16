"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Save, User, Mail, Phone, Calendar, Lock, Users, UserCheck, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import postAPI from "@/lib/api/postAPI"
import { toast } from "sonner"
import { useCompanyStore } from "@/stores/company-store"
import { useUserStore } from "@/stores/user-store"
import { api } from "@/lib/api/api"
import { useEmployeeStore } from "@/stores/employee-store"

export interface FormData {
    company_uuid: string
    firstname: string
    lastname: string
    phone: string
    email: string
    password: string
    dob: string
    gender: string
    is_freelance: boolean
}

interface FormErrors {
    firstname?: string
    lastname?: string
    phone?: string
    email?: string
    password?: string
    dob?: string
    gender?: string
}

export default function AddUserManually() {
    const [formData, setFormData] = useState<FormData>({
        company_uuid: "",
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
        dob: "",
        gender: "",
        is_freelance: false,
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    const employees = useEmployeeStore((state) => state.employees)
    const userUuid = useUserStore((state) => state.user.uuid)
    const companyUuid = useCompanyStore((state) => state.company[0]?.uuid)
    const addEmployee = useEmployeeStore.getState().addEmployee

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    const onBack = () => {
        router.push("/onboarding")
    }

    const generatePassword = () => {
        const length = 12
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        let password = ""

        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length))
        }

        setFormData((prev) => ({
            ...prev,
            password: password,
        }))

        setErrors((prev) => ({
            ...prev,
            password: undefined,
        }))
    }

    const handleInputChange = (field: keyof (FormData & { confirmPassword: string }), value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))

        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.firstname.trim()) {
            newErrors.firstname = "First name is required"
        }

        if (!formData.lastname.trim()) {
            newErrors.lastname = "Last name is required"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long"
        }

        if (!formData.dob) {
            newErrors.dob = "Date of birth is required"
        }

        if (!formData.gender) {
            newErrors.gender = "Gender is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        try {
            console.log("Form data to be submitted:", formData)
            const res = await postAPI({
                company_uuid: formData.company_uuid,
                firstname: formData.firstname,
                lastname: formData.lastname,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                dob: formData.dob,
                gender: formData.gender,
                is_freelance: formData.is_freelance
            }, '/users/create')
            if (res.status === 201) {
                toast.success("User created successfully!")
                addEmployee({
                    company_uuid: formData.company_uuid,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    phone: formData.phone,
                    email: formData.email,
                    dob: formData.dob,
                    gender: formData.gender,
                    is_freelance: formData.is_freelance,
                })
                setFormData((prev) => ({
                    ...prev,
                    firstname: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    dob: "",
                    is_freelance: false,
                }))
            } else {
                toast.error("Failed to create user. Please try again.")
            }
        } catch (error) {
            console.error("Error saving user:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return 'Invalid Date'
        }
    }

    useEffect(() => {
        if (!userUuid) {
            api.getMe()
        }
    }, [userUuid])

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (userUuid) {
                setLoading(true);
                try {
                    await api.getCompanyByUserUuid(userUuid);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchCompanyData();
    }, [userUuid]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (companyUuid) {
                setLoading(true);
                try {
                    await api.getEmployeeByCompanyUuid(companyUuid);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchEmployeeData();
    }, [companyUuid]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            company_uuid: companyUuid,
        }))
    }, [companyUuid])

    return (
        <motion.div
            className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 py-4 flex-1">
                <motion.div className="w-full max-w-7xl mx-auto" variants={itemVariants}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <motion.div variants={itemVariants}>
                                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 overflow-hidden">
                                    <CardContent className="px-8 py-4">
                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            {/* Personal Information */}
                                            <motion.div className="space-y-6" variants={itemVariants}>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <motion.div variants={itemVariants} className="space-y-2">
                                                        <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                                                            First Name *
                                                        </Label>
                                                        <Input
                                                            id="firstname"
                                                            value={formData.firstname}
                                                            onChange={(e) => handleInputChange("firstname", e.target.value)}
                                                            placeholder="John"
                                                            className={`h-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${errors.firstname ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                                                }`}
                                                        />
                                                        {errors.firstname && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center"
                                                            >
                                                                {errors.firstname}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                    <motion.div variants={itemVariants} className="space-y-2">
                                                        <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                                                            Last Name *
                                                        </Label>
                                                        <Input
                                                            id="lastname"
                                                            value={formData.lastname}
                                                            onChange={(e) => handleInputChange("lastname", e.target.value)}
                                                            placeholder="Doe"
                                                            className={`h-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${errors.lastname ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                                                }`}
                                                        />
                                                        {errors.lastname && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center"
                                                            >
                                                                {errors.lastname}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <motion.div variants={itemVariants} className="space-y-2">
                                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                                            Phone Number *
                                                        </Label>
                                                        <div className="relative">
                                                            <Phone className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                                                            <Input
                                                                id="phone"
                                                                value={formData.phone}
                                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                                placeholder="628123456789"
                                                                className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                                                    }`}
                                                            />
                                                        </div>
                                                        {errors.phone && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center"
                                                            >
                                                                {errors.phone}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                    <motion.div variants={itemVariants} className="space-y-2">
                                                        <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                                                            Date of Birth *
                                                        </Label>
                                                        <div className="relative">
                                                            <Calendar className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                                                            <Input
                                                                id="dob"
                                                                type="date"
                                                                value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                                                                onChange={(e) => {
                                                                    const dateValue = e.target.value ? new Date(e.target.value).toISOString() : '';
                                                                    handleInputChange("dob", dateValue);
                                                                }}
                                                                className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${errors.dob ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                                                    }`}
                                                            />
                                                        </div>
                                                        {errors.dob && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center"
                                                            >
                                                                {errors.dob}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <motion.div variants={itemVariants} className="space-y-2">
                                                        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                                                            Gender *
                                                        </Label>
                                                        <Select onValueChange={(value) => handleInputChange("gender", value)}>
                                                            <SelectTrigger
                                                                className={`h-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${errors.gender ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                                                    }`}
                                                            >
                                                                <SelectValue placeholder="Select your gender" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="male">Male</SelectItem>
                                                                <SelectItem value="female">Female</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.gender && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-red-500 text-sm flex items-center"
                                                            >
                                                                {errors.gender}
                                                            </motion.p>
                                                        )}
                                                    </motion.div>
                                                    <motion.div variants={itemVariants} className="flex items-center space-x-3 mt-8">
                                                        <Checkbox
                                                            id="is_freelance"
                                                            checked={formData.is_freelance}
                                                            onCheckedChange={(checked) => handleInputChange("is_freelance", checked as boolean)}
                                                            className="w-5 h-5"
                                                        />
                                                        <Label htmlFor="is_freelance" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                            Is Freelance?
                                                        </Label>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                            {/* Account Information */}
                                            <motion.div className="space-y-6" variants={itemVariants}>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                                                        <Lock className="h-4 w-4 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
                                                </div>
                                                <motion.div variants={itemVariants} className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                        Email Address *
                                                    </Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                                            placeholder="john.doe2@example.com"
                                                            className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                                                }`}
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm flex items-center"
                                                        >
                                                            {errors.email}
                                                        </motion.p>
                                                    )}
                                                </motion.div>
                                                <motion.div variants={itemVariants} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                                            Password *
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={generatePassword}
                                                                className="text-xs px-3 py-1 h-auto border-orange-200 text-orange-600 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                                                            >
                                                                Generate Password
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={async () => {
                                                                    await navigator.clipboard.writeText(formData.password)
                                                                    setCopied(true)
                                                                    setTimeout(() => setCopied(false), 2000)
                                                                }}
                                                                className="text-xs px-3 py-1 h-auto border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300"
                                                                disabled={!formData.password}
                                                            >
                                                                {copied ? "Copied!" : "Copy"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            id="password"
                                                            type="text"
                                                            value={formData.password}
                                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                                            placeholder="Enter secure password"
                                                            className={`h-12 pl-12 border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 ${errors.password ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                                                }`}
                                                        />
                                                    </div>
                                                    {errors.password && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="text-red-500 text-sm flex items-center"
                                                        >
                                                            {errors.password}
                                                        </motion.p>
                                                    )}
                                                </motion.div>
                                            </motion.div>
                                            {/* Action Buttons */}
                                            <motion.div className="flex justify-between pt-8" variants={itemVariants}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={onBack}
                                                    className="h-12 px-8 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 bg-transparent"
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <Button
                                                        type="submit"
                                                        className="h-12 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                                        disabled={isSubmitting || loading}
                                                    >
                                                        <Save className="h-4 w-4 mr-2" />
                                                        {isSubmitting ? "Creating Account..." : "Create Account"}
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Employee List Section */}
                        <div className="lg:col-span-1">
                            <motion.div variants={itemVariants}>
                                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 overflow-hidden sticky top-4">
                                    <CardContent className="p-0">
                                        <div className="max-h-[600px] overflow-y-auto">
                                            {employees.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Users className="h-8 w-8 text-orange-400" />
                                                    </div>
                                                    <p className="text-gray-500 text-sm">No employees added yet</p>
                                                    <p className="text-gray-400 text-xs mt-1">Start by creating your first employee</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-gray-100">
                                                    {employees.map((employee, index) => (
                                                        <motion.div
                                                            key={`${employee.email}-${index}`}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-200"
                                                        >
                                                            <div className="flex items-start space-x-3">
                                                                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-white font-medium text-sm">
                                                                        {employee.firstname.charAt(0).toUpperCase()}
                                                                        {employee.lastname.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <h4 className="font-medium text-gray-900 text-sm truncate">
                                                                            {employee.firstname} {employee.lastname}
                                                                        </h4>
                                                                        {employee.is_freelance && (
                                                                            <Badge variant="outline" className="text-xs border-amber-200 text-amber-600">
                                                                                <Briefcase className="h-3 w-3 mr-1" />
                                                                                Freelance
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                                                                        <Mail className="h-3 w-3" />
                                                                        <span className="truncate">{employee.email}</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                                                                        <Phone className="h-3 w-3" />
                                                                        <span>{employee.phone}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between mt-2">
                                                                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                                            <Calendar className="h-3 w-3" />
                                                                            <span>Born {formatDate(employee.dob || "")}</span>
                                                                        </div>
                                                                        <Badge 
                                                                            variant="secondary" 
                                                                            className={`text-xs ${
                                                                                employee.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                                                                                employee.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                                                                                'bg-gray-100 text-gray-700'
                                                                            }`}
                                                                        >
                                                                            {employee.gender || "Invalid"}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {employees.length > 0 && (
                                            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100">
                                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                                    <UserCheck className="h-4 w-4 text-orange-500" />
                                                    <span>Total: {employees.length} employee{employees.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}