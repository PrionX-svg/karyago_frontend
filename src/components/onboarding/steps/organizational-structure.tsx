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
import { motion, AnimatePresence, easeOut } from "framer-motion"

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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const formVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.4, ease: easeOut },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: { duration: 0.3 },
        },
    }

    const divisionItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 },
        },
        exit: {
            opacity: 0,
            x: 20,
            transition: { duration: 0.3 },
        },
    }

    return (
        <motion.div className="flex flex-col min-h-screen" initial="hidden" animate="visible" variants={containerVariants}>
            <main className="flex-1">
                <div className="flex-1 flex flex-col lg:flex-row items-start px-8 py-8 gap-4 sm:gap-16 max-w-7xl mx-auto w-full">
                    <motion.div className="lg:w-80 space-y-6 py-4" variants={itemVariants}>
                        {/* Progress Card */}
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className="p-2 bg-orange-100 rounded-lg"
                                            whileHover={{ rotate: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Layers3 className="h-5 w-5 text-orange-600" />
                                        </motion.div>
                                        <div>
                                            <CardTitle className="text-lg">Organization Structure</CardTitle>
                                            <CardDescription>Step 3 of 4</CardDescription>
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
                        </motion.div>

                        {/* Best Practices Card */}
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                                            <Lightbulb className="h-5 w-5 text-amber-600" />
                                        </motion.div>
                                        <CardTitle className="text-lg text-amber-800">Best Practices</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">Start with main departments first</p>
                                        </motion.div>
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">Add sub-divisions for larger departments</p>
                                        </motion.div>
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">
                                                Responsible persons will be assigned after adding employees
                                            </p>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.section className="flex-1 p-4" variants={itemVariants}>
                        <div className="max-w-2xl">
                            <motion.div
                                className="flex items-center justify-between mb-8"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Organizational Structure</h2>
                                    <p className="text-gray-600">Create divisions and departments for your company</p>
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={() => setShowForm(true)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                                        disabled={isLoading}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Division
                                    </Button>
                                </motion.div>
                            </motion.div>

                            {/* Division Form */}
                            <AnimatePresence>
                                {showForm && (
                                    <motion.div
                                        variants={formVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="bg-white rounded-lg border border-orange-200 p-6 mb-6"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Division</h3>
                                        <div className="space-y-4">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <Label className="text-gray-700 font-medium mb-2">Division Name *</Label>
                                                <Input
                                                    value={newDivision.name}
                                                    onChange={(e) => setNewDivision((prev) => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Human Resources"
                                                    className="border-orange-200 focus:border-orange-400"
                                                />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                            >
                                                <Label className="text-gray-700 font-medium mb-2">Description (Optional)</Label>
                                                <Input
                                                    value={newDivision.description}
                                                    onChange={(e) => setNewDivision((prev) => ({ ...prev, description: e.target.value }))}
                                                    placeholder="Manages human resources and employee relations"
                                                    className="border-orange-200 focus:border-orange-400"
                                                />
                                            </motion.div>
                                            <motion.div
                                                className="flex gap-3"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.3 }}
                                            >
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button onClick={handleAddDivision} className="bg-orange-500 hover:bg-orange-600">
                                                        Add Division
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button variant="outline" onClick={() => setShowForm(false)} className="bg-transparent">
                                                        Cancel
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Divisions List */}
                            <AnimatePresence>
                                {divisions.length > 0 ? (
                                    <motion.div
                                        className="space-y-4 mb-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {divisions.map((division, index) => (
                                            <motion.div
                                                key={division.id}
                                                variants={divisionItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
                                            >
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{division.name}</h4>
                                                    {division.description && <p className="text-sm text-gray-600">{division.description}</p>}
                                                </div>
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveDivision(division.id || "")}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    !showForm && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="border-2 border-dashed border-orange-200 rounded-lg p-12 text-center mb-8"
                                        >
                                            <motion.div
                                                className="w-16 h-16 mx-auto mb-6 text-orange-300"
                                                animate={{
                                                    rotate: [0, 5, -5, 0],
                                                    scale: [1, 1.05, 1],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatType: "reverse",
                                                }}
                                            >
                                                <Layers className="w-full h-full" />
                                            </motion.div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Divisions Created</h3>
                                            <p className="text-gray-600 mb-6">Start building your organizational structure</p>
                                        </motion.div>
                                    )
                                )}
                            </AnimatePresence>

                            {/* Navigation */}
                            <motion.div
                                className="flex justify-between items-center mt-12 max-w-2xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={handleNext}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 flex items-center gap-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                >
                                                    <LoadingSpinner size="sm" />
                                                </motion.div>
                                                Creating Structure...
                                            </>
                                        ) : (
                                            <>
                                                Next Step
                                                <ChevronRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>
                </div>
            </main>
            {/* Help Footer */}
            <HelpFooter />
        </motion.div>
    )
}
