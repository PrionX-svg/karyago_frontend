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
        sessionStorage.setItem("onboardingStep", String(2))
    }
    const handleBranchNext = () => {
        setCurrentStep(3)
        sessionStorage.setItem("onboardingStep", String(3))
    }
    const handleDivisionNext = () => {
        setCurrentStep(4)
        sessionStorage.setItem("onboardingStep", String(4))
    }

    const handleStartOnboarding = () => {
        setTimeout(() => {
            if (companyStoreData === null || companyStoreData === undefined) {
                setCurrentStep(1);
            } else {
                setCurrentStep(2);
            }
            setShowWelcome(false);
        }, 250);
    };

    const finishOnboarding = () => {
        sessionStorage.removeItem("onboardingStep")
        sessionStorage.removeItem("meta")
        router.push("/dashboard")
    }

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (userUuid) {
                setLoading(true);
                try {
                    await api.getCompanyByUserUuid(userUuid);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchCompanyData();
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
            const savedStep = sessionStorage.getItem("onboardingStep")
            if (savedStep) {
                setCurrentStep(parseInt(savedStep))
                setShowWelcome(parseInt(savedStep) === 1)
            }
        }
    }, [])

    useEffect(() => {
        const steps = sessionStorage.getItem("onboardingStep")
        if (steps && steps !== "4") {
            setShowWelcome(false)
        }
    }, [])

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = sessionStorage.getItem("onboardingStep")

            if (!stored) {
                sessionStorage.setItem("onboardingStep", String(currentStep))
            }

            if (currentStep > 1 && currentStep !== 4) {
                setShowWelcome(false)
            }
        }
    }, [currentStep])

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
