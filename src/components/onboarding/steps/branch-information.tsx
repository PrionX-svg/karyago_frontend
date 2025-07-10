"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MapPin, Plus, X } from "lucide-react"
import { SidebarCard } from "../layout/sidebar-card"
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
            <div className="flex flex-col lg:flex-row items-start px-6 lg:px-16 py-10 max-w-7xl mx-auto">
                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[70vh]">
                    <div className="w-full max-w-2xl">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Branch Locations</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
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

                        {/* Branch Form */}
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
                        {/* Navigation + HelpCard horizontal */}
                        <div className="mt-8 lg:mt-12">
                            {/* Navigation Buttons */}
                            <div className="flex flex-col justify-between w-full lg:w-1/2 gap-4">
                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={onPrevious}
                                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm lg:text-base"
                                        disabled={isLoading}
                                    >
                                        ← Previous
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
                                            "Next Step →"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 self-stretch p-4 sm:p-6 space-y-4">
                    <SidebarCard
                        icon={MapPin}
                        title="Branch Setup"
                        description="Add multiple locations if your company operates from different offices or branches."
                        items={["This step is optional – skip if you have only one location"]}
                        variant="primary"
                    />
                    <SidebarCard
                        icon={MapPin}
                        title="Quick Guide"
                        description=""
                        items={[
                            "Each branch can have its own contact details",
                            "Employees can be assigned to specific branches",
                            "You can add more branches later",
                        ]}
                        variant="secondary"
                    />
                </div>
            </div>
            <div className="flex-1 bg-white border-t border-gray-200 h-fit">
                <HelpFooter />
            </div>
        </div>
    )
}
