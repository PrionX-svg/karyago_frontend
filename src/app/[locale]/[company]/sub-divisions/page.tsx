"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, Layers, Menu, PlusCircle, Users2, Briefcase } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type SubDivision = {
    id: number
    name: string
    division: string
    employees: number
}

const mockDivisions = ["Web Developer", "Finance", "Human Resources"]
const mockSubDivisions: SubDivision[] = [
    { id: 1, name: "Frontend Developer", division: "Web Developer", employees: 10 },
    { id: 2, name: "Backend Developer", division: "Web Developer", employees: 12 },
    { id: 3, name: "Recruitment", division: "Human Resources", employees: 5 },
]

export default function SubDivisionsDesign() {
    const [selectedDivision, setSelectedDivision] = useState<string | undefined>()
    const [viewType, setViewType] = useState<"card" | "table">("table")

    const handleAddSubDivision = () => console.log("Add sub-division")
    const handleEditSubDivision = (id: number) => console.log("Edit sub-division", id)
    const handleDeleteSubDivision = (id: number) => console.log("Delete sub-division", id)

    const filteredSubDivisions = selectedDivision
        ? mockSubDivisions.filter((s) => s.division === selectedDivision)
        : mockSubDivisions

    return (
        <div className="min-h-screen min-w-fit">
            {/* HEADER SECTION - Clean Minimal */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container">
                    <div className="pb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">                                
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Sub-Divisions</h1>
                                    <p className="text-gray-600">Manage team structures and assignments</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{filteredSubDivisions.length}</p>
                                    <p className="text-sm text-gray-500">Active Teams</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {filteredSubDivisions.reduce((acc, sub) => acc + sub.employees, 0)}
                                    </p>
                                    <p className="text-sm text-gray-500">Total Members</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY SECTION - Table Focused */}
            <div className="container py-6">
                {/* Toolbar - Merged Filter and Add */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Filter by Division:</span>
                        </div>
                        <Select
                            value={selectedDivision}
                            onValueChange={(value) => setSelectedDivision(value === "all" ? undefined : value)}
                        >
                            <SelectTrigger className="w-48 bg-white">
                                <SelectValue placeholder="All Divisions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Divisions</SelectItem>
                                {mockDivisions.map((division) => (
                                    <SelectItem key={division} value={division}>
                                        {division}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                            <Button
                                variant={viewType === "card" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("card")}
                                className="gap-2"
                            >
                                <Layers className="w-4 h-4" />
                                Cards
                            </Button>
                            <Button
                                variant={viewType === "table" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("table")}
                                className="gap-2"
                            >
                                <Menu className="w-4 h-4" />
                                Table
                            </Button>
                        </div>
                        <Button onClick={handleAddSubDivision} className="gap-2 bg-gray-900 hover:bg-gray-800">
                            <PlusCircle className="w-4 h-4" />
                            Add Sub-Division
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                {viewType === "table" ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Users2 className="w-4 h-4" />
                                                Sub-Division Name
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                Parent Division
                                            </div>
                                        </th>
                                        <th className="text-center py-4 px-6 font-semibold text-gray-900">
                                            <div className="flex items-center justify-center gap-2">
                                                <Users2 className="w-4 h-4" />
                                                Team Size
                                            </div>
                                        </th>
                                        <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubDivisions.map((sub, index) => (
                                        <tr
                                            key={sub.id}
                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{sub.name}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                                                    {sub.division}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full font-bold">
                                                    {sub.employees}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditSubDivision(sub.id)}>
                                                        <Pencil className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSubDivision(sub.id)}>
                                                        <Trash className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredSubDivisions.map((sub) => (
                            <Card
                                key={sub.id}
                                className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Users2 className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-gray-900">{sub.name}</CardTitle>
                                                <p className="text-sm text-gray-500">{sub.division}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditSubDivision(sub.id)}>
                                                <Pencil className="w-4 h-4 text-gray-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSubDivision(sub.id)}>
                                                <Trash className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Team Members</span>
                                        <div className="flex items-center gap-2">
                                            <Users2 className="w-4 h-4 text-gray-500" />
                                            <span className="font-bold text-gray-900">{sub.employees}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {filteredSubDivisions.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Users2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No sub-divisions found</h3>
                        <p className="text-gray-600 mb-4">No sub-divisions match your current filter criteria.</p>
                        <Button onClick={() => setSelectedDivision(undefined)} variant="outline">
                            Clear Filter
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
