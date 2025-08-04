"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Loader2, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { EmployeeType } from "@/lib/types/employee-type"
import { api } from "@/lib/api/api"
import { decrypt } from "@/lib/encrypt"

interface EmployeesDialogProps {
    mode: "create" | "edit"
    trigger?: React.ReactNode
    employeeData?: EmployeeType
}

export function EmployeesDialog({ mode, trigger, employeeData }: EmployeesDialogProps) {
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [storedUuid, setStoredUuid] = useState<string | null>(null)

    const ae = useTranslations("employeeOnboarding")
    const ap = useTranslations("api")
    const co = useTranslations("common")

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
        dob: "",
        gender: "",
        is_freelance: false,
    })

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        const uuid = localStorage.getItem("atem")
        setStoredUuid(uuid)
    }, [])

    useEffect(() => {
        if (mode === "edit" && employeeData) {
            setFormData({
                firstname: employeeData.name.firstname || "",
                lastname: employeeData.name.lastname || "",
                phone: employeeData.phone || "",
                email: employeeData.email || "",
                password: "",
                dob: employeeData.dob || "",
                gender: employeeData.gender || "",
                is_freelance: employeeData.is_freelance || false,
            })
        }
    }, [mode, employeeData])

    const generatePassword = () => {
        const length = 12
        const lowercase = "abcdefghijklmnopqrstuvwxyz"
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const numbers = "0123456789"
        const special = "!@#$%^&*"

        let password = ""
        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
        password += numbers.charAt(Math.floor(Math.random() * numbers.length))
        password += special.charAt(Math.floor(Math.random() * special.length))

        const allCharacters = lowercase + uppercase + numbers + special
        for (let i = 4; i < length; i++) {
            password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length))
        }
        password = password.split('').sort(() => Math.random() - 0.5).join('')
        setFormData((prev) => ({
            ...prev,
            password: password,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!storedUuid) return

        setLoading(true)
        const decryptedUuid = decrypt(storedUuid)
        const companyUuid = await decryptedUuid
        const payload = {
            company_uuid: companyUuid,
            firstname: formData.firstname,
            lastname: formData.lastname,
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
            gender: formData.gender,
            is_freelance: formData.is_freelance,
            dob: formData.dob,
        }

        try {
            if (mode === "create") {
                await api.createEmployee(payload)
                    .then(() => {
                        toast.success("Employee created")
                    })
                    .catch((err) => {
                        console.error("Failed to create employee:", err);
                        toast.error("Failed to create employee")
                    });
            } else if (employeeData) {
                await api.updateEmployeeByUuid(employeeData.user_uuid, payload)
                    .then(() => {
                        toast.success("Employee updated")
                    })
                    .catch((err) => {
                        console.error("Failed to update employee:", err);
                        toast.error("Failed to update employee")
                    });
            }
            setOpen(false)
        } catch (error) {
            console.error(error)
            toast.error(ap(mode === "create" ? "createEmployeeFailed" : "updateEmployeeFailed"))
        } finally {
            setLoading(false)
        }
    }

    const defaultTrigger = (
        <Button
            className={`gap-2 ${mode === "create" ? "bg-orange-500 hover:bg-orange-600" : "hover:bg-purple-100"} rounded-lg`}
            variant={mode === "create" ? "default" : "ghost"}
            size={mode === "create" ? "default" : "icon"}
        >
            {mode === "create" ? (
                <>
                    <Plus className="w-4 h-4" />
                    {ae("createAccount")}
                </>
            ) : (
                <Pencil className="w-4 h-4 text-gray-600" />
            )}
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-600" />
                        {mode === "create" ? ae("createAccount") : ae("updateEmployee")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{ae("firstName")}</Label>
                            <Input value={formData.firstname} onChange={(e) => handleInputChange("firstname", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{ae("lastName")}</Label>
                            <Input value={formData.lastname} onChange={(e) => handleInputChange("lastname", e.target.value)} />
                        </div>
                    </div>

                    {/* Kontak */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{ae("phone")}</Label>
                            <Input value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{ae("dob")}</Label>
                            <Input
                                id="dob"
                                type="date"
                                value={formData.dob ? new Date(formData.dob).toISOString().split("T")[0] : ""}
                                onChange={(e) => {
                                    const dateValue = e.target.value ? new Date(e.target.value).toISOString() : ""
                                    handleInputChange("dob", dateValue)
                                }}
                                className="border-2 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                            />
                        </div>
                    </div>

                    {/* Gender dan Freelance */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{ae("gender")}</Label>
                            <Select
                                onValueChange={(v) => handleInputChange("gender", v)}
                                defaultValue={formData.gender || undefined}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={ae("genderPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">{ae("male")}</SelectItem>
                                    <SelectItem value="female">{ae("female")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-3 pt-6">
                            <Switch
                                checked={formData.is_freelance}
                                onCheckedChange={(c) => handleInputChange("is_freelance", c)}
                            />
                            <Label>{ae("isFreelance")}</Label>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label>{ae("email")}</Label>
                        <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                    </div>

                    {/* Password hanya saat create */}
                    {mode === "create" && (
                        <div className="space-y-2">
                            <Label>{ae("password")}</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    size="icon"
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-10.94-7.5a10.97 10.97 0 0 1 2.54-3.36M6.1 6.1A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 10.94 7.5a10.97 10.97 0 0 1-2.54 3.36M1 1l22 22" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={generatePassword}
                                >
                                    {ae("generatePassword")}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tombol */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            {co("cancel")}
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {mode === "create" ? ae("createAccount") : ae("updateEmployee")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
