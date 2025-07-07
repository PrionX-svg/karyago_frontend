"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { validatePassword } from "@/lib/validate-password"

interface RegisterFormProps {
    onSubmit?: (data: {
        email: string
        password: string
        confirmPassword: string
        termsAccepted: boolean
        privacyAccepted: boolean
    }) => void
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
        privacyAccepted: false,
    })
    const passwordValidation = useMemo(() => validatePassword(formData.password), [formData.password])

    // Validation logic
    const isFormValid = useMemo(() => {
        const passwordCheck = validatePassword(formData.password)
        return (
            formData.email.trim() !== "" &&
            formData.password.trim() !== "" &&
            formData.confirmPassword.trim() !== "" &&
            formData.password === formData.confirmPassword &&
            formData.termsAccepted &&
            formData.privacyAccepted &&
            passwordCheck.isValid
        )
    }, [formData])


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isFormValid) {
            onSubmit?.(formData)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm text-gray-700">
                    Your Email
                </Label>
                <Input
                    id="register-email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm text-gray-700">
                    Password
                </Label>
                <div className="relative">
                    <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-10 ${formData.password && !passwordValidation.isValid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                            }`}
                        required
                        minLength={8}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                </div>

                {formData.password && !passwordValidation.isValid && (
                    <div className="text-sm text-red-600 space-y-1">
                        <p className="font-medium">Password must meet the following requirements:</p>
                        <ul className="ml-4 space-y-1 list-disc">
                            {passwordValidation.errors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>


            <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm text-gray-700">
                    Confirm Password
                </Label>
                <div className="relative">
                    <Input
                        id="register-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-10 ${formData.confirmPassword && !passwordValidation.isValid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                            }`}
                        required
                        minLength={8}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
                    >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div className="text-sm text-red-600">
                        Passwords do not match
                    </div>
                )}
            </div>


            <div className="flex items-start space-x-2">
                <Input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-orange-600 hover:text-orange-700 hover:underline">
                        terms and conditions
                    </Link>
                </Label>
            </div>

            <div className="flex items-start space-x-2">
                <Input
                    type="checkbox"
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onChange={(e) => setFormData((prev) => ({ ...prev, privacyAccepted: e.target.checked }))}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1"
                />
                <Label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/privacy" className="text-orange-600 hover:text-orange-700 hover:underline">
                        privacy policy
                    </Link>
                </Label>
            </div>

            <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Create Account
            </Button>
        </form>
    )
}
