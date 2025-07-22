"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useUserStore } from "@/stores/user-store"
import userQueries from "@/lib/queries/user-queries"
import { useCompanyStore } from "@/stores/company-store"
import company from "@/lib/queries/company-queries"
import CompanySkeleton from "./loading"
import { Building2, ChevronRight, Sparkles, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { encrypt } from "@/lib/encrypt"

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

    if (isFetchingGetMe || isFetchingCompanies ) {
        return <CompanySkeleton />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-lg mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome back, {userData.fullName.split(" ")[0]}! 👋
                        </h1>
                        <p className="text-gray-600">Choose your workspace to continue</p>
                    </div>

                    {/* Company Selection */}
                    <div className="space-y-3">
                        {companyData.length === 0 ? (
                            <div className="text-center py-12 animate-pulse">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Building2 className="w-8 h-8 text-gray-300" />
                                </div>
                                <div className="h-4 w-32 bg-gray-100 rounded mx-auto mb-2"></div>
                                <div className="h-3 w-20 bg-gray-100 rounded mx-auto"></div>
                            </div>
                        ) : (
                            companyData.map((comp) => (
                                <button
                                    key={comp.uuid}
                                    className={`group w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${selectedCompany === comp.uuid
                                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-[1.02]"
                                        : "bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md border border-gray-200/50 hover:border-orange-200"
                                        } ${selectedCompany !== null && selectedCompany !== comp.uuid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                    onClick={() => handleCompanySelect(comp.name, comp.uuid)}
                                    disabled={selectedCompany !== null && selectedCompany !== comp.uuid}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div
                                                    className={`w-14 h-14 rounded-xl overflow-hidden ${selectedCompany === comp.uuid ? "ring-2 ring-white/50" : "ring-1 ring-gray-200"
                                                        } transition-all duration-300`}
                                                >
                                                    <Image
                                                        src={comp.logo || "/placeholder.svg?height=56&width=56&query=company logo"}
                                                        alt={`${comp.name} logo`}
                                                        width={56}
                                                        height={56}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={`font-semibold text-base ${selectedCompany === comp.uuid ? "text-white" : "text-gray-900"
                                                        } transition-colors duration-300`}
                                                >
                                                    {comp.name}
                                                </p>
                                                <p
                                                    className={`text-sm mt-1 ${selectedCompany === comp.uuid ? "text-white/80" : "text-gray-500"
                                                        } transition-colors duration-300`}
                                                >
                                                    {comp.user.role}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {selectedCompany === comp.uuid ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-white text-sm font-medium">Loading...</span>
                                                </div>
                                            ) : (
                                                <ChevronRight className="w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {companyData.length > 0 && (
                        <div className="text-center mt-8">
                            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                                <Users className="w-4 h-4" />
                                {companyData.length} workspace{companyData.length !== 1 ? "s" : ""} available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
