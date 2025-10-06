import ManageEmployeePage from "@/components/admin/employee-manage/manage-employee";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { company: string } }) {
  const formattedTitle = formatSlugToTitle(params.company);
  return {
    title: `Employees - ${formattedTitle}`,
    description: `Employees for ${formattedTitle}`,
  };
}

export default function Page() {
  return <ManageEmployeePage />;
}
