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

interface SubDivisionDialogProps {
    mode: "create" | "edit"
    subDivision?: {
        uuid: string
        name: string
        desc?: string
        departmentGroupUuid?: string
        divisions?: { name: string; uuid: string }
    }
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export function SubDivisionDialog({ mode, subDivision, trigger, onSuccess }: SubDivisionDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        departmentGroupUuid: "",
    })

    const divisionsData = useCompanyStore((state) => state.division)
    const storedUuid = localStorage.getItem("atem")

    useEffect(() => {
        if (mode === "edit" && subDivision) {
            setFormData({
                name: subDivision.name || "",
                desc: subDivision.desc || "",
                departmentGroupUuid: subDivision.departmentGroupUuid || "",
            })
        } else {
            setFormData({
                name: "",
                desc: "",
                departmentGroupUuid: "",
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
                console.error("Failed to fetch divisions:", error)
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
            const decryptedUuid = decrypt(storedUuid)
            const companyUuid = await decryptedUuid

            const payload = {
                name: formData.name,
                desc: formData.desc,
                departmentGroupUuid: formData.departmentGroupUuid,
            }

            if (mode === "create") {
                await api.createSubDivision(payload)
            } else if (subDivision) {
                await api.updateSubDivision(subDivision.uuid, payload)
            }

            // Refresh sub-divisions data
            await api.getSubDivisionsByCompanyUuid(companyUuid)

            setOpen(false)
            onSuccess?.()
        } catch (error) {
            console.error(`Failed to ${mode} sub-division:`, error)
        } finally {
            setLoading(false)
        }
    }

    const defaultTrigger = (
        <Button
            className={`gap-2 ${mode === "create" ? "bg-orange-500 hover:bg-orange-600" : "hover:bg-teal-100"} rounded-lg`}
            variant={mode === "create" ? "default" : "ghost"}
            size={mode === "create" ? "default" : "icon"}
        >
            {mode === "create" ? (
                <>
                    <Plus className="w-4 h-4" />
                    Add Sub-Division
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
                            <Target className="w-5 h-5 text-orange-600" />
                        </div>
                        {mode === "create" ? "Create New Sub-Division" : "Edit Sub-Division"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Sub-Division Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter sub-division name"
                            required
                            className="rounded-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="departmentGroup">Parent Division *</Label>
                        <Select
                            value={formData.departmentGroupUuid}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentGroupUuid: value }))}
                            required
                        >
                            <SelectTrigger className="rounded-lg">
                                <SelectValue placeholder="Select parent division" />
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

                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Textarea
                            id="desc"
                            value={formData.desc}
                            onChange={(e) => setFormData((prev) => ({ ...prev, desc: e.target.value }))}
                            placeholder="Enter sub-division description"
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
                            disabled={loading || !formData.name.trim() || !formData.departmentGroupUuid}
                            className="bg-orange-500 hover:bg-orange-600 rounded-lg"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {mode === "create" ? "Create Sub-Division" : "Update Sub-Division"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
