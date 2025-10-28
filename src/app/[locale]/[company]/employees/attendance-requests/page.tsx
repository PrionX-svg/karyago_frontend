// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import EmployeeEditRequestsPage from "@/components/admin/attendance/employee-request-edit"

function formatSlugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const formattedTitle = formatSlugToTitle(company);

  return {
    title: `Employee's Edit Request Attendance - ${formattedTitle}`,
    description: `Employee's Edit Request Attendance for ${formattedTitle}`,
  };
}

export default function Page() {
  return <EmployeeEditRequestsPage />
}

