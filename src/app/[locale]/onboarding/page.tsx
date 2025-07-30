"use client";

import { useEffect, useState } from "react";
import { CompanyInformation } from "@/components/onboarding/steps/company-information";
import { BranchLocations } from "@/components/onboarding/steps/branch-information";
import { OrganizationalStructure } from "@/components/onboarding/steps/organizational-structure";
import { TeamMembers } from "@/components/onboarding/steps/team-members";
import { WelcomeScreen } from "@/components/onboarding/steps/welcome-screen";
import user from "@/lib/queries/user-queries";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/stores/user-store";
import { api } from "@/lib/api/api";
import { useCompanyStore } from "@/stores/company-store";
import { encrypt } from "@/lib/encrypt";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(false);

  const companyData = useCompanyStore((state) => state.company);
  const companyUuid = companyData[0]?.uuid;

  const { isFetchingGetMe } = user.useGetMe();
  const router = useRouter();
  const userUuid = useUserStore((state) => state.user.uuid);
  const lo = useTranslations("onboarding");

  const handleCompanyNext = () => {
    setCurrentStep(2);
    localStorage.setItem("onboardingStep", String(2));
  };
  const handleBranchNext = () => {
    setCurrentStep(3);
    localStorage.setItem("onboardingStep", String(3));
  };
  const handleDivisionNext = () => {
    setCurrentStep(4);
    localStorage.setItem("onboardingStep", String(4));
  };

  const handleStartOnboarding = () => {
    const company = companyData[0];
    const isValidCompany =
      company &&
      typeof company.uuid === "string" &&
      company.uuid.trim() !== "" &&
      company.uuid !== "undefined";

    if (isValidCompany) {
      setCurrentStep(2);
      localStorage.setItem("onboardingStep", "2");
    } else {
      setCurrentStep(1);
      localStorage.setItem("onboardingStep", "1");
    }

    setShowWelcome(false);
  };

  const finishOnboarding = () => {
    localStorage.removeItem("onboardingStep");
    localStorage.removeItem("meta");
    router.push("/");
  };

  useEffect(() => {
    const initializeOnboarding = async () => {
      setLoading(true);
      let initialStep = 1;
      let shouldShowWelcome = true;

      if (userUuid) {
        try {
          await api.getCompanyByUserUuid(userUuid);
        } catch (error) {
          console.error("Failed to fetch company data:", error);
        }
      }

      const updatedCompanyData = useCompanyStore.getState().company;
      const hasCompany = updatedCompanyData[0];

      if (typeof window !== "undefined") {
        const savedStep = localStorage.getItem("onboardingStep");
        if (savedStep) {
          initialStep = parseInt(savedStep);
          console.log("Found onboarding step in localStorage:", initialStep);
        } else {
          console.log("No onboarding step found in localStorage.");
          initialStep = hasCompany ? 2 : 1;
        }
      }

      shouldShowWelcome = initialStep === 1;

      setCurrentStep(initialStep);
      setShowWelcome(shouldShowWelcome);

      if (hasCompany) {
        const currentCompanyUuid = updatedCompanyData[0]?.uuid;
        if (currentCompanyUuid) {
          const encryptedUuid = await encrypt(currentCompanyUuid);
          localStorage.setItem("meta", encryptedUuid);
        }
      }
      setLoading(false);
    };

    initializeOnboarding();
  }, [userUuid]);

  useEffect(() => {
    const fetchCompanyRelatedData = async () => {
      if (companyUuid) {
        try {
          await api.getDivisionsByCompanyUuid(companyUuid);
          await api.getSubDivisionsByCompanyUuid(companyUuid);
        } catch (error) {
          console.error("Failed to fetch company related data:", error);
        }
      }
    };
    fetchCompanyRelatedData();
  }, [companyUuid]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("onboardingStep", String(currentStep));
    }
  }, [currentStep]);

  if (isFetchingGetMe || loading) {
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
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreen onStart={handleStartOnboarding} loadingState={loading} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-amber-25">
      {currentStep === 1 && (
        <CompanyInformation
          onNext={handleCompanyNext}
          companyUuid={companyUuid}
        />
      )}
      {currentStep === 2 && <BranchLocations onNext={handleBranchNext} />}
      {currentStep === 3 && (
        <OrganizationalStructure onNext={handleDivisionNext} />
      )}
      {currentStep === 4 && <TeamMembers finishOnboarding={finishOnboarding} />}
    </div>
  );
}
