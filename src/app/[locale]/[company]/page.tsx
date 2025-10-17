// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import AdminDashboardPage from "@/components/dashboard-admin/page"
import EmployeeDashboardPage from "@/components/dashboard-employee/page"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

function formatSlugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata({ params }) {
  const formattedTitle = formatSlugToTitle(params?.company ?? "Company")
  return {
    title: `Dashboard - ${formattedTitle}`,
    description: `Dashboard for ${formattedTitle}`,
  }
}

export default async function Page({ params }) {
  const cookieStore = await cookies()
  const role = cookieStore.get("role")?.value?.toLowerCase() ?? ""
  const locale = params?.locale
  const company = cookieStore.get("company")?.value ?? params?.company ?? "default-company"

  const sharedParams = {
    params: {
      locale,
      company,
    },
  }

  // 🔐 Redirect kalau belum login
  if (!role) {
    redirect(`/${locale}/auth`)
  }

  // 🧭 Role-based rendering
  if (["admin", "owner", "assistant"].includes(role)) {
    return <AdminDashboardPage {...sharedParams} />
  }

  if (role === "employee") {
    return <EmployeeDashboardPage />
  }

  // 🚫 Role invalid → redirect ke login
  redirect(`/${locale}/auth`)
}
