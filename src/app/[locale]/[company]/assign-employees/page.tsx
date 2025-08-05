import AssignEmployeePage from "@/components/assign-employees/assign-employees-page";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { company: string } }) {
  const formattedTitle = formatSlugToTitle(params.company);
  return {
    title: `Assign Employee - ${formattedTitle}`,
    description: `Assign Employee for ${formattedTitle}`,
  };
}

export default function Page() {
  return <AssignEmployeePage />;
}
