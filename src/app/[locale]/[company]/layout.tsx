import { ReactNode } from "react";

export const metadata = {
    title: "Company Dashboard",
    description: "Manage your company data",
};

export default function CompanyLayout({children}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main content */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}
