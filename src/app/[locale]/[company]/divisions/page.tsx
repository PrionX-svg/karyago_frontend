"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, LayoutGrid, List, Plus, Search, Filter, Building2, Users } from "lucide-react"
import { Input } from "@/components/ui/input"

type Division = {
    id: number
    name: string
    leader: string
    subDivisionsCount: number
}

const mockDivisions: Division[] = [
    { id: 1, name: "Web Developer", leader: "Rahmat", subDivisionsCount: 3 },
    { id: 2, name: "Finance", leader: "Anita", subDivisionsCount: 2 },
    { id: 3, name: "Human Resources", leader: "Budi", subDivisionsCount: 4 },
]

export default function DivisionsPage() {
    const [viewType, setViewType] = useState<"card" | "table">("table")
    const [searchTerm, setSearchTerm] = useState("")

    const handleAddDivision = () => console.log("Add division")
    const handleEditDivision = (id: number) => console.log("Edit division", id)
    const handleDeleteDivision = (id: number) => console.log("Delete division", id)

    const filteredDivisions = mockDivisions.filter(
        (division) =>
            division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.leader.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const totalSubDivisions = mockDivisions.reduce((acc, div) => acc + div.subDivisionsCount, 0)

    return (
        <div className="min-h-screen">
            {/* HEADER SECTION */}
            <div className="bg-white">
                <div className="container">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <Building2 className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Divisions</h1>
                                <p className="text-gray-600 mt-1">Organize and manage your company divisions</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{mockDivisions.length}</p>
                                <p className="text-sm text-gray-500">Total Divisions</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{totalSubDivisions}</p>
                                <p className="text-sm text-gray-500">Sub-Divisions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY SECTION */}
            <div className="container pt-6">
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search divisions or leaders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-300"
                            />
                        </div>
                        <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <Button
                                variant={viewType === "table" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("table")}
                                className="gap-2"
                            >
                                <List className="w-4 h-4" />
                                Table
                            </Button>
                            <Button
                                variant={viewType === "card" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewType("card")}
                                className="gap-2"
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Cards
                            </Button>
                        </div>
                        <Button onClick={handleAddDivision} className="gap-2 bg-gray-900 hover:bg-gray-800">
                            <Plus className="w-4 h-4" />
                            Add Division
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                {viewType === "card" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDivisions.map((division) => (
                            <Card
                                key={division.id}
                                className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Building2 className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-gray-900">{division.name}</CardTitle>
                                                <p className="text-sm text-gray-500">Division</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditDivision(division.id)}>
                                                <Pencil className="w-4 h-4 text-gray-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDivision(division.id)}>
                                                <Trash className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Leader</span>
                                        <span className="font-semibold text-gray-900">{division.leader}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Sub-Divisions</span>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <span className="font-bold text-gray-900">{division.subDivisionsCount}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4" />
                                                Division Name
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Leader
                                            </div>
                                        </th>
                                        <th className="text-center py-4 px-6 font-semibold text-gray-900">
                                            <div className="flex items-center justify-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Sub-Divisions
                                            </div>
                                        </th>
                                        <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDivisions.map((division, index) => (
                                        <tr
                                            key={division.id}
                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{division.name}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                                                    {division.leader}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full font-bold">
                                                    {division.subDivisionsCount}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditDivision(division.id)}>
                                                        <Pencil className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteDivision(division.id)}>
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
                )}

                {filteredDivisions.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No divisions found</h3>
                        <p className="text-gray-600 mb-4">No divisions match your search criteria.</p>
                        <Button onClick={() => setSearchTerm("")} variant="outline">
                            Clear Search
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
