import React from "react"
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import OnboardingPage from "@/app/[locale]/onboarding/page"

interface UserStoreState { user: { uuid: string } }

const mockPush = jest.fn();

// Mock translation
jest.mock("next-intl", () => ({
    useTranslations: (ns: string) => (key: string, vals?: Record<string, any>) =>
        vals ? `${ns}.${key} (${JSON.stringify(vals)})` : `${ns}.${key}`,
}));

// Mock naviation
jest.mock("next/navigation", () => ({
    __esModule: true,
    useRouter: () => ({ push: mockPush }),
    useSearchParams: () => ({}),
    usePathname: jest.fn(),

}));

// Mock user query
jest.mock("@/lib/queries/user-queries", () => ({
    __esModule: true,
    default: {
        useGetMe: jest.fn(),
    },
}))
const user = require("@/lib/queries/user-queries").default

// Mock zustand store (Company and User)
jest.mock("@/stores/company-store", () => ({
    useCompanyStore: Object.assign(
        // 1) The mock hook fn:
        jest.fn((selector: any) => selector({ company: [] })),
        // 2) An attached getState method:
        { getState: jest.fn(() => ({ company: [] })) }
    ),
}))
const { useCompanyStore } = require("@/stores/company-store")


jest.mock("@/stores/user-store", () => ({
    useUserStore: jest.fn(),
}))
const { useUserStore } = require("@/stores/user-store")

// Mock API
jest.mock("@/lib/api/api", () => ({
    api: {
        getCompanyByUserUuid: jest.fn(),
        getDivisionsByCompanyUuid: jest.fn(),
        getSubDivisionsByCompanyUuid: jest.fn(),
    },
}))
const { api } = require("@/lib/api/api")

// Mock Encryption
jest.mock("@/lib/encrypt", () => ({
    encrypt: jest.fn(),
}))

// Mock Encryption for the White Box Test
jest.mock("@/lib/encrypt", () => ({ encrypt: jest.fn().mockResolvedValue("encrypted-uuid") }))
const { encrypt } = require("@/lib/encrypt")

// Mock On Boarding Step
jest.mock("@/components/onboarding/steps/welcome-screen", () => ({
    WelcomeScreen: ({ onStart }: any) => (
        <div data-testid="welcome-screen">
            <button onClick={onStart}>Start</button>
        </div>
    ),
}))

jest.mock("@/components/onboarding/steps/company-information", () => ({
    CompanyInformation: ({ onNext }: any) => (
        <div data-testid="company-information-screen">
            <button onClick={onNext}>Next Step</button>
        </div>
    ),
}))

jest.mock("@/components/onboarding/steps/branch-information", () => ({
    BranchLocations: ({ onNext }: any) => (
        <div data-testid="branch-screen">
            <button onClick={onNext}>Next Step</button>
        </div>
    ),

    //   skipStep
}))

jest.mock("@/components/onboarding/steps/organizational-structure", () => ({
    OrganizationalStructure: ({ onNext }: any) => (
        <div data-testid="organizational-structure">
            <button onClick={onNext}>Next Step</button>
        </div>

        // skipStep
    ),
}))

jest.mock("@/components/onboarding/steps/team-members", () => ({
    TeamMembers: ({ finishOnboarding }: any) => (
        <div data-testid="team-members">
            <button onClick={finishOnboarding}>Complete Onboarding</button>
        </div>
    ),
}))

