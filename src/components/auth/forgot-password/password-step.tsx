"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react"

interface PasswordStepProps {
    onSubmit: (data: { password: string; confirmPassword: string }) => void
    isLoading: boolean
}

export default function PasswordStep({ onSubmit, isLoading }: PasswordStepProps) {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }
        onSubmit({ password, confirmPassword })
    }

    const passwordRequirements = [
        { text: "At least 8 characters", met: password.length >= 8 },
        { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { text: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { text: "Contains number", met: /\d/.test(password) },
        { text: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ]

    const isPasswordValid = passwordRequirements.every((req) => req.met)
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

    return (
        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        New Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-base"
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Password Requirements */}
                    {password && (
                        <div className="mt-3 space-y-1">
                            {passwordRequirements.map((req, index) => (
                                <div key={index} className="flex items-center text-xs">
                                    {req.met ? (
                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                    ) : (
                                        <XCircle className="w-3 h-3 text-red-400 mr-2" />
                                    )}
                                    <span className={req.met ? "text-green-600" : "text-gray-500"}>{req.text}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm New Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-base ${confirmPassword && !passwordsMatch ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                                }`}
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-red-500 flex items-center">
                            <XCircle className="w-3 h-3 mr-1" />
                            Passwords do not match
                        </p>
                    )}
                    {passwordsMatch && (
                        <p className="text-xs text-green-600 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Passwords match
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !isPasswordValid || !passwordsMatch}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Resetting Password...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>
        </div>
    )
}
