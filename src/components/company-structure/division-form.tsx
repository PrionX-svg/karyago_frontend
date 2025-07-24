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

interface DivisionDialogProps {
    mode: "create" | "edit"
    division?: {
        uuid: string
        name: string
        desc?: string
        responsibleUuid?: string
        responsible?: { name: string; uuid: string }
    }
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export function DivisionDialog({ mode, division, trigger, onSuccess }: DivisionDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        responsibleUuid: "",
    })
    const [employees, setEmployees] = useState<Array<{ uuid: string; name: string }>>([])

    const storedUuid = localStorage.getItem("atem")

    useEffect(() => {
        if (mode === "edit" && division) {
            setFormData({
                name: division.name || "",
                desc: division.desc || "",
                responsibleUuid: division.responsibleUuid || "",
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
                // Assuming there's an API to get employees
                // await api.getEmployeesByCompanyUuid(await decryptedUuid)
                // For now, using mock data
                setEmployees([
                    { uuid: "emp-1", name: "John Doe" },
                    { uuid: "emp-2", name: "Jane Smith" },
                    { uuid: "emp-3", name: "Mike Johnson" },
                ])
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
                name: formData.name,
                companyUuid,
                desc: formData.desc,
                responsibleUuid: formData.responsibleUuid || undefined,
            }

            if (mode === "create") {
                await api.createDivision(payload)
            } else if (division) {
                await api.updateDivision(division.uuid, payload)
            }

            // Refresh divisions data
            await api.getDivisionsByCompanyUuid(companyUuid)

            setOpen(false)
            onSuccess?.()
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
                    <div className="space-y-2">
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

                    <div className="space-y-2">
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
                                    <SelectItem key={employee.uuid} value={employee.uuid}>
                                        {employee.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
