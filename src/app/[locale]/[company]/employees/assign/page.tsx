// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import AssignEmployeePage from "@/components/admin/employee-assign/assign-employees-page"

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
    title: `Assign Employee - ${formattedTitle}`,
    description: `Assign Employee for ${formattedTitle}`,
  };
}

export default function Page() {
  return <AssignEmployeePage />
}
