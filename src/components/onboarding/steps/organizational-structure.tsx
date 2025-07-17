"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Layers, Layers3, Lightbulb, Plus, X, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DivisionPayload, SubDivisionPayload } from "@/lib/interfaces/company-interface"
import { toast } from "sonner"
import postAPI from "@/lib/api/postAPI"
import { HelpFooter } from "../layout/help-footer"
import { motion, AnimatePresence, easeOut } from "framer-motion"
import { useCompanyStore } from "@/stores/company-store"
import { decrypt } from "@/lib/encrypt"
import deleteAPI from "@/lib/api/deleteAPI"
import { useTranslations } from "next-intl"

interface OrganizationalStructureProps {
    onNext: (divisions: DivisionPayload[], subDivisions: SubDivisionPayload[]) => void
}

export function OrganizationalStructure({ onNext }: OrganizationalStructureProps) {
    const [showDivisionForm, setShowDivisionForm] = useState(false)
    const [showSubDivisionForm, setShowSubDivisionForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("divisions")
    const [resolvedCompanyUuid, setResolvedCompanyUuid] = useState<string | null>(null)

    const companyLocalStorage = localStorage.getItem("meta")
    const companyUuid = useCompanyStore((state) => state.company[0]?.uuid)
    const divisions = useCompanyStore((state) => state.division)
    const subDivisions = useCompanyStore((state) => state.subDivision)
    const addDivision = useCompanyStore((state) => state.addDivision)
    const addSubDivision = useCompanyStore((state) => state.addSubDivision)
    const removeDivision = useCompanyStore((state) => state.removeDivision)
    const removeSubDivision = useCompanyStore((state) => state.removeSubDivision)
    const ap = useTranslations("api");
    const or = useTranslations("onboarding");
    const co = useTranslations("common");

    const [newDivision, setNewDivision] = useState<DivisionPayload>({
        company_uuid: "",
        name: "",
        desc: "",
    })

    const [newSubDivision, setNewSubDivision] = useState<SubDivisionPayload>({
        department_group_uuid: "",
        name: "",
        desc: "",
    })

    const handleAddDivision = async () => {
        if (newDivision.name.trim()) {
            try {
                setIsLoading(true)
                const response = await postAPI(newDivision, "/department-groups/create")
                if (response.status === 201) {
                    const createdDivision = response.data.data
                    addDivision(createdDivision)
                    setNewDivision({ company_uuid: resolvedCompanyUuid ?? "", name: "", desc: "" })
                    setShowDivisionForm(false)
                    toast.success(ap('createDivisionSuccess'))
                } else {
                    toast.error(ap('createDivisionFailed'))
                }
            } catch {
                toast.error(ap('somethingWentWrong'))
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleAddSubDivision = async () => {
        if (newSubDivision.name.trim() && newSubDivision.department_group_uuid) {
            try {
                setIsLoading(true)
                const response = await postAPI(newSubDivision, "/departments/create")
                if (response.status === 201) {
                    const createdSubDivision = response.data.data
                    addSubDivision(createdSubDivision)
                    setNewSubDivision({ department_group_uuid: "", name: "", desc: "" })
                    setShowSubDivisionForm(false)
                    toast.success(ap('createSubDivisionSuccess'))
                } else {
                    toast.error(ap('createSubDivisionFailed'))
                }
            } catch {
                toast.error(ap('somethingWentWrong'))
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleRemoveDivision = async (id: string) => {
        try {
            setIsLoading(true)
            if (!id) {
                toast.error(ap('missingId'))
                return
            }
            const response = await deleteAPI({}, `/department-groups/delete/${id}`)
            if (response.status === 200) {
                removeDivision(id)
                setNewDivision({ company_uuid: resolvedCompanyUuid ?? "", name: "", desc: "" })
                toast.success('deleteDivisionSuccess')
            } else {
                toast.error(ap('deleteDivisionFailed'))
            }
        } catch {
            toast.error(ap('somethingWentWrong'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveSubDivision = async (id: string) => {
        try {
            setIsLoading(true)
            if (!id) {
                toast.error(ap('missingId'))
                return
            }
            const response = await deleteAPI({}, `/departments/delete/${id}`)
            if (response.status === 200) {
                removeSubDivision(id)
                setNewSubDivision({ department_group_uuid: "", name: "", desc: "" })
                toast.success(ap('deleteSubDivisionSuccess'))
            } else {
                toast.error(ap('deleteSubDivisionFailed'))
            }
        } catch {
            toast.error(ap('somethingWentWrong'))
        } finally {
            setIsLoading(false)
        }
    }

    const getDivisionName = (divisionId: string) => {
        return divisions.find((div) => div.uuid === divisionId)?.name || "Unknown Division"
    }

    const getSubDivisionsByDivision = (divisionId: string) => {
        return subDivisions.filter((sub) => sub.department_group_uuid === divisionId)
    }

    const handleNext = async () => {
        onNext(divisions, subDivisions)
    }

    useEffect(() => {
        if (companyUuid) {
            setResolvedCompanyUuid(companyUuid)
        } else if (companyLocalStorage) {
            decrypt(companyLocalStorage)
                .then((decryptedUuid) => {
                    setResolvedCompanyUuid(decryptedUuid)
                })
                .catch((err) => {
                    console.error("❌ Failed to decrypt company UUID:", err)
                })
        }
    }, [companyUuid, companyLocalStorage])

    useEffect(() => {
        if (resolvedCompanyUuid) {
            setNewDivision((prev) => ({ ...prev, company_uuid: resolvedCompanyUuid }))
        }
    }, [resolvedCompanyUuid])

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
                                            <CardTitle className="text-lg">{or('organizationStructure')}</CardTitle>
                                            <CardDescription>{or('step3of4')}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {or('tip1')}
                                    </p>
                                    <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                                        {or.rich('tip2', {
                                            strong: (chunks) => <strong>{chunks}</strong>
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Best Practices Card */}
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                                            <Lightbulb className="h-5 w-5 text-amber-600" />
                                        </motion.div>
                                        <CardTitle className="text-lg text-amber-800">{or('bestPractices')}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">{or('best1')}</p>
                                        </motion.div>
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">{or('best2')}</p>
                                        </motion.div>
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">{or("best3")}</p>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Summary Card */}
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                                <CardHeader>
                                    <CardTitle className="text-lg text-blue-800">{or('structureSummary')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-700">{or('divisions')}:</span>
                                        <span className="font-semibold text-blue-800">{divisions.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-700">{or('subDivisions')}:</span>
                                        <span className="font-semibold text-blue-800">{subDivisions.length}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.section className="flex-1 p-4" variants={itemVariants}>
                        <div className="max-w-3xl">
                            <motion.div
                                className="mb-8"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{or("organizationStructure")}</h2>
                                <p className="text-gray-600">{or('formOrgDescription')}</p>
                            </motion.div>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="w-full mb-6 grid grid-cols-2 gap-2">
                                    <TabsTrigger
                                        value="divisions"
                                        className="flex items-center gap-2 px-2 py-2 text-sm sm:text-base justify-center"
                                    >
                                        <Layers className="w-4 h-4" />
                                        <span className="hidden sm:inline">{or('divisions')}</span>
                                        <span className="inline sm:hidden">Div.</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="subdivisions"
                                        className="flex items-center gap-2 px-2 py-2 text-sm sm:text-base justify-center"
                                        disabled={divisions.length === 0}
                                    >
                                        <Building2 className="w-4 h-4" />
                                        <span className="hidden sm:inline">{or('subDivisions')}</span>
                                        <span className="inline sm:hidden">Sub-div.</span>
                                        {divisions.length === 0 && (
                                            <span className="text-xs bg-gray-200 px-2 py-1 rounded hidden sm:inline">{co('disabled')}</span>
                                        )}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="divisions" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{or('divisions')}</h3>
                                            <p className="text-sm text-gray-600">{or('divisionDescription')}</p>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={() => setShowDivisionForm(true)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                                                disabled={isLoading}
                                            >
                                                <Plus className="w-4 h-4" />
                                                {or('addDivisionButton')}
                                            </Button>
                                        </motion.div>
                                    </div>

                                    {/* Division Form */}
                                    <AnimatePresence>
                                        {showDivisionForm && (
                                            <motion.div
                                                variants={formVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="bg-white rounded-lg border border-orange-200 p-6"
                                            >
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4">{or('divisionFormTitle')}</h4>
                                                <div className="space-y-4">
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.1 }}
                                                    >
                                                        <Label className="text-gray-700 font-medium mb-2">{or('divisionFormName')}</Label>
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
                                                        <Label className="text-gray-700 font-medium mb-2">{or('divisionFormDescription')}</Label>
                                                        <Input
                                                            value={newDivision.desc}
                                                            onChange={(e) => setNewDivision((prev) => ({ ...prev, desc: e.target.value }))}
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
                                                                {or('createDivisionButton')}
                                                            </Button>
                                                        </motion.div>
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button variant="outline" onClick={() => setShowDivisionForm(false)}>
                                                                {co('cancel')}
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
                                                className={`space-y-4 ${divisions.length > 4 ? "max-h-[32rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50" : ""}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {divisions.map((division, index) => (
                                                    <motion.div
                                                        key={division.uuid}
                                                        variants={divisionItemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        transition={{ delay: index * 0.1 }}
                                                        whileHover={{ scale: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                                        className="bg-white rounded-lg border border-orange-200 p-6"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-orange-800">{division.name}</h4>
                                                                {division.desc && <p className="text-sm text-orange-700 mt-1">{division.desc}</p>}
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-xs text-orange-700">Sub-divisions:</span>
                                                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                                                        {getSubDivisionsByDivision(division.uuid || "").length}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveDivision(division.uuid)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </motion.div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            !showDivisionForm && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="border-2 border-dashed border-orange-200 rounded-lg p-12 text-center"
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
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{or('noDivisions')}</h3>
                                                    <p className="text-gray-600 mb-6">{or('noDivisionsDescription')}</p>
                                                </motion.div>
                                            )
                                        )}
                                    </AnimatePresence>
                                </TabsContent>

                                <TabsContent value="subdivisions" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{or("subDivisions")}</h3>
                                            <p className="text-sm text-gray-600">{or('formOrgDescription2')}</p>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={() => setShowSubDivisionForm(true)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                                                disabled={isLoading || divisions.length === 0}
                                            >
                                                <Plus className="w-4 h-4" />
                                                {or('addSubDivisionButton')}
                                            </Button>
                                        </motion.div>
                                    </div>

                                    {divisions.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center"
                                        >
                                            <Building2 className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                                            <h3 className="text-lg font-semibold text-amber-800 mb-2">{or('noDivisions2')}</h3>
                                            <p className="text-amber-700 mb-4">
                                                {or('noDivisionsDescription2')}
                                            </p>
                                            <Button
                                                onClick={() => setActiveTab("divisions")}
                                                variant="outline"
                                                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                                            >
                                                {or('goToDivisionsButton')}
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* Sub-division Form */}
                                    <AnimatePresence>
                                        {showSubDivisionForm && divisions.length > 0 && (
                                            <motion.div
                                                variants={formVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="bg-white rounded-lg border border-orange-200 p-6"
                                            >
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4">{or('subDivisionFormTitle')}</h4>
                                                <div className="space-y-4">
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.1 }}
                                                    >
                                                        <Label className="text-gray-700 font-medium mb-2">{or('subDivisionFormParentName')}</Label>
                                                        <Select
                                                            value={newSubDivision.department_group_uuid}
                                                            onValueChange={(value) =>
                                                                setNewSubDivision((prev) => ({ ...prev, department_group_uuid: value }))
                                                            }
                                                        >
                                                            <SelectTrigger className="border-orange-200 focus:border-orange-400">
                                                                <SelectValue placeholder={or('subDivisionFormParentNamePlaceholder')} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {divisions.map((division) => (
                                                                    <SelectItem key={division.name} value={division.uuid}>
                                                                        {division.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </motion.div>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.2 }}
                                                    >
                                                        <Label className="text-gray-700 font-medium mb-2">{or('subDivisionFormName')}</Label>
                                                        <Input
                                                            value={newSubDivision.name}
                                                            onChange={(e) => setNewSubDivision((prev) => ({ ...prev, name: e.target.value }))}
                                                            placeholder="Recruitment"
                                                            className="border-orange-200 focus:border-orange-400"
                                                        />
                                                    </motion.div>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.3 }}
                                                    >
                                                        <Label className="text-gray-700 font-medium mb-2">{or('subDivisionFormDescription')}</Label>
                                                        <Input
                                                            value={newSubDivision.desc}
                                                            onChange={(e) => setNewSubDivision((prev) => ({ ...prev, desc: e.target.value }))}
                                                            placeholder="Handles recruitment and talent acquisition"
                                                            className="border-orange-200 focus:border-orange-400"
                                                        />
                                                    </motion.div>
                                                    <motion.div
                                                        className="flex gap-3"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.4 }}
                                                    >
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button onClick={handleAddSubDivision} className="bg-orange-500 hover:bg-orange-600">
                                                                {or('addSubDivisionButton')}
                                                            </Button>
                                                        </motion.div>
                                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                            <Button variant="outline" onClick={() => setShowSubDivisionForm(false)}>
                                                                {co('cancel')}
                                                            </Button>
                                                        </motion.div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {/* Sub-divisions List */}
                                    <AnimatePresence>
                                        {subDivisions.length > 0 ? (
                                            <>
                                                {(() => {
                                                    const shouldScroll = subDivisions.length > 4;
                                                    const scrollClasses = shouldScroll
                                                        ? "max-h-[32rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50 scroll-smooth"
                                                        : "";
                                                    return (
                                                        <motion.div
                                                            className={`space-y-4 ${scrollClasses}`}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            {subDivisions.map((subDivision, index) => (
                                                                <motion.div
                                                                    key={subDivision.uuid}
                                                                    variants={divisionItemVariants}
                                                                    initial="hidden"
                                                                    animate="visible"
                                                                    exit="exit"
                                                                    transition={{ delay: index * 0.1 }}
                                                                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                                                    className="bg-white rounded-lg border border-gray-200 p-4"
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                                                    {getDivisionName(subDivision.department_group_uuid)}
                                                                                </span>
                                                                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                                                            </div>
                                                                            <h4 className="font-semibold text-gray-900">{subDivision.name}</h4>
                                                                            {subDivision.desc && (
                                                                                <p className="text-sm text-gray-600 mt-1">{subDivision.desc}</p>
                                                                            )}
                                                                        </div>
                                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleRemoveSubDivision(subDivision.uuid || "")}
                                                                                className="text-red-500 hover:text-red-700"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </Button>
                                                                        </motion.div>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </motion.div>
                                                    );
                                                })()}
                                            </>
                                        ) : (
                                            divisions.length > 0 &&
                                            !showSubDivisionForm && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="border-2 border-dashed border-orange-200 rounded-lg p-12 text-center"
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
                                                        <Building2 className="w-full h-full" />
                                                    </motion.div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{or('noSubDivisions')}</h3>
                                                    <p className="text-gray-600 mb-6">{or('noSubDivisionsDescription')}</p>
                                                </motion.div>
                                            )
                                        )}
                                    </AnimatePresence>
                                </TabsContent>
                            </Tabs>
                            {/* Navigation */}
                            <motion.div
                                className="flex justify-between items-center mt-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <div />
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={handleNext}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 flex items-center gap-2"
                                        disabled={isLoading}
                                    >
                                        {divisions.length === 0 ? (
                                            <>
                                                {or('skipButton')}
                                                <ChevronRight className="w-4 h-4" />
                                            </>
                                        ) : isLoading ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                >
                                                    <LoadingSpinner size="sm" />
                                                </motion.div>
                                                {or('creatingStructure')}
                                            </>
                                        ) : (
                                            <>
                                                {or('nextButton')}
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
