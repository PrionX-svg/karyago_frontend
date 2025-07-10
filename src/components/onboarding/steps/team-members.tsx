"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CheckCircle, Plus, Users } from "lucide-react"
import { SidebarCard } from "../layout/sidebar-card"
import { HelpCard } from "../layout/help-card"

interface TeamMembersProps {
    onComplete: () => void
    onPrevious: () => void
}

export function TeamMembers({ onComplete, onPrevious }: TeamMembersProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleComplete = async () => {
        setIsLoading(true)
        onComplete()
        setIsLoading(false)
    }

    const handleAddEmployee = () => {
        // This would navigate to add employee form
        console.log("Add employee clicked")
        handleComplete()
    }

    const handleImportExcel = () => {
        // This would open file upload dialog
        console.log("Import from Excel clicked")
        handleComplete()
    }

    return (
        <div className="flex-1 flex">
            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h2>
                    <p className="text-gray-600 mb-8">Your organization is ready for employees</p>

                    {/* Success State */}
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-6 bg-orange-500 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Setup Complete!</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Your organizational structure is ready. You can now start adding employees and begin using the HRIS
                            system.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <Button
                                onClick={handleAddEmployee}
                                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                                disabled={isLoading}
                            >
                                <Plus className="w-4 h-4" />
                                Add Employee Now
                            </Button>
                            <Button
                                onClick={handleImportExcel}
                                variant="outline"
                                className="border-orange-200 text-orange-600 hover:bg-orange-50 flex items-center gap-2 bg-transparent"
                                disabled={isLoading}
                            >
                                Import from Excel
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 max-w-2xl">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onPrevious}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                        disabled={isLoading}
                    >
                        ← Previous
                    </Button>
                    <Button
                        onClick={handleComplete}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 flex items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Completing Setup...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Complete Setup
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 p-6 space-y-6">
                <SidebarCard
                    icon={Users}
                    title="Ready for Team"
                    description="Your organizational structure is complete! Now you can start adding team members."
                    items={["Setup is almost complete!"]}
                    variant="primary"
                />

                <SidebarCard
                    icon={Users}
                    title="Next Steps"
                    description=""
                    items={[
                        "Add employees one by one manually",
                        "Import multiple employees from Excel",
                        "Assign employees to divisions and branches",
                    ]}
                    variant="secondary"
                />

                <HelpCard />
            </div>
        </div>
    )
}
