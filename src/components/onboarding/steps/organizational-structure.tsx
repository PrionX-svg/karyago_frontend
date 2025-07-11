"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ChevronLeft, ChevronRight, Layers, Layers3, Lightbulb, Plus, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DivisionPayload, SubDivisionPayload } from "@/lib/interfaces/onboarding-interface"
import { toast } from "sonner"
import postAPI from "@/lib/api/postAPI"
import { HelpFooter } from "../layout/help-footer"

interface OrganizationalStructureProps {
    onNext: (divisions: DivisionPayload[], subDivisions: SubDivisionPayload[]) => void
    onPrevious: () => void
}

export function OrganizationalStructure({ onNext, onPrevious }: OrganizationalStructureProps) {
    const [divisions, setDivisions] = useState<DivisionPayload[]>([])
    const [subDivisions, setSubDivisions] = useState<SubDivisionPayload[]>([])
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [newDivision, setNewDivision] = useState<DivisionPayload>({
        id: "",
        company_uuid: "",
        responsible_uuid: "",
        name: "",
        description: "",
    })

    const handleAddDivision = () => {
        if (newDivision.name.trim()) {
            const division: DivisionPayload = {
                ...newDivision,
                id: Date.now().toString(),
            }
            setDivisions((prev) => [...prev, division])
            setNewDivision({ id: "", company_uuid: "", responsible_uuid: "", name: "", description: "" })
            setShowForm(false)
        }
    }

    const handleRemoveDivision = (id: string) => {
        setDivisions((prev) => prev.filter((div) => div.id !== id))
        setSubDivisions((prev) => prev.filter((sub) => sub.division_uuid !== id))
    }

    const handleNext = async () => {
        if (divisions.length === 0) {
            toast.error("Please add at least one division before proceeding.")
            return
        }
        setIsLoading(true)
        try {
            const response = await postAPI(divisions, "/onboarding/company")
            if (response.status === 201) {
                toast.success("Organizational structure created successfully!")
                setTimeout(() => {
                    onNext(divisions, subDivisions)
                }, 1000)
            } else {
                toast.error("Failed to create organizational structure")
            }
        } catch {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <div className="flex-1 flex flex-col lg:flex-row items-start px-8 py-8 gap-4 sm:gap-16 max-w-7xl mx-auto w-full">
                    <div className="lg:w-80 space-y-6 py-4">
                        {/* Progress Card */}
                        <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Layers3 className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Organization Structure</CardTitle>
                                        <CardDescription>Step 2 of 3</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Create divisions and departments to organize your company structure effectively.
                                </p>
                                <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                                    <strong>Examples:</strong> HR, Finance, IT, Marketing, Operations
                                </div>
                            </CardContent>
                        </Card>

                        {/* Best Practices Card */}
                        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-amber-600" />
                                    <CardTitle className="text-lg text-amber-800">Best Practices</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">Start with main departments first</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">Add sub-divisions for larger departments</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">
                                            Responsible persons will be assigned after adding employees
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Main Content */}
                    <section className="flex-1 p-4">
                        <div className="max-w-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Organizational Structure</h2>
                                    <p className="text-gray-600">Create divisions and departments for your company</p>
                                </div>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Division
                                </Button>
                            </div>
                            {/* Division Form */}
                            {showForm && (
                                <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Division</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-gray-700 font-medium mb-2">Division Name *</Label>
                                            <Input
                                                value={newDivision.name}
                                                onChange={(e) => setNewDivision((prev) => ({ ...prev, name: e.target.value }))}
                                                placeholder="Human Resources"
                                                className="border-orange-200 focus:border-orange-400"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-gray-700 font-medium mb-2">Description (Optional)</Label>
                                            <Input
                                                value={newDivision.description}
                                                onChange={(e) =>
                                                    setNewDivision((prev) => ({ ...prev, description: e.target.value }))
                                                }
                                                placeholder="Manages human resources and employee relations"
                                                className="border-orange-200 focus:border-orange-400"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button onClick={handleAddDivision} className="bg-orange-500 hover:bg-orange-600">
                                                Add Division
                                            </Button>
                                            <Button variant="outline" onClick={() => setShowForm(false)} className="bg-transparent">
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Divisions List */}
                            {divisions.length > 0 ? (
                                <div className="space-y-4 mb-8">
                                    {divisions.map((division) => (
                                        <div
                                            key={division.id}
                                            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{division.name}</h4>
                                                {division.description && (
                                                    <p className="text-sm text-gray-600">{division.description}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveDivision(division.id || "")}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !showForm && (
                                    <div className="border-2 border-dashed border-orange-200 rounded-lg p-12 text-center mb-8">
                                        <div className="w-16 h-16 mx-auto mb-6 text-orange-300">
                                            <Layers className="w-full h-full" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Divisions Created</h3>
                                        <p className="text-gray-600 mb-6">Start building your organizational structure</p>
                                    </div>
                                )
                            )}

                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-12 max-w-2xl">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onPrevious}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                                    disabled={isLoading}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            Creating Structure...
                                        </>
                                    ) : (
                                        <>
                                            Next Step
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            {/* Help Footer */}
            <HelpFooter />
        </div>
    )
}