describe("On Boarding Test Black Box", () => {
    // Runs before every single test to give  a clean slate
    beforeEach(() => {
        jest.clearAllMocks()
        // default mocks
        user.useGetMe.mockReturnValue({ isFetchingGetMe: false })
        useUserStore.mockImplementation((selector: (state: UserStoreState) => any) =>
            selector({ user: { uuid: "user-uuid" } })
        )
        useCompanyStore.mockImplementation((selector: any) =>
            selector({ company: [{ uuid: "company-uuid" }] })
        )
        useCompanyStore.getState.mockReturnValue({ company: [{ uuid: "company-uuid" }] })
        api.getCompanyByUserUuid.mockResolvedValue({})
        api.getDivisionsByCompanyUuid.mockResolvedValue({})
        api.getSubDivisionsByCompanyUuid.mockResolvedValue({})

        localStorage.clear()
    })

    it("shows loader when `isFetchingGetMe` is true", () => {
        user.useGetMe.mockReturnValue({ isFetchingGetMe: true })
        render(<OnboardingPage />)
        expect(screen.getByRole("heading", { name: /onboarding.loadingTitle/i })).toBeInTheDocument()
    })

    it("renders WelcomeScreen by default when no saved step & no company", async () => {
        useCompanyStore.mockImplementation((selector: any) =>
            selector({ company: [] })
        )
        useCompanyStore.getState.mockReturnValue({ company: [] })

        render(<OnboardingPage />)
        expect(
            await screen.findByTestId("welcome-screen")
        ).toBeInTheDocument()

    })

    it("next step into branclocation when company uuid is valid", async () => {
        render(<OnboardingPage />)
        fireEvent.click(await screen.findByText("Start"))
        await waitFor(() => screen.getByTestId("branch-screen"))
        expect(localStorage.getItem("onboardingStep")).toBe("2")
    })

    it("stays on CompanyInformation if company uuid is invalid", async () => {
        useCompanyStore.mockImplementation((selector: any) =>
            selector({ company: [] })
        )
        useCompanyStore.getState.mockReturnValue({ company: [] })
        render(<OnboardingPage />)
        fireEvent.click(await screen.findByText("Start"))
        expect(await screen.findByTestId("company-information-screen")).toBeInTheDocument()
        expect(localStorage.getItem("onboardingStep")).toBe("1")
    })

    it("walks through all steps and finishes onboarding", async () => {
        render(<OnboardingPage />)

        // Welcome → Branch
        fireEvent.click(await screen.findByText("Start"))
        await waitFor(() => screen.getByTestId("branch-screen"))

        // Branch → Division
        fireEvent.click(screen.getByText("Next Step"))
        await waitFor(() => screen.getByTestId("organizational-structure"))
        expect(localStorage.getItem("onboardingStep")).toBe("3")

        // Division → Team
        fireEvent.click(screen.getByText("Next Step"))
        await waitFor(() => screen.getByTestId("team-members"))
        expect(localStorage.getItem("onboardingStep")).toBe("4")

        // Finish → redirect & clear
        const teamSection = await screen.findByTestId("team-members")
        // import { within } from "@testing-library/react" di atas file
        const finishBtn = within(teamSection).getByText("Complete Onboarding")
        fireEvent.click(finishBtn)

        expect(mockPush).toHaveBeenCalledWith("/dashboard")
        expect(localStorage.getItem("onboardingStep")).toBeNull()
    })

    it("persists step in localStorage when clicking next handlers", async () => {
        render(<OnboardingPage />)
        fireEvent.click(await screen.findByText("Start"))
        fireEvent.click(await screen.findByText("Next Step"))
        expect(localStorage.getItem("onboardingStep")).toBe("3")
    })
})

describe("On Boarding Test White Box", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        user.useGetMe.mockReturnValue({ isFetchingGetMe: false })
        useUserStore.mockImplementation((sel: any) =>
            sel({ user: { uuid: "user-uuid" } })
        )
        // Company exists by default:
        useCompanyStore.mockImplementation((sel: any) =>
            sel({ company: [{ uuid: "company-uuid" }] })
        )
        useCompanyStore.getState.mockReturnValue({ company: [{ uuid: "company-uuid" }] })
        api.getCompanyByUserUuid.mockResolvedValue({})
        api.getDivisionsByCompanyUuid.mockResolvedValue({})
        api.getSubDivisionsByCompanyUuid.mockResolvedValue({})
        encrypt.mockResolvedValue("encrypted-uuid")
        localStorage.clear()
    })

    it("calls encrypt & sets `meta` on init when company exists", async () => {
        await act(async () => {
            render(<OnboardingPage />)
        })
        await waitFor(() => {
            expect(encrypt).toHaveBeenCalledWith("company-uuid")
            expect(localStorage.getItem("meta")).toBe("encrypted-uuid")
        })
    })

    it("gracefully handles API failure in initializeOnboarding", async () => {
        api.getCompanyByUserUuid.mockRejectedValue(new Error("fail"))
        await act(async () => {
            render(<OnboardingPage />)
        })
        // should still show the first real step (branch) rather than crash
        expect(await screen.findByTestId("welcome-screen")).toBeInTheDocument()
    })

    it("fetches divisions & subdivisions when companyUuid changes", async () => {
        await act(async () => {
            render(<OnboardingPage />)
        })
        await waitFor(() => {
            expect(api.getDivisionsByCompanyUuid).toHaveBeenCalledWith("company-uuid")
            expect(api.getSubDivisionsByCompanyUuid).toHaveBeenCalledWith("company-uuid")
        })
    })

    it("reads saved onboardingStep from localStorage on mount", async () => {
        localStorage.setItem("onboardingStep", "3")
        await act(async () => {
            render(<OnboardingPage />)
        })
        expect(
            await screen.findByTestId("welcome-screen")
        ).toBeInTheDocument()
    })
})
