import BranchPage from "@/components/admin/branch/branch-page";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { company: string } }) {
  const formattedTitle = formatSlugToTitle(params.company);
  return {
    title: `Branch - ${formattedTitle}`,
    description: `Branch for ${formattedTitle}`,
  };
}

export default function Page() {
  return <BranchPage />;
}
