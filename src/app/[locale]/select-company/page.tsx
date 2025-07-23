"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useUserStore } from "@/stores/user-store"
import userQueries from "@/lib/queries/user-queries"
import { useCompanyStore } from "@/stores/company-store"
import company from "@/lib/queries/company-queries"
import CompanySkeleton from "./loading"
import { Building2, ChevronRight } from "lucide-react"
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
        <div
            className="min-h-screen relative"
            style={{
                background: `
                    url('/textures/diamond-eyes.png'),
                    linear-gradient(
                        135deg,
                        rgba(255, 236, 217, 0.4) 0%,
                        rgba(255, 224, 179, 0.35) 25%,
                        rgba(255, 213, 153, 0.3) 50%,
                        rgba(255, 204, 128, 0.25) 75%,
                        rgba(255, 193, 102, 0.2) 100%
                    )
                    `,
                backgroundRepeat: "repeat, no-repeat",
                backgroundSize: "auto, cover",
                backgroundBlendMode: "overlay",
            }}
        >
            <div className="flex items-center justify-center min-h-screen p-6">
                <motion.div
                    className="w-full max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid rgba(216, 67, 21, 0.15)",
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Building2 className="w-6 h-6 text-orange-400" />
                        </motion.div>

                        <motion.h1
                            className="text-2xl font-semibold mb-2 tracking-tight text-neutral-700 drop-shadow-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            Select company
                        </motion.h1>

                        <motion.p
                            className="text-sm text-neutral-600 drop-shadow-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Choose a company to continue
                        </motion.p>
                    </div>

                    {/* Company Selection */}
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <AnimatePresence mode="wait">
                            {companyData.length === 0 ? (
                                <motion.div
                                    className="text-center py-16"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 bg-white/90">
                                        <Building2 className="w-6 h-6 text-orange-700" />
                                    </div>
                                    <p className="text-sm text-white/70 drop-shadow-sm">No companies available</p>
                                </motion.div>
                            ) : (
                                companyData.map((comp, index) => (
                                    <motion.button
                                        key={comp.uuid}
                                        className={`group w-full text-left p-4 rounded-lg border backdrop-blur-md transition-all duration-200 
            ${selectedCompany === comp.uuid
                                                ? "bg-neutral-900 border-orange-700 text-white shadow-lg"
                                                : "bg-white/90 border-orange-200 hover:bg-orange-50 hover:shadow-md"
                                            } 
            ${selectedCompany !== null && selectedCompany !== comp.uuid
                                                ? "opacity-40 cursor-not-allowed"
                                                : "cursor-pointer"
                                            }`}
                                        onClick={() => handleCompanySelect(comp.name, comp.uuid)}
                                        disabled={selectedCompany !== null && selectedCompany !== comp.uuid}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                        whileHover={{ scale: selectedCompany === null ? 1.01 : 1 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            {/* Logo */}
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm border border-orange-200">
                                                    <Image
                                                        src={comp.logo || "/placeholder.svg?height=40&width=40&query=company logo"}
                                                        alt={`${comp.name} logo`}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`font-medium text-sm truncate ${selectedCompany === comp.uuid ? "text-white" : "text-gray-900"
                                                            }`}
                                                    >
                                                        {comp.name}
                                                    </p>
                                                    <p
                                                        className={`text-xs mt-0.5 truncate ${selectedCompany === comp.uuid ? "text-white/70" : "text-gray-600"
                                                            }`}
                                                    >
                                                        {comp.user.role}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Icon */}
                                            <div className="flex items-center ml-3">
                                                <AnimatePresence mode="wait">
                                                    {selectedCompany === comp.uuid ? (
                                                        <motion.div
                                                            className="w-4 h-4 border-2 border-orange-700 border-t-transparent rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{
                                                                duration: 1,
                                                                repeat: Number.POSITIVE_INFINITY,
                                                                ease: "linear",
                                                            }}
                                                        />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 text-orange-700 group-hover:text-orange-800 transition-colors" />
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
                            className="text-center mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.8 + companyData.length * 0.1,
                            }}
                        >
                            <p className="text-xs text-neutral-700 drop-shadow-sm">{companyData.length} companies available</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
