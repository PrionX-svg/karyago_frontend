// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import AttendanceListPage from "@/components/admin/attendance/employee-attendance";

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
    title: `Employee's Attendance - ${formattedTitle}`,
    description: `Employee's Attendance ${formattedTitle}`,
  };
}

export default function Page() {
  return <AttendanceListPage />;
}