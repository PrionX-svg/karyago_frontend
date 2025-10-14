import AttendanceListPage from "@/components/admin/attendance/employee-attendance";
import RequestedEditAttendancePage from "@/components/admin/attendance/employee-request-edit";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { company: string } }) {
  const formattedTitle = formatSlugToTitle(params.company);
  return {
    title: `Employee's Edit Request Attendance - ${formattedTitle}`,
    description: `Employee's Edit Request Attendance ${formattedTitle}`,
  };
}

export default function Page() {
  return <RequestedEditAttendancePage/>;
}