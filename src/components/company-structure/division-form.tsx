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

interface DivisionDialogProps {
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

export function DivisionDialog({ mode, division, trigger }: DivisionDialogProps) {
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
                        console.log("Division created successfully");
                        toast.success("Division created")
                    })
                    .catch((err) => {
                        console.error("Failed to create division:", err);
                        toast.error("Failed to create division")
                    });
            } else if (division) {
                await api.updateDivision(division.uuid, payload)
                    .then(() => {
                        console.log("Division updated successfully");
                        toast.success("Division updated")
                    })
                    .catch((err) => {
                        console.error("Failed to update division:", err);
                        toast.error("Failed to update division")
                    });
            }

            setOpen(false)
        } catch (error) {
            console.error(`Failed to ${mode} division:`, error)
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
                    Add Division
                </>
            ) : (
                <Pencil className="w-4 h-4 text-gray-600" />
            )}
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                            <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        {mode === "create" ? "Create New Division" : "Edit Division"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row space gap-4">
                        <div className="space-y-2 w-full">
                            <Label htmlFor="name">Division Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter division name"
                                required
                                className="rounded-lg"
                            />
                        </div>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="responsible">Responsible Person</Label>
                            <Select
                                value={formData.responsibleUuid}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, responsibleUuid: value }))}
                            >
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Select responsible person" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No one assigned</SelectItem>
                                    {employees.map((employee) => (
                                        <SelectItem key={employee.employee_uuid} value={employee.employee_uuid}>
                                            {employee.name.fullname}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Textarea
                            id="desc"
                            value={formData.desc}
                            onChange={(e) => setFormData((prev) => ({ ...prev, desc: e.target.value }))}
                            placeholder="Enter division description"
                            rows={3}
                            className="rounded-lg resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
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
                            className="bg-orange-500 hover:bg-orange-600 rounded-lg"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {mode === "create" ? "Create Division" : "Update Division"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
