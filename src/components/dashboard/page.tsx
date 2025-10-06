import AdminDashboardPage from "@/components/dashboard-admin/page";
import EmployeeDashboardPage from "@/components/dashboard-employee/page";
import { cookies } from "next/headers";

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
  const formattedTitle = formatSlugToTitle(params.company || "");
  return {
    title: `Dashboard - ${formattedTitle}`,
    description: `Dashboard ${formattedTitle}`,
  };
}

export default async function Page({ params }: DashboardProps) {
  const cookieStore = cookies();
  const role = (await cookieStore).get("role")?.value?.toLowerCase() ?? "";

  const sharedParams = {
    params: {
      locale: params.locale ?? "",
      company: params.company ?? "",
    },
  };

  if (role === "owner" || role === "admin") {
    return <AdminDashboardPage {...sharedParams} />;
  }

  return <EmployeeDashboardPage/>;
}