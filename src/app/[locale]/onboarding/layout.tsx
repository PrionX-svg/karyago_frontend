import { ReactNode } from "react"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col">
            <main>{children}</main>
        </div>
    )
}

