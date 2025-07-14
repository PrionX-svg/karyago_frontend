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

export default function OnboardingPage() {
    const [showWelcome, setShowWelcome] = useState(true)
    const [currentStep, setCurrentStep] = useState(1)


    const router = useRouter()

    const { isFetchingGetMe } = user.useGetUMe()

    const handleCompanyNext = () => {
        setCurrentStep(2)
    }
    const handleBranchNext = () => {
        setCurrentStep(3)
    }
    const handleDivisionNext = () => {
        setCurrentStep(4)
    }

    const handleStartOnboarding = () => {
        setTimeout(() => {
            setShowWelcome(false)
        }, 750)
    }

    const finishOnboarding = () => {
        localStorage.removeItem("onboardingStep")
        router.push("/dashboard")
    }

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
        if (typeof window !== "undefined") {
            localStorage.setItem("onboardingStep", String(currentStep))
            if (currentStep > 1) {
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
                        Setting up your experience...
                    </h1>
                    <p className="text-center text-gray-500 max-w-md">
                        Please wait while we prepare your experience. This should only take a few seconds.
                    </p>
                </div>
            </div>
        )
    }
    if (showWelcome) {
        return <WelcomeScreen onStart={handleStartOnboarding} />
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-amber-25">
            {currentStep === 1 && <CompanyInformation onNext={handleCompanyNext} />}
            {currentStep === 2 && (
                <BranchLocations onNext={handleBranchNext} />
            )}
            {currentStep === 3 && <OrganizationalStructure onNext={handleDivisionNext} />}
            {currentStep === 4 && <TeamMembers finishOnboarding={finishOnboarding} />}
        </div>
    )
}
