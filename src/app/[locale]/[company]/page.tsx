import AdminDashboardPage from "@/components/dashboard-admin/page";
import EmployeeDashboardPage from "@/components/dashboard-employee/page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface DashboardProps {
  params: {
    locale: string;
    company: string;
  };
}

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: DashboardProps) {
  const formattedTitle = formatSlugToTitle(params.company ?? "");
  return {
    title: `Dashboard - ${formattedTitle}`,
    description: `Dashboard ${formattedTitle}`,
  };
}

export default async function Page({ params }: DashboardProps) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value?.toLowerCase() ?? "";
  const locale = params.locale;
  const company = cookieStore.get("company")?.value ?? params.company ?? "default-company";

  const sharedParams = {
    params: {
      locale,
      company,
    },
  };

  // --- Redirect hanya kalau belum login ---
  if (!role) {
    redirect(`/${locale}/auth`);
  }

  // --- Render dashboard sesuai role ---
  if (["admin", "owner", "assistant"].includes(role)) {
    return <AdminDashboardPage {...sharedParams} />;
  }

  if (role === "employee") {
    return <EmployeeDashboardPage />;
  }

  // --- Fallback kalau role tidak valid ---
  redirect(`/${locale}/auth`);
}
