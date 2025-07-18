"use client"

import { useEffect, useState } from "react"
import { CompanyInformation } from "@/components/onboarding/steps/company-information"
import { BranchLocations } from "@/components/onboarding/steps/branch-information"
import { OrganizationalStructure } from "@/components/onboarding/steps/organizational-structure"
import { TeamMembers } from "@/components/onboarding/steps/team-members"
import { WelcomeScreen } from "@/components/onboarding/steps/welcome-screen"
import user from "@/lib/queries/user-queries"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useUserStore } from "@/stores/user-store"
import { api } from "@/lib/api/api"
import { useCompanyStore } from "@/stores/company-store"
import { encrypt } from "@/lib/encrypt"

export default function OnboardingPage() {
    const [showWelcome, setShowWelcome] = useState(true)
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const companyStoreData = useCompanyStore.getState().company;
    const companyUuid = useCompanyStore.getState().company[0]?.uuid;

    const { isFetchingGetMe } = user.useGetUMe()
    const router = useRouter()
    const userUuid = useUserStore((state) => state.user.uuid)
    const lo = useTranslations("onboarding")

    const handleCompanyNext = () => {
        setCurrentStep(2)
        localStorage.setItem("onboardingStep", String(2))
    }
    const handleBranchNext = () => {
        setCurrentStep(3)
        const fetchCompanyDivisions = async () => {
            if (companyUuid) {
                try {
                    await api.getDivisionsByCompanyUuid(companyUuid);
                } catch (error) {
                    console.error("Failed to fetch company divisions:", error);
                }
            }
        }
        const fetchCompanySubDivisions = async () => {
            if (companyUuid) {
                try {
                    await api.getSubDivisionsByCompanyUuid(companyUuid);
                } catch (error) {
                    console.error("Failed to fetch company subdivisions:", error);
                }
            }
        }
        fetchCompanyDivisions();
        fetchCompanySubDivisions();
        localStorage.setItem("onboardingStep", String(3))
    }
    const handleDivisionNext = () => {
        setCurrentStep(4)
        localStorage.setItem("onboardingStep", String(4))
    }

    const handleStartOnboarding = () => {
        if (!companyStoreData[0]) {
            setCurrentStep(1);
        } else {
            setCurrentStep(2);
        }
        setShowWelcome(false);
    };

    const finishOnboarding = () => {
        localStorage.removeItem("onboardingStep")
        localStorage.removeItem("meta")
        router.push("/dashboard")
    }

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!userUuid) return;
            if (userUuid) {
                setLoading(true);
                try {
                    await api.getCompanyByUserUuid(userUuid);
                    if (!companyStoreData[0]) {
                        setCurrentStep(1);
                    } else {
                        const encryptedUuid = await encrypt(companyUuid)
                        console.log("Encrypted UUID:", encryptedUuid)
                        localStorage.setItem("meta", encryptedUuid)
                    }
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchCompanyData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userUuid]);

    useEffect(() => {
        const fetchCompanyDivisions = async () => {
            if (companyUuid) {
                try {
                    await api.getDivisionsByCompanyUuid(companyUuid);
                } catch (error) {
                    console.error("Failed to fetch company divisions:", error);
                }
            }
        }
        const fetchCompanySubDivisions = async () => {
            if (companyUuid) {
                try {
                    await api.getSubDivisionsByCompanyUuid(companyUuid);
                } catch (error) {
                    console.error("Failed to fetch company subdivisions:", error);
                }
            }
        }
        fetchCompanyDivisions();
        fetchCompanySubDivisions();
    }, [companyUuid]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedStep = localStorage.getItem("onboardingStep")
            if (savedStep) {
                setCurrentStep(parseInt(savedStep))
                setShowWelcome(parseInt(savedStep) === 1)
            }
        }
    }, [])

    useEffect(() => {
        const steps = localStorage.getItem("onboardingStep")
        if (steps && steps !== "4") {
            setShowWelcome(false)
        }
    }, [])

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("onboardingStep")

            if (!stored) {
                localStorage.setItem("onboardingStep", String(currentStep))
            }

            if (currentStep > 1 && currentStep !== 4) {
                setShowWelcome(false)
            }
        }
    }, [currentStep])

    useEffect(() => {
        console.log("current step:", currentStep)
        console.log('user uuid:', userUuid)
        console.log("company store data:", companyStoreData)
    }, [companyStoreData, currentStep, userUuid])

    if (isFetchingGetMe) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#fff7f1] to-white px-4">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center shadow">
                        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800 text-center">
                        {lo("loadingTitle")}
                    </h1>
                    <p className="text-center text-gray-500 max-w-md">
                        {lo("loadingDescription")}
                    </p>
                </div>
            </div>
        )
    }
    if (showWelcome) {
        return <WelcomeScreen onStart={handleStartOnboarding} loadingState={loading} />
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-amber-25">
            {currentStep === 1 && <CompanyInformation onNext={handleCompanyNext} companyUuid={companyUuid} />}
            {currentStep === 2 && (
                <BranchLocations onNext={handleBranchNext} />
            )}
            {currentStep === 3 && <OrganizationalStructure onNext={handleDivisionNext} />}
            {currentStep === 4 && <TeamMembers finishOnboarding={finishOnboarding} />}
        </div>
    )
}
