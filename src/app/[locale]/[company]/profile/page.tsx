import ProfilePage from "@/components/admin/profile/profile-page";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { company: string } }) {
  const formattedTitle = formatSlugToTitle(params.company);
  return {
    title: `Profile - ${formattedTitle}`,
    description: `Profile for ${formattedTitle}`,
  };
}

export default function Page() {
  return <ProfilePage />;
}
