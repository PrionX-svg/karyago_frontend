"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DivisionType, SubDivisionType } from "@/lib/types/company-type"

interface SubDivisionFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (subDivision: SubDivisionType | Omit<SubDivisionType, "uuid">) => void
    initialData?: SubDivisionType | null
    divisions: DivisionType[]
}

export default function SubDivisionForm({ isOpen, onClose, onSubmit, initialData, divisions }: SubDivisionFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        department_group_uuid: "",
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                desc: initialData.desc,
                department_group_uuid: initialData.department_group_uuid,
            })
        } else {
            setFormData({
                name: "",
                desc: "",
                department_group_uuid: "",
            })
        }
    }, [initialData, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (initialData) {
            onSubmit({ ...formData, uuid: initialData.uuid })
        } else {
            onSubmit(formData)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-orange-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        {initialData ? "Edit Sub-Division" : "Create New Sub-Division"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update the sub-division information below."
                            : "Fill in the details to create a new sub-division."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="department_group_uuid" className="text-sm font-medium">
                                Parent Division *
                            </Label>
                            <Select
                                value={formData.department_group_uuid}
                                onValueChange={(value) => setFormData({ ...formData, department_group_uuid: value })}
                                required
                            >
                                <SelectTrigger className="border-orange-200 focus:border-orange-500">
                                    <SelectValue placeholder="Select a division" />
                                </SelectTrigger>
                                <SelectContent>
                                    {divisions.map((division) => (
                                        <SelectItem key={division.uuid} value={division.uuid}>
                                            {division.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Sub-Division Name *
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Recruitment"
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
                                placeholder="Describe the sub-division's responsibilities and scope..."
                                required
                                rows={3}
                                className="border-orange-200 focus:border-orange-500"
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
                            {initialData ? "Update Sub-Division" : "Create Sub-Division"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
