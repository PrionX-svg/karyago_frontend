// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import SubDivisionsRoundedTable from "@/components/admin/company-structure/sub-division/sub-division-page";

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
    title: `Department - ${formattedTitle}`,
    description: `Department for ${formattedTitle}`,
  };
}

export default function Page() {
  return <SubDivisionsRoundedTable />;
}
