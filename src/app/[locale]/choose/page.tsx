"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useUserStore } from "@/stores/user-store"
import userQueries from "@/lib/queries/user-queries"
import { useCompanyStore } from "@/stores/company-store"
import company from "@/lib/queries/company-queries"
import CompanySkeleton from "./loading"
import { Building2, ChevronRight, Clock, Search, Sparkles, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CompanyType } from "@/lib/types/company-type"

export default function ChooseCompanyPage() {
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [recentCompanies, setRecentCompanies] = useState<string[]>([])
    const { isFetchingGetMe } = userQueries.useGetMe()
    const userData = useUserStore((state) => state.user)
    const companyData = useCompanyStore((state) => state.company)
    const { fetchCompaniesByUserUuid } = company.useGetCompaniesByUserUuid()

    const handleCompanySelect = (companyId: string) => {
        setSelectedCompany(companyId)

        // Add to recent companies
        setRecentCompanies((prev) => {
            const updated = [companyId, ...prev.filter((id) => id !== companyId)].slice(0, 3)
            localStorage.setItem("recentCompanies", JSON.stringify(updated))
            return updated
        })

        setTimeout(() => {
            setSelectedCompany(null)
        }, 3000)
    }

    useEffect(() => {
        // Load recent companies from localStorage
        const stored = localStorage.getItem("recentCompanies")
        if (stored) {
            setRecentCompanies(JSON.parse(stored))
        }
    }, [])

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

    const filteredCompanies = companyData.filter((comp) => comp.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const recentCompanyData = companyData
        .filter((comp) => recentCompanies.includes(comp.uuid))
        .sort((a, b) => recentCompanies.indexOf(a.uuid) - recentCompanies.indexOf(b.uuid))

    if (isFetchingGetMe) {
        return <CompanySkeleton />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white-50 via-orange-50 to-red-50 relative overflow-hidden">
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
                        <p className="text-gray-600">Choose your company to continue</p>
                    </div>

                    {/* Search */}
                    {companyData.length > 3 && (
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                            />
                        </div>
                    )}

                    {/* Recent Companies */}
                    {recentCompanyData.length > 0 && !searchQuery && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Recent</span>
                            </div>
                            <div className="space-y-2">
                                {recentCompanyData.slice(0, 2).map((comp) => (
                                    <CompanyCard
                                        key={`recent-${comp.uuid}`}
                                        company={comp}
                                        isSelected={selectedCompany === comp.uuid}
                                        onSelect={handleCompanySelect}
                                        isDisabled={selectedCompany !== null}
                                        isRecent={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Companies */}
                    <div className="space-y-3">
                        {!searchQuery && recentCompanyData.length > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">All Companies</span>
                            </div>
                        )}

                        {filteredCompanies.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Building2 className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm">{searchQuery ? "No companies found" : "No companies available"}</p>
                            </div>
                        ) : (
                            filteredCompanies.map((comp) => (
                                <CompanyCard
                                    key={comp.uuid}
                                    company={comp}
                                    isSelected={selectedCompany === comp.uuid}
                                    onSelect={handleCompanySelect}
                                    isDisabled={selectedCompany !== null}
                                    isRecent={false}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {companyData.length > 0 && (
                        <div className="text-center mt-8">
                            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                                <Users className="w-4 h-4" />
                                {companyData.length} compan{companyData.length === 1 ? "y" : "ies"} available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function CompanyCard({
    company,
    isSelected,
    onSelect,
    isDisabled,
    isRecent,
}: {
    company: CompanyType
    isSelected: boolean
    onSelect: (id: string) => void
    isDisabled: boolean
    isRecent: boolean
}) {
    return (
        <button
            className={`group w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${isSelected
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-[1.02]"
                : "bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md border border-gray-200/50 hover:border-orange-200"
                } ${isDisabled && !isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => onSelect(company.uuid)}
            disabled={isDisabled && !isSelected}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div
                            className={`w-14 h-14 rounded-xl overflow-hidden ${isSelected ? "ring-2 ring-white/50" : "ring-1 ring-gray-200"
                                } transition-all duration-300`}
                        >
                            <Image
                                src={company.logo || "/placeholder.svg?height=56&width=56&query=company logo"}
                                alt={`${company.name} logo`}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {isRecent && !isSelected && (
                            <div className="absolute -top-1 -right-1">
                                <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 border-orange-200"
                                >
                                    Recent
                                </Badge>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <p
                            className={`font-semibold text-base ${isSelected ? "text-white" : "text-gray-900"
                                } transition-colors duration-300`}
                        >
                            {company.name}
                        </p>
                        <p
                            className={`text-sm mt-1 ${isSelected ? "text-white/80" : "text-gray-500"
                                } transition-colors duration-300`}
                        >
                            {company.user.role}
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    {isSelected ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-white text-sm font-medium">Connecting...</span>
                        </div>
                    ) : (
                        <ChevronRight
                            className={`w-5 h-5 transition-all duration-300 ${isSelected ? "text-white" : "text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1"
                                }`}
                        />
                    )}
                </div>
            </div>
        </button>
    )
}
