import SubDivisionsRoundedTable from "@/components/admin/company-structure/sub-division/sub-division-page";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { company: string } }) {
  const formattedTitle = formatSlugToTitle(params.company);
  return {
    title: `Department Group - ${formattedTitle}`,
    description: `Department Group for ${formattedTitle}`,
  };
}

export default function Page() {
  return <SubDivisionsRoundedTable />;
}
