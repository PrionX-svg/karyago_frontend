"use client"

import {
    useEffect, useState
} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Building, ChevronRight, Info, MapPin, Plus, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BranchPayload } from "@/lib/interfaces/company-interface"
import { toast } from "sonner"
import postAPI from "@/lib/api/postAPI"
import { HelpFooter } from "../layout/help-footer"
import { motion, AnimatePresence, easeOut } from "framer-motion"
import { useCompanyStore } from "@/stores/company-store"
import { decrypt } from "@/lib/encrypt"
import { useTranslations } from "next-intl"
import deleteAPI from "@/lib/api/deleteAPI"
import company from "@/lib/queries/company-queries"
import BranchSetupSkeletonWithShimmer from "../loading/branch-loading"
interface BranchLocationsProps {
    onNext: () => void
}

export function BranchLocations({ onNext }: BranchLocationsProps) {
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [resolvedCompanyUuid, setResolvedCompanyUuid] = useState<string | null>(null)
    const { isFetchingBranches } = company.useGetBranchesByCompanyUuid(resolvedCompanyUuid || "")

    const addBranch = useCompanyStore((state) => state.addCompanyBranch)
    const companyUuid = useCompanyStore((state) => state.company[0]?.uuid)
    const companyBranches = useCompanyStore.getState().companyBranch
    const removeBranches = useCompanyStore((state) => state.removeCompanyBranch)
    const companyLocalStorage = sessionStorage.getItem("meta")
    const ap = useTranslations("api")
    const br = useTranslations("onboarding")
    const co = useTranslations("common")

    const [newBranch, setNewBranch] = useState<BranchPayload>({
        company_uuid: companyUuid,
        name: "",
        address: "",
        email: "",
        phone: "",
    })

    const handleAddBranch = async () => {
        if (newBranch.name.trim()) {
            try {
                const res = await postAPI(newBranch, "/branches/create")
                if (res.status === 201) {
                    const createdBranch = res.data.data
                    addBranch(createdBranch)
                    setNewBranch({
                        company_uuid: resolvedCompanyUuid || companyUuid,
                        name: "",
                        address: "",
                        email: "",
                        phone: "",
                    })
                    toast.success(ap("createBranchSuccess"))
                    setShowForm(false)
                } else {
                    toast.error(ap('createBranchFailed', { branch: newBranch.name }))
                }
            } catch {
                toast.error(ap('somethingWentWrong'))
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleRemoveBranch = async (index: string) => {
        try {
            setIsLoading(true)
            if (!index) {
                toast.error(ap('missingId'))
                return
            }
            const response = await deleteAPI({}, `/branches/delete/${index}`)
            if (response.status === 200) {
                removeBranches(index)
                setNewBranch({
                    company_uuid: resolvedCompanyUuid || companyUuid,
                    name: "",
                    address: "",
                    email: "",
                    phone: "",
                })
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

    const handleNext = async () => {
        setIsLoading(true)
        onNext()
    }

    useEffect(() => {
        if (companyUuid) {
            setResolvedCompanyUuid(companyUuid)
        } else if (companyLocalStorage) {
            decrypt(companyLocalStorage)
                .then((uuid) => setResolvedCompanyUuid(uuid))
                .catch((err) => {
                    console.error("Failed to decrypt UUID:", err)
                })
        }
    }, [companyUuid, companyLocalStorage])

    useEffect(() => {
        console.log("cb:", companyBranches)
    }, [companyBranches])


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

    const branchItemVariants = {
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

    if(isFetchingBranches) {
        return (
            <BranchSetupSkeletonWithShimmer />
        )
    }

    return (
        <motion.div className="flex flex-col min-h-screen" initial="hidden" animate="visible" variants={containerVariants}>
            <main className="flex-1">
                <div className="flex-1 flex flex-col lg:flex-row items-start px-8 py-8 gap-4 sm:gap-16 max-w-7xl mx-auto w-full">
                    <motion.div className="lg:w-80 space-y-6 py-4" variants={itemVariants}>
                        {/* Progress Card */}
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className="p-2 bg-orange-100 rounded-lg"
                                            whileHover={{ rotate: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <MapPin className="h-5 w-5 text-orange-600" />
                                        </motion.div>
                                        <div>
                                            <CardTitle className="text-lg">{br('branchSetup')}</CardTitle>
                                            <CardDescription>{br('step2of4')}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {br('progressTip1')}
                                    </p>
                                    <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <Info className="h-4 w-4 inline mr-2" />
                                        {br('progressTip2')}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Guide Card */}
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                                            <Building className="h-5 w-5 text-amber-600" />
                                        </motion.div>
                                        <CardTitle className="text-lg text-amber-800">{br('quickGuide')}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">{br('guide1')}</p>
                                        </motion.div>
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">{br('guide2')}</p>
                                        </motion.div>
                                        <motion.div className="flex gap-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-amber-700">{br('guide3')}</p>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.section className="flex-1" variants={itemVariants}>
                        <div className="max-w-2xl mx-auto p-4 lg:mx-0">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-8"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{br('branchTitle')}</h2>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            {br('branchDescription')}
                                        </p>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={() => setShowForm(true)}
                                            className="bg-orange-400 hover:bg-orange-500 text-white"
                                            disabled={isLoading || showForm}
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            {br('addBranchLocationButton')}
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Empty State */}
                            <AnimatePresence>
                                {companyBranches.length === 0 && !showForm && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5 }}
                                        className="border-2 border-dashed border-orange-300 rounded-xl p-12 text-center bg-orange-50 mb-10"
                                    >
                                        <motion.div
                                            className="w-16 h-16 mx-auto mb-6 text-orange-400"
                                            animate={{
                                                y: [0, -5, 0],
                                                rotate: [0, 2, -2, 0],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "reverse",
                                            }}
                                        >
                                            <MapPin className="w-full h-full" />
                                        </motion.div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{br('noBranchAdded')}</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {br('noBranchDescription')}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <AnimatePresence>
                                {showForm && (
                                    <motion.div
                                        variants={formVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="bg-white rounded-xl border border-orange-200 p-6 mb-6 shadow-sm"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{br('newBranchTitle')}</h3>
                                        <div className="space-y-4">
                                            <motion.div
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <div>
                                                    <Label className="text-gray-700 font-medium mb-1">{br('branchName')} *</Label>
                                                    <Input
                                                        value={newBranch.name}
                                                        onChange={(e) => setNewBranch((prev) => ({ ...prev, name: e.target.value }))}
                                                        placeholder="Jakarta Branch"
                                                        className="h-10 border-orange-200 focus:border-orange-400"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-gray-700 font-medium mb-1">{br('branchEmail')} *</Label>
                                                    <Input
                                                        type="email"
                                                        value={newBranch.email}
                                                        onChange={(e) => setNewBranch((prev) => ({ ...prev, email: e.target.value }))}
                                                        placeholder="jakarta@company.com"
                                                        className={`h-10 ${newBranch.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newBranch.email)
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-orange-200 focus:border-orange-400'}`}
                                                        required
                                                    />
                                                    {newBranch.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newBranch.email) && (
                                                        <p className="text-red-500 text-sm mt-1">{br('emailInvalid')}</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                            >
                                                <Label className="text-gray-700 font-medium mb-1">{br('branchPhone')} *</Label>
                                                <Input
                                                    value={newBranch.phone}
                                                    onChange={(e) => setNewBranch((prev) => ({ ...prev, phone: e.target.value }))}
                                                    placeholder="021-12345678"
                                                    className="h-10 border-orange-200 focus:border-orange-400"
                                                    required
                                                />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.3 }}
                                            >
                                                <Label className="text-gray-700 font-medium mb-1">{br('branchAddress')} *</Label>
                                                <Textarea
                                                    value={newBranch.address}
                                                    onChange={(e) => setNewBranch((prev) => ({ ...prev, address: e.target.value }))}
                                                    placeholder="Complete branch address"
                                                    className="resize-none min-h-[80px] border-orange-200 focus:border-orange-400"
                                                    required
                                                />
                                            </motion.div>
                                            <motion.div
                                                className="flex gap-3 pt-2"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.4 }}
                                            >
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        onClick={handleAddBranch}
                                                        className="bg-orange-400 hover:bg-orange-500"
                                                        disabled={!newBranch.name.trim() || !newBranch.email.trim() || !newBranch.phone.trim() || !newBranch.address.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newBranch.email)}
                                                    >
                                                        {br('addBranchButton')}
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button variant="outline" onClick={() => setShowForm(false)}>
                                                        {co('cancel')}
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Branch List */}
                            <AnimatePresence>
                                {companyBranches.length > 0 && (
                                    <motion.div
                                        className="space-y-4 mb-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {companyBranches.map((branch, index) => (
                                            <motion.div
                                                key={branch.uuid || index}
                                                variants={branchItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                                className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-start shadow-sm"
                                            >
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{branch.name}</h4>
                                                    <p className="text-sm text-gray-600">{branch.address}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {branch.email} • {branch.phone}
                                                    </p>
                                                </div>
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveBranch(branch.uuid || "")}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation */}
                            <motion.div
                                className="flex justify-between items-center mt-8 lg:mt-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <div />
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={handleNext}
                                        className="bg-orange-400 hover:bg-orange-500 text-white px-4 lg:px-6 flex items-center gap-2 text-sm lg:text-base"
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
                                            </>
                                        ) : (
                                            <>
                                                {companyBranches.length === 0 ? (
                                                    <>
                                                        {br('skipThisStep')}
                                                        <ChevronRight className="w-4 h-4" />
                                                    </>
                                                ) : (
                                                    <>
                                                        {br('nextButton')}
                                                        <ChevronRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>
                </div>
            </main>

            {/* Footer */}
            <HelpFooter />
        </motion.div>
    )
}
