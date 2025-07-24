"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { DivisionType } from "@/lib/types/company-type"

interface DivisionFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (division: DivisionType | Omit<DivisionType, "uuid">) => void
    initialData?: DivisionType | null
}

export default function DivisionForm({ isOpen, onClose, onSubmit, initialData }: DivisionFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        company_uuid: "comp-1", // Default company
        responsible_uuid: null as string | null,
        hasResponsible: false,
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                desc: initialData.desc,
                company_uuid: initialData.company_uuid,
                responsible_uuid: initialData.responsible_uuid || "",
                hasResponsible: !!initialData.responsible_uuid,
            })
        } else {
            setFormData({
                name: "",
                desc: "",
                company_uuid: "comp-1",
                responsible_uuid: null,
                hasResponsible: false,
            })
        }
    }, [initialData, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const divisionData = {
            name: formData.name,
            desc: formData.desc,
            company_uuid: formData.company_uuid,
            responsible_uuid: formData.hasResponsible ? `user-${Date.now()}` : null,
        }

        if (initialData) {
            onSubmit({ ...divisionData, uuid: initialData.uuid })
        } else {
            onSubmit(divisionData)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-orange-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        {initialData ? "Edit Division" : "Create New Division"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update the division information below." : "Fill in the details to create a new division."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Division Name *
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Human Resources"
                                required
                                className="border-orange-200 focus:border-orange-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-sm font-medium">
                                Description *
                            </Label>
                            <Textarea
                                id="desc"
                                value={formData.desc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                placeholder="Describe the division's responsibilities and scope..."
                                required
                                rows={3}
                                className="border-orange-200 focus:border-orange-500"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-lg border border-orange-100">
                            <div className="space-y-1">
                                <Label htmlFor="hasResponsible" className="text-sm font-medium">
                                    Assign Responsible Person
                                </Label>
                                <p className="text-xs text-muted-foreground">Assign someone to be responsible for this division</p>
                            </div>
                            <Switch
                                id="hasResponsible"
                                checked={formData.hasResponsible}
                                onCheckedChange={(checked) => setFormData({ ...formData, hasResponsible: checked })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-orange-200 hover:bg-orange-50 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        >
                            {initialData ? "Update Division" : "Create Division"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
