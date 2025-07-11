"use client"

import { useState } from "react"
import { CompanyInformation } from "@/components/onboarding/steps/company-information"
import { BranchLocations } from "@/components/onboarding/steps/branch-information"
import { OrganizationalStructure } from "@/components/onboarding/steps/organizational-structure"
import { TeamMembers } from "@/components/onboarding/steps/team-members"
import type { CompanyPayload } from "@/lib/interfaces/onboarding-interface"
import { WelcomeScreen } from "@/components/onboarding/steps/welcome-screen"

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [companyUuid, setCompanyUuid] = useState<string>("")
    const [showWelcome, setShowWelcome] = useState(true)

    const handleCompanyNext = (data: CompanyPayload, uuid: string) => {
        setCompanyUuid(uuid)
        setCurrentStep(2)
    }

    const handleBranchNext = () => {
        setCurrentStep(3)
    }

    const handleDivisionNext = () => {
        setCurrentStep(4)
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleStartOnboarding = () => {
        setShowWelcome(false)
    }

    if (showWelcome) {
        return <WelcomeScreen onStart={handleStartOnboarding} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-amber-25">

            {currentStep === 1 && <CompanyInformation onNext={handleCompanyNext} />}
            {currentStep === 2 && (
                <BranchLocations onNext={handleBranchNext} onPrevious={handlePrevious} companyUuid={companyUuid} />
            )}
            {currentStep === 3 && <OrganizationalStructure onNext={handleDivisionNext} onPrevious={handlePrevious} />}
            {currentStep === 4 && <TeamMembers onPrevious={handlePrevious} />}
        </div>
    )
}
