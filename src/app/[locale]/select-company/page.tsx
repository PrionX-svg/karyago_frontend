"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useUserStore } from "@/stores/user-store"
import userQueries from "@/lib/queries/user-queries"
import { useCompanyStore } from "@/stores/company-store"
import company from "@/lib/queries/company-queries"
import CompanySkeleton from "./loading"
import { Building2, ChevronRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { encrypt } from "@/lib/encrypt"
import { motion, AnimatePresence } from "framer-motion"

export default function ChooseCompanyPage() {
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
    const router = useRouter()
    const userData = useUserStore((state) => state.user)
    const companyData = useCompanyStore((state) => state.company)
    const { isFetchingGetMe } = userQueries.useGetMe()
    const { isFetchingCompanies, fetchCompaniesByUserUuid } = company.useGetCompaniesByUserUuid()

    const handleCompanySelect = async (companyName: string, companyUuid: string) => {
        setSelectedCompany(companyName)
        const encrypted = await encrypt(companyUuid)
        localStorage.setItem("atem", encrypted)
        router.push(`/${companyName}/dashboard`)
    }

    useEffect(() => {
        if (!companyData || companyData.length === 0) {
            const fetchCompanydata = async () => {
                try {
                    await fetchCompaniesByUserUuid(userData.uuid)
                } catch (error) {
                    console.error("Failed to fetch company data:", error)
                }
            }
            fetchCompanydata()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyData, userData.uuid])

    if (isFetchingGetMe || isFetchingCompanies) {
        return <CompanySkeleton />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
            {/* Background decorations */}
            <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 2, delay: 0.2 }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 2, delay: 0.4 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-full blur-3xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, delay: 0.6 }}
                />
            </motion.div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
                <motion.div
                    className="w-full max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <motion.div
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.7,
                            }}
                        >
                            <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>
                        <motion.h1
                            className="text-2xl font-bold text-gray-900 mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                        >
                            Welcome back, {userData.fullName.split(" ")[0]}! 👋
                        </motion.h1>
                        <motion.p
                            className="text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.1 }}
                        >
                            Choose your workspace to continue
                        </motion.p>
                    </motion.div>

                    {/* Company Selection */}
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.3 }}
                    >
                        <AnimatePresence mode="wait">
                            {companyData.length === 0 ? (
                                <motion.div
                                    className="text-center py-12"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <motion.div
                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <Building2 className="w-8 h-8 text-gray-300" />
                                    </motion.div>
                                    <motion.div
                                        className="h-4 w-32 bg-gray-100 rounded mx-auto mb-2"
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                                    />
                                    <motion.div
                                        className="h-3 w-20 bg-gray-100 rounded mx-auto"
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                                    />
                                </motion.div>
                            ) : (
                                companyData.map((comp, index) => (
                                    <motion.button
                                        key={comp.uuid}
                                        className={`group w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${selectedCompany === comp.uuid
                                                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-[1.02]"
                                                : "bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md border border-gray-200/50 hover:border-orange-200"
                                            } ${selectedCompany !== null && selectedCompany !== comp.uuid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                        onClick={() => handleCompanySelect(comp.name, comp.uuid)}
                                        disabled={selectedCompany !== null && selectedCompany !== comp.uuid}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 1.5 + index * 0.1,
                                            type: "spring",
                                            stiffness: 100,
                                        }}
                                        whileHover={{
                                            scale: selectedCompany === null ? 1.02 : 1,
                                            transition: { duration: 0.2 },
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <motion.div
                                                        className={`w-14 h-14 rounded-xl overflow-hidden ${selectedCompany === comp.uuid ? "ring-2 ring-white/50" : "ring-1 ring-gray-200"
                                                            } transition-all duration-300`}
                                                        whileHover={{
                                                            rotate: selectedCompany === null ? [0, -5, 5, 0] : 0,
                                                            transition: { duration: 0.3 },
                                                        }}
                                                    >
                                                        <Image
                                                            src={comp.logo || "/placeholder.svg?height=56&width=56&query=company logo"}
                                                            alt={`${comp.name} logo`}
                                                            width={56}
                                                            height={56}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </motion.div>
                                                </div>
                                                <div className="flex-1">
                                                    <motion.p
                                                        className={`font-semibold text-base ${selectedCompany === comp.uuid ? "text-white" : "text-gray-900"
                                                            } transition-colors duration-300`}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 1.7 + index * 0.1 }}
                                                    >
                                                        {comp.name}
                                                    </motion.p>
                                                    <motion.p
                                                        className={`text-sm mt-1 ${selectedCompany === comp.uuid ? "text-white/80" : "text-gray-500"
                                                            } transition-colors duration-300`}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 1.8 + index * 0.1 }}
                                                    >
                                                        {comp.user.role}
                                                    </motion.p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <AnimatePresence mode="wait">
                                                    {selectedCompany === comp.uuid ? (
                                                        <motion.div
                                                            className="flex items-center gap-2"
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <motion.div
                                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                                animate={{ rotate: 360 }}
                                                                transition={{
                                                                    duration: 1,
                                                                    repeat: Number.POSITIVE_INFINITY,
                                                                    ease: "linear",
                                                                }}
                                                            />
                                                            <motion.span
                                                                className="text-white text-sm font-medium"
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.2 }}
                                                            >
                                                                Loading...
                                                            </motion.span>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: 10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 10 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <ChevronRight className="w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Footer */}
                    {companyData.length > 0 && (
                        <motion.div
                            className="text-center mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 1.5 + companyData.length * 0.1 + 0.3,
                            }}
                        >
                            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                                <Building2 className="w-4 h-4 mr-1" />
                                {companyData.length} companies available
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
