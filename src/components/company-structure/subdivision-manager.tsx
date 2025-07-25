"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import SubDivisionForm from "@/components/company-structure/subdivision-form"
import DeleteConfirmDialog from "@/components/company-structure/delete-confirm-dialog"
import { DivisionType, SubDivisionType } from "@/lib/types/company-type"

interface SubDivisionManagerProps {
    subDivisions: SubDivisionType[]
    setSubDivisions: (subDivisions: SubDivisionType[]) => void
    divisions: DivisionType[]
    viewMode: "table" | "card"
}

export default function SubDivisionManager({
    subDivisions,
    setSubDivisions,
    divisions,
    viewMode,
}: SubDivisionManagerProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingSubDivision, setEditingSubDivision] = useState<SubDivisionType | null>(null)
    const [deletingSubDivision, setDeletingSubDivision] = useState<SubDivisionType | null>(null)

    const handleCreate = (subDivision: Omit<SubDivisionType, "uuid">) => {
        const newSubDivision: SubDivisionType = {
            ...subDivision,
            uuid: `sub-${Date.now()}`,
        }
        setSubDivisions([...subDivisions, newSubDivision])
        setIsFormOpen(false)
    }

    const handleUpdate = (updatedSubDivision: SubDivisionType | Omit<SubDivisionType, "uuid">) => {
        if ("uuid" in updatedSubDivision) {
            setSubDivisions(subDivisions.map((sub) => (sub.uuid === updatedSubDivision.uuid ? updatedSubDivision as SubDivisionType : sub)))
        }
        setEditingSubDivision(null)
    }

    const handleDelete = (uuid: string) => {
        setSubDivisions(subDivisions.filter((sub) => sub.uuid !== uuid))
        setDeletingSubDivision(null)
    }

    const openEditForm = (subDivision: SubDivisionType) => {
        setEditingSubDivision(subDivision)
    }

    const getDivisionName = (departmentGroupUuid: string) => {
        const division = divisions.find((div) => div.uuid === departmentGroupUuid)
        return division?.name || "Unknown Division"
    }

    if (viewMode === "table") {
        return (
            <>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-orange-100 overflow-hidden">
                    <div className="p-6 border-b border-orange-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Sub-Divisions</h2>
                            <p className="text-muted-foreground">Manage departments within your divisions</p>
                        </div>
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Sub-Division
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-orange-100">
                                <TableHead>Sub-Division Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Parent Division</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subDivisions.map((subDivision) => (
                                <TableRow key={subDivision.uuid} className="border-orange-50 hover:bg-orange-50/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                                                {subDivision.name.charAt(0)}
                                            </div>
                                            {subDivision.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs">
                                        <p className="text-sm text-muted-foreground truncate">{subDivision.desc}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                            <Building className="w-3 h-3 mr-1" />
                                            {getDivisionName(subDivision.department_group_uuid)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditForm(subDivision)}
                                                className="border-orange-200 hover:bg-orange-50"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeletingSubDivision(subDivision)}
                                                className="border-red-200 hover:bg-red-50 text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <SubDivisionForm
                    isOpen={isFormOpen || !!editingSubDivision}
                    onClose={() => {
                        setIsFormOpen(false)
                        setEditingSubDivision(null)
                    }}
                    onSubmit={editingSubDivision ? handleUpdate : handleCreate}
                    initialData={editingSubDivision}
                    divisions={divisions}
                />

                <DeleteConfirmDialog
                    isOpen={!!deletingSubDivision}
                    onClose={() => setDeletingSubDivision(null)}
                    onConfirm={() => deletingSubDivision && handleDelete(deletingSubDivision.uuid)}
                    title="Delete Sub-Division"
                    description={`Are you sure you want to delete "${deletingSubDivision?.name}"? This action cannot be undone.`}
                />
            </>
        )
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Sub-Divisions</h2>
                        <p className="text-muted-foreground">Manage departments within your divisions</p>
                    </div>
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Sub-Division
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subDivisions.map((subDivision) => (
                        <Card
                            key={subDivision.uuid}
                            className="bg-white/70 backdrop-blur-sm border-orange-100 hover:shadow-lg transition-all duration-200 hover:border-orange-200"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                            {subDivision.name.charAt(0)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{subDivision.name}</CardTitle>
                                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs mt-1">
                                                <Building className="w-3 h-3 mr-1" />
                                                {getDivisionName(subDivision.department_group_uuid)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <CardDescription className="text-sm leading-relaxed">{subDivision.desc}</CardDescription>

                                <div className="flex justify-end gap-2 pt-2 border-t border-orange-100">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditForm(subDivision)}
                                        className="border-orange-200 hover:bg-orange-50"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDeletingSubDivision(subDivision)}
                                        className="border-red-200 hover:bg-red-50 text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <SubDivisionForm
                isOpen={isFormOpen || !!editingSubDivision}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingSubDivision(null)
                }}
                onSubmit={editingSubDivision ? handleUpdate : handleCreate}
                initialData={editingSubDivision}
                divisions={divisions}
            />

            <DeleteConfirmDialog
                isOpen={!!deletingSubDivision}
                onClose={() => setDeletingSubDivision(null)}
                onConfirm={() => deletingSubDivision && handleDelete(deletingSubDivision.uuid)}
                title="Delete Sub-Division"
                description={`Are you sure you want to delete "${deletingSubDivision?.name}"? This action cannot be undone.`}
            />
        </>
    )
}
