import DashboardPage from "@/components/dashboard/dashboard-page";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { company: string } }) {
  const formattedTitle = formatSlugToTitle(params.company);
  return {
    title: `Dashboard - ${formattedTitle}`,
    description: `Dashboard for ${formattedTitle}`,
  };
}

export default function Page() {
  return <DashboardPage />;
}
