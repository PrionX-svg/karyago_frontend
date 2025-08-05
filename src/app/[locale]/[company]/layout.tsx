import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string; company: string };
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col flex-1">
        <Header />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 overflow-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
