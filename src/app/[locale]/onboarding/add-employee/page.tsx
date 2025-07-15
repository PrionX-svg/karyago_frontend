"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Save, User, Mail, Phone, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

export interface Employee {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    position: string
    department: string
    startDate: string
    salary?: number
    address?: string
    notes?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface ImportStatus {
    total: number
    success: number
    errors: number
    warnings: number
}

export interface ImportError {
    row: number
    field: string
    message: string
}

export interface ImportResult {
    status: ImportStatus
    errors: ImportError[]
    data: Employee[]
}


interface AddEmployeeManuallyProps {
    onBack: () => void
    onSave: (employeeData: Employee) => void
}

interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    position?: string
    department?: string
    startDate?: string
}

export default function AddEmployeeManually({ onBack, onSave }: AddEmployeeManuallyProps) {
    const [formData, setFormData] = useState<Omit<Employee, "id">>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        startDate: "",
        salary: undefined,
        address: "",
        notes: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const handleInputChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required"
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.position.trim()) {
            newErrors.position = "Position is required"
        }

        if (!formData.department.trim()) {
            newErrors.department = "Department is required"
        }

        if (!formData.startDate) {
            newErrors.startDate = "Start date is required"
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            onSave(formData as Employee)
        } catch (error) {
            console.error("Error saving employee:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 py-8 flex-1">
                <motion.div className="w-full max-w-4xl mx-auto" variants={itemVariants}>
                    {/* Header */}
                    <motion.div className="mb-8" variants={itemVariants}>
                        <Button variant="ghost" onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Setup
                        </Button>
                        <div className="text-center">
                            <motion.div
                                className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4"
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                }}
                            >
                                <User className="h-8 w-8 text-orange-600" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
                            <p className="text-gray-600 mt-2">Fill in the employee details below</p>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-xl backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-900">Employee Information</CardTitle>
                                <CardDescription>Enter the basic information for the new employee</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information */}
                                    <motion.div className="space-y-4" variants={itemVariants}>
                                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                            Personal Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <motion.div variants={itemVariants}>
                                                <Label htmlFor="firstName">First Name *</Label>
                                                <Input
                                                    id="firstName"
                                                    value={formData.firstName}
                                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                    placeholder="Enter first name"
                                                    className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                                                    required
                                                />
                                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <Label htmlFor="lastName">Last Name *</Label>
                                                <Input
                                                    id="lastName"
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                    placeholder="Enter last name"
                                                    className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                                                    required
                                                />
                                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                            </motion.div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <motion.div variants={itemVariants}>
                                                <Label htmlFor="email">Email Address *</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                                        placeholder="employee@company.com"
                                                        className={`mt-1 pl-10 ${errors.email ? "border-red-500" : ""}`}
                                                        required
                                                    />
                                                </div>
                                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="phone"
                                                        value={formData.phone || ""}
                                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                                        placeholder="+62 812 3456 7890"
                                                        className="mt-1 pl-10"
                                                    />
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Work Information */}
                                    <motion.div className="space-y-4" variants={itemVariants}>
                                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                            Work Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <motion.div variants={itemVariants}>
                                                <Label htmlFor="position">Position *</Label>
                                                <Input
                                                    id="position"
                                                    value={formData.position}
                                                    onChange={(e) => handleInputChange("position", e.target.value)}
                                                    placeholder="e.g. Software Engineer"
                                                    className={`mt-1 ${errors.position ? "border-red-500" : ""}`}
                                                    required
                                                />
                                                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <Label htmlFor="department">Department *</Label>
                                                <Select onValueChange={(value) => handleInputChange("department", value)}>
                                                    <SelectTrigger className={`mt-1 ${errors.department ? "border-red-500" : ""}`}>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="engineering">Engineering</SelectItem>
                                                        <SelectItem value="marketing">Marketing</SelectItem>
                                                        <SelectItem value="sales">Sales</SelectItem>
                                                        <SelectItem value="hr">Human Resources</SelectItem>
                                                        <SelectItem value="finance">Finance</SelectItem>
                                                        <SelectItem value="operations">Operations</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                                            </motion.div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <motion.div variants={itemVariants}>
                                                <Label htmlFor="startDate">Start Date *</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="startDate"
                                                        type="date"
                                                        value={formData.startDate}
                                                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                                                        className={`mt-1 pl-10 ${errors.startDate ? "border-red-500" : ""}`}
                                                        required
                                                    />
                                                </div>
                                                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <Label htmlFor="salary">Monthly Salary (IDR)</Label>
                                                <Input
                                                    id="salary"
                                                    type="number"
                                                    value={formData.salary || ""}
                                                    onChange={(e) => handleInputChange("salary", Number.parseInt(e.target.value) || 0)}
                                                    placeholder="5000000"
                                                    className="mt-1"
                                                />
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Additional Information */}
                                    <motion.div className="space-y-4" variants={itemVariants}>
                                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                            Additional Information
                                        </h3>
                                        <motion.div variants={itemVariants}>
                                            <Label htmlFor="address">Address</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Textarea
                                                    id="address"
                                                    value={formData.address || ""}
                                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                                    placeholder="Enter full address"
                                                    className="mt-1 pl-10 min-h-[80px]"
                                                />
                                            </div>
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={formData.notes || ""}
                                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                                placeholder="Any additional notes about the employee"
                                                className="mt-1 min-h-[80px]"
                                            />
                                        </motion.div>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div className="flex justify-between pt-6" variants={itemVariants}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onBack}
                                            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                type="submit"
                                                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                                                disabled={isSubmitting}
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {isSubmitting ? "Saving..." : "Save Employee"}
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}
