"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Plus, Pencil, Loader2 } from "lucide-react"
import { api } from "@/lib/api/api"
import { decrypt } from "@/lib/encrypt"
import { useEmployeeStore } from "@/stores/employee-store"
import { toast } from "sonner"
import { DivisionType } from "@/lib/types/company-type"

interface DivisionDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: Omit<DivisionType, "uuid">) => void
    initialData?: DivisionType
    mode: "create" | "edit"
    division?: {
        uuid: string
        company_uuid: string
        name: string
        desc: string
        responsible?: { name: string; uuid: string }
    }
    trigger?: React.ReactNode
}

export function DivisionForm({ mode, division, trigger }: DivisionDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        responsibleUuid: "",
    })
    const employees = useEmployeeStore((state) => state.employees)
    const storedUuid = localStorage.getItem("atem")

    useEffect(() => {
        if (mode === "edit" && division) {
            setFormData({
                name: division.name || "",
                desc: division.desc || "",
                responsibleUuid: division.responsible?.uuid || "",
            })
        } else {
            setFormData({
                name: "",
                desc: "",
                responsibleUuid: "",
            })
        }
    }, [mode, division, open])

    useEffect(() => {
        const fetchEmployees = async () => {
            if (!storedUuid) return
            try {
                const decryptedUuid = decrypt(storedUuid)
                await api.getEmployeeByCompanyUuid(await decryptedUuid)
            } catch (error) {
                console.error("Failed to fetch employees:", error)
            }
        }

        if (open) {
            fetchEmployees()
        }
    }, [open, storedUuid])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!storedUuid) return

        setLoading(true)
        try {
            const decryptedUuid = decrypt(storedUuid)
            const companyUuid = await decryptedUuid

            const payload = {
                company_uuid: companyUuid,
                responsible_uuid: formData.responsibleUuid || undefined,
                name: formData.name,
                desc: formData.desc,
            }

            if (mode === "create") {
                await api.createDivision(payload)
                    .then(() => {
                        toast.success("Department Group created")
                    })
                    .catch((err) => {
                        console.error("Failed to create department group:", err);
                        toast.error("Failed to create department group")
                    });
            } else if (division) {
                await api.updateDivision(division.uuid, payload)
                    .then(() => {
                        toast.success("Department Group updated")
                    })
                    .catch((err) => {
                        console.error("Failed to update department group:", err);
                        toast.error("Failed to update department group")
                    });
            }

            setOpen(false)
        } catch (error) {
            console.error(`Failed to ${mode} department group:`, error)
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
                    Add Department Group
                </>
            ) : (
                <Pencil className="w-4 h-4 text-gray-600" />
            )}
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent
                className="
                w-[92vw] sm:w-[440px] max-w-[95vw] 
                rounded-2xl px-5 py-6 sm:px-8 sm:py-8 
                shadow-lg overflow-y-auto max-h-[90vh]
                transition-all duration-200
            "
            >

                {/* Header */}
                <DialogHeader className="mb-4 space-y-3 text-center">
                    <div className="flex justify-center">
                        <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                            <Building2 className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <DialogTitle className="text-base font-semibold text-gray-900">
                        {mode === "create" ? "Create New Department Group" : "Edit Department Group"}
                    </DialogTitle>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 mt-4 px-1 sm:px-2">
                    {/* Department Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Department Group Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter department group name"
                            required
                            className="h-10 w-[97%] sm:w-full mx-auto rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        />
                    </div>

                    {/* Responsible */}
                    <div className="space-y-2">
                        <Label htmlFor="responsible" className="text-sm font-medium text-gray-700">
                            Responsible Person
                        </Label>
                        <Select
                            value={formData.responsibleUuid}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, responsibleUuid: value === "none" ? "" : value }))
                            }
                        >
                            <SelectTrigger className="h-10 w-[97%] sm:w-full mx-auto rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400">
                                <SelectValue placeholder="Select responsible person" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No one assigned</SelectItem>
                                {employees.map((employee) => (
                                    <SelectItem key={employee.user_uuid} value={employee.user_uuid}>
                                        {employee.name.fullname}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="desc" className="text-sm font-medium text-gray-700">
                            Description
                        </Label>
                        <Textarea
                            id="desc"
                            value={formData.desc}
                            onChange={(e) => setFormData((prev) => ({ ...prev, desc: e.target.value }))}
                            placeholder="Enter department group description"
                            rows={3}
                            className="rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.name.trim()}
                            className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {mode === "create" ? "Create Department Group" : "Update Department Group"}
                        </Button>
                    </div>
                </form>
            </DialogContent>


        </Dialog>
    )
}
