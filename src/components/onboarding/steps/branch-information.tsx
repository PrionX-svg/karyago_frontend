"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Building, ChevronLeft, ChevronRight, Info, MapPin, Plus, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BranchPayload } from "@/lib/interfaces/onboarding-interface"
import { toast } from "sonner"
import postAPI from "@/lib/api/postAPI"
import { HelpFooter } from "../layout/help-footer"

interface BranchLocationsProps {
    onNext: (branches: BranchPayload[]) => void
    onPrevious: () => void
    companyUuid: string
}

export function BranchLocations({ onNext, onPrevious, companyUuid }: BranchLocationsProps) {
    const [branches, setBranches] = useState<BranchPayload[]>([])
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [newBranch, setNewBranch] = useState<BranchPayload>({
        company_uuid: companyUuid,
        name: "",
        address: "",
        email: "",
        phone: "",
    })

    const handleAddBranch = () => {
        if (newBranch.name.trim()) {
            setBranches((prev) => [...prev, { ...newBranch }])
            setNewBranch({
                company_uuid: companyUuid,
                name: "",
                address: "",
                email: "",
                phone: "",
            })
            setShowForm(false)
        }
    }

    const handleRemoveBranch = (index: number) => {
        setBranches((prev) => prev.filter((_, i) => i !== index))
    }

    const handleNext = async () => {
        setIsLoading(true)

        try {
            if (branches.length > 0) {
                const response = await postAPI(branches, "/onboarding/branches")
                if (response.status === 201) {
                    toast.success("Branches created successfully!")
                    setTimeout(() => {
                        onNext(branches)
                    }, 1000)
                } else {
                    toast.error("Failed to create branches")
                }
            } else {
                // Skip if no branches
                onNext([])
            }
        } catch {
            toast.error("An unexpected error occurred while creating branches. Please try again later.")
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
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <MapPin className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Branch Setup</CardTitle>
                                        <CardDescription>Step 2 of 4</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Add multiple locations if your company operates from different offices or branches.
                                </p>
                                <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <Info className="h-4 w-4 inline mr-2" />
                                    This step is optional – skip if you have only one location
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Guide Card */}
                        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-amber-600" />
                                    <CardTitle className="text-lg text-amber-800">Quick Guide</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">Each branch can have its own contact details</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">Employees can be assigned to specific branches</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-sm text-amber-700">You can add more branches later</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Main Content */}
                    <section className="flex-1">
                        <div className="max-w-2xl mx-auto p-4 lg:mx-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Branch Locations</h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-6 lg:mb-8">
                                Add multiple locations for your company. You can skip this if you only have one office.
                            </p>

                            {/* Empty State */}
                            {branches.length === 0 && !showForm && (
                                <div className="border-2 border-dashed border-orange-300 rounded-xl p-12 text-center bg-orange-50 mb-10">
                                    <div className="w-16 h-16 mx-auto mb-6 text-orange-400">
                                        <MapPin className="w-full h-full" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Branches Added</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Start by adding your first branch location to assign employees later.
                                    </p>
                                    <Button
                                        onClick={() => setShowForm(true)}
                                        className="bg-orange-400 hover:bg-orange-500 text-white"
                                        disabled={isLoading}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add First Branch
                                    </Button>
                                </div>
                            )}

                            {/* Form */}
                            {showForm && (
                                <div className="bg-white rounded-xl border border-orange-200 p-6 mb-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Branch</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-gray-700 font-medium mb-1">Branch Name *</Label>
                                                <Input
                                                    value={newBranch.name}
                                                    onChange={(e) => setNewBranch((prev) => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Jakarta Branch"
                                                    className="h-10 border-orange-200 focus:border-orange-400"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 font-medium mb-1">Email *</Label>
                                                <Input
                                                    type="email"
                                                    value={newBranch.email}
                                                    onChange={(e) => setNewBranch((prev) => ({ ...prev, email: e.target.value }))}
                                                    placeholder="jakarta@company.com"
                                                    className="h-10 border-orange-200 focus:border-orange-400"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-gray-700 font-medium mb-1">Phone *</Label>
                                            <Input
                                                value={newBranch.phone}
                                                onChange={(e) => setNewBranch((prev) => ({ ...prev, phone: e.target.value }))}
                                                placeholder="021-12345678"
                                                className="h-10 border-orange-200 focus:border-orange-400"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-gray-700 font-medium mb-1">Address *</Label>
                                            <Textarea
                                                value={newBranch.address}
                                                onChange={(e) => setNewBranch((prev) => ({ ...prev, address: e.target.value }))}
                                                placeholder="Complete branch address"
                                                className="resize-none min-h-[80px] border-orange-200 focus:border-orange-400"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <Button onClick={handleAddBranch} className="bg-orange-400 hover:bg-orange-500">
                                                Add Branch
                                            </Button>
                                            <Button variant="outline" onClick={() => setShowForm(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Branch List */}
                            {branches.length > 0 && (
                                <div className="space-y-4 mb-8">
                                    {branches.map((branch, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-start shadow-sm"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{branch.name}</h4>
                                                <p className="text-sm text-gray-600">{branch.address}</p>
                                                <p className="text-sm text-gray-500">
                                                    {branch.email} • {branch.phone}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveBranch(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-8 lg:mt-12">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onPrevious}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm lg:text-base"
                                    disabled={isLoading}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="bg-orange-400 hover:bg-orange-500 text-white px-4 lg:px-6 flex items-center gap-2 text-sm lg:text-base"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            {branches.length > 0 ? "Creating Branches..." : "Continuing..."}
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

            {/* Footer */}
            <HelpFooter />
        </div>
    )
}
