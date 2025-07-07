"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface LoginFormProps {
    onSubmit?: (data: { email: string; password: string; remember: boolean }) => void
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit?.(formData)
    }

    const LoginPage = useTranslations("auth")

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm text-gray-700">
                    {LoginPage("email")}
                </Label>
                <Input
                    id="login-email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm text-gray-700">
                    {LoginPage("password")}
                </Label>
                <div className="relative">
                    <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-10"
                        required
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
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        type="checkbox"
                        id="remember"
                        checked={formData.remember}
                        onChange={(e) => setFormData((prev) => ({ ...prev, remember: e.target.checked }))}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                        {LoginPage("rememberMe")}
                    </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 hover:underline">
                    {LoginPage("forgotPassword")}
                </Link>
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                {LoginPage("signIn")}
            </Button>
        </form>
    )
}
