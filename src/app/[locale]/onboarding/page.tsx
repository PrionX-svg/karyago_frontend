"use client"

import { useState } from "react"
import { CompanyInformation } from "@/components/onboarding/steps/company-information"
import { BranchLocations } from "@/components/onboarding/steps/branch-information"
import { OrganizationalStructure } from "@/components/onboarding/steps/organizational-structure"
import { TeamMembers } from "@/components/onboarding/steps/team-members"
import type { CompanyPayload, BranchPayload, DivisionPayload, SubDivisionPayload } from "@/lib/interfaces/onboarding-interface"
import { WelcomeScreen } from "@/components/onboarding/steps/welcome-screen"

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(2)
    const [companyData, setCompanyData] = useState<CompanyPayload | null>(null)
    const [companyUuid, setCompanyUuid] = useState<string>("")
    const [branchData, setBranchData] = useState<BranchPayload[]>([])
    const [divisionData, setDivisionData] = useState<DivisionPayload[]>([])
    const [subDivisionData, setSubDivisionData] = useState<SubDivisionPayload[]>([])
    const [showWelcome, setShowWelcome] = useState(true)

    const handleCompanyNext = (data: CompanyPayload, uuid: string) => {
        setCompanyData(data)
        setCompanyUuid(uuid)
        setCurrentStep(2)
    }

    const handleBranchNext = (branches: BranchPayload[]) => {
        setBranchData(branches)
        setCurrentStep(3)
    }

    const handleDivisionNext = (divisions: DivisionPayload[], subDivisions: SubDivisionPayload[]) => {
        setDivisionData(divisions)
        setSubDivisionData(subDivisions)
        setCurrentStep(4)
    }

    const handleComplete = () => {
        console.log("Onboarding completed!", {
            company: companyData,
            companyUuid,
            branches: branchData,
            divisions: divisionData,
            subDivisions: subDivisionData,
        })
        alert("Setup completed! Redirecting to dashboard...")
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

            {currentStep === 1 && <CompanyInformation onNext={handleCompanyNext} onPrevious={handlePrevious} />}
            {currentStep === 2 && (
                <BranchLocations onNext={handleBranchNext} onPrevious={handlePrevious} companyUuid={companyUuid} />
            )}
            {currentStep === 3 && <OrganizationalStructure onNext={handleDivisionNext} onPrevious={handlePrevious} />}
            {currentStep === 4 && <TeamMembers onComplete={handleComplete} onPrevious={handlePrevious} />}
        </div>
    )
}
