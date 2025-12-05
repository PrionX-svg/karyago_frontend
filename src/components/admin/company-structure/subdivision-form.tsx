"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Plus, Pencil, Loader2 } from "lucide-react"
import { useCompanyStore } from "@/stores/company-store"
import { api } from "@/lib/api/api"
import { decrypt } from "@/lib/encrypt"
import { toast } from "sonner"

interface SubDivisionDialogProps {
    mode: "create" | "edit"
    subDivision?: {
        uuid: string
        name: string
        desc?: string
        divisions?: { name: string; uuid: string }
    }
    trigger?: React.ReactNode
}

export function SubDivisionDialog({ mode, subDivision, trigger }: SubDivisionDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        department_group_uuid: "",
    })

    const divisionsData = useCompanyStore((state) => state.division)
    const storedUuid = localStorage.getItem("atem")

    useEffect(() => {
        if (mode === "edit" && subDivision) {
            setFormData({
                name: subDivision.name || "",
                desc: subDivision.desc || "",
                department_group_uuid: subDivision.divisions?.uuid || "",
            })
        } else {
            setFormData({
                name: "",
                desc: "",
                department_group_uuid: "",
            })
        }
    }, [mode, subDivision, open])

    useEffect(() => {
        const fetchDivisions = async () => {
            if (!storedUuid || divisionsData.length > 0) return
            try {
                const decryptedUuid = decrypt(storedUuid)
                await api.getDivisionsByCompanyUuid(await decryptedUuid)
            } catch (error) {
                console.error("Failed to fetch department:", error)
            }
        }

        if (open) {
            fetchDivisions()
        }
    }, [open, storedUuid, divisionsData.length])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!storedUuid) return

        setLoading(true)
        try {
            const payload = {
                name: formData.name,
                desc: formData.desc,
                department_group_uuid: formData.department_group_uuid,
            }

            if (mode === "create") {
                await api.createSubDivision(payload)
                    .then(() => toast.success("Department created successfully!"))
                    .catch(() => toast.error("Failed to create department"))
            } else if (subDivision) {
                await api.updateSubDivision(subDivision.uuid, payload)
                    .then(() => toast.success("Department updated successfully!"))
                    .catch(() => toast.error("Failed to update sdepartment"))
            }

            setOpen(false)
        } catch (error) {
            console.error(`Failed to ${mode} department:`, error)
        } finally {
            setLoading(false)
        }
    }

    const defaultTrigger = (
        <Button
            className={`gap-2 ${mode === "create" ? "bg-orange-500 hover:bg-orange-600" : "hover:bg-teal-100"} rounded-lg`}
            variant={mode === "create" ? "default" : "ghost"}
            size={mode === "create" ? "default" : "icon"}
            disabled={divisionsData.length === 0}
        >
            {mode === "create" ? (
            <>
                <Plus className="w-4 h-4" />
                Add Departmnet
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
                <DialogHeader className="mb-4 space-y-3 text-center">
                    <div className="flex justify-center">
                        <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                            <Target className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <DialogTitle className="text-base text-center font-semibold text-gray-900">
                        {mode === "create" ? "Create New Department" : "Edit Department"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row space gap-4">
                        <div className="space-y-2 w-full">
                            <Label htmlFor="name">Department Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter department name"
                                required
                                className="rounded-lg"
                            />
                        </div>

                        <div className="space-y-2 min-w-fit">
                            <Label htmlFor="departmentGroup">Department Group *</Label>
                            <Select
                                value={formData.department_group_uuid}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, department_group_uuid: value }))}
                                required
                            >
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Select department group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {divisionsData.map((division) => (
                                        <SelectItem key={division.uuid} value={division.uuid}>
                                            {division.name}
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
                            placeholder="Enter department description"
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
                            disabled={loading || !formData.name.trim() || !formData.department_group_uuid}
                            className="bg-orange-500 hover:bg-orange-600 rounded-lg"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {mode === "create" ? "Create Department" : "Update Department"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
