import AttendanceListPage from "@/components/admin/attendance/employee-attendance";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { company: string } }) {
  const formattedTitle = formatSlugToTitle(params.company);
  return {
    title: `Employee's Attendance - ${formattedTitle}`,
    description: `Employee's Attendance for ${formattedTitle}`,
  };
}

export default function Page() {
  return <AttendanceListPage />;
}