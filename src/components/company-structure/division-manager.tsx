"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import DivisionForm from "@/components/company-structure/division-form"
import DeleteConfirmDialog from "@/components/company-structure/delete-confirm-dialog"
import { DivisionType } from "@/lib/types/company-type"

interface DivisionManagerProps {
    divisions: DivisionType[]
    setDivisions: (divisions: DivisionType[]) => void
    viewMode: "table" | "card"
    getSubDivisionCount: (divisionUuid: string) => number
}

export default function DivisionManager({
    divisions,
    setDivisions,
    viewMode,
    getSubDivisionCount,
}: DivisionManagerProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingDivision, setEditingDivision] = useState<DivisionType | null>(null)
    const [deletingDivision, setDeletingDivision] = useState<DivisionType | null>(null)

    const handleCreate = (division: Omit<DivisionType, "uuid">) => {
        const newDivision: DivisionType = {
            ...division,
            uuid: `div-${Date.now()}`,
        }
        setDivisions([...divisions, newDivision])
        setIsFormOpen(false)
    }

    const handleUpdate = (updatedDivision: DivisionType | Omit<DivisionType, "uuid">) => {
        if ("uuid" in updatedDivision) {
            setDivisions(divisions.map((div) => (div.uuid === updatedDivision.uuid ? updatedDivision as DivisionType : div)))
        }
        setEditingDivision(null)
    }

    const handleDelete = (uuid: string) => {
        setDivisions(divisions.filter((div) => div.uuid !== uuid))
        setDeletingDivision(null)
    }

    const openEditForm = (division: DivisionType) => {
        setEditingDivision(division)
    }

    if (viewMode === "table") {
        return (
            <>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-orange-100 overflow-hidden">
                    <div className="p-6 border-b border-orange-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Divisions</h2>
                            <p className="text-muted-foreground">Manage your organization&apos;s main divisions</p>
                        </div>
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Division
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-orange-100">
                                <TableHead>Division Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Responsible</TableHead>
                                <TableHead>Sub-Divisions</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {divisions.map((division) => (
                                <TableRow key={division.uuid} className="border-orange-50 hover:bg-orange-50/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold">
                                                {division.name.charAt(0)}
                                            </div>
                                            {division.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs">
                                        <p className="text-sm text-muted-foreground truncate">{division.desc}</p>
                                    </TableCell>
                                    <TableCell>
                                        {division.responsible_uuid ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                                                        <User className="w-3 h-3" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">Assigned</span>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="border-orange-200 text-orange-700">
                                                Unassigned
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                            {getSubDivisionCount(division.uuid)} sub-divisions
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditForm(division)}
                                                className="border-orange-200 hover:bg-orange-50"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeletingDivision(division)}
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

                <DivisionForm
                    isOpen={isFormOpen || !!editingDivision}
                    onClose={() => {
                        setIsFormOpen(false)
                        setEditingDivision(null)
                    }}
                    onSubmit={editingDivision ? handleUpdate : handleCreate}
                    initialData={editingDivision}
                />

                <DeleteConfirmDialog
                    isOpen={!!deletingDivision}
                    onClose={() => setDeletingDivision(null)}
                    onConfirm={() => deletingDivision && handleDelete(deletingDivision.uuid)}
                    title="Delete Division"
                    description={`Are you sure you want to delete "${deletingDivision?.name}"? This action cannot be undone.`}
                />
            </>
        )
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Divisions</h2>
                        <p className="text-muted-foreground">Manage your organization&apos;s main divisions</p>
                    </div>
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Division
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {divisions.map((division) => (
                        <Card
                            key={division.uuid}
                            className="bg-white/70 backdrop-blur-sm border-orange-100 hover:shadow-lg transition-all duration-200 hover:border-orange-200"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                                            {division.name.charAt(0)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{division.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                                                    <Users className="w-3 h-3 mr-1" />
                                                    {getSubDivisionCount(division.uuid)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <CardDescription className="text-sm leading-relaxed">{division.desc}</CardDescription>

                                <div className="flex items-center justify-between pt-2 border-t border-orange-100">
                                    <div className="flex items-center gap-2">
                                        {division.responsible_uuid ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                                                        <User className="w-3 h-3" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-muted-foreground">Assigned</span>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="border-orange-200 text-orange-700">
                                                Unassigned
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditForm(division)}
                                            className="border-orange-200 hover:bg-orange-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDeletingDivision(division)}
                                            className="border-red-200 hover:bg-red-50 text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <DivisionForm
                isOpen={isFormOpen || !!editingDivision}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingDivision(null)
                }}
                onSubmit={editingDivision ? handleUpdate : handleCreate}
                initialData={editingDivision}
            />

            <DeleteConfirmDialog
                isOpen={!!deletingDivision}
                onClose={() => setDeletingDivision(null)}
                onConfirm={() => deletingDivision && handleDelete(deletingDivision.uuid)}
                title="Delete Division"
                description={`Are you sure you want to delete "${deletingDivision?.name}"? This action cannot be undone.`}
            />
        </>
    )
}
