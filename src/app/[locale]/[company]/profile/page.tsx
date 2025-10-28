// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import ProfilePage from "@/components/admin/profile/profile-page";

function formatSlugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params; // ← harus di-await sekarang
  const formattedTitle = formatSlugToTitle(company);

  return {
    title: `Profile - ${formattedTitle}`,
    description: `Profile for ${formattedTitle}`,
  };
}

export default function Page() {
  return <ProfilePage />;
}
