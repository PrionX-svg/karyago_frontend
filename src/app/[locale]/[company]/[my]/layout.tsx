// src/app/[locale]/my/layout.tsx
import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ChatbotAI } from "@/components/chatbot-ai"
import { Toaster } from "sonner"
import { cookies } from "next/headers"

export default async function MyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const cookieStore = await cookies()
  const role = cookieStore.get("role")?.value?.toLowerCase() ?? "employee"

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex flex-1 w-full">
          <AppSidebar role="employee"></AppSidebar>
          <main className="flex-1 w-full overflow-auto p-6 bg-background min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
        <ChatbotAI />
        <Toaster />
      </div>
    </SidebarProvider>
  )
}
