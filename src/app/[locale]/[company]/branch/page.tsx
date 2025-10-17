// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import BranchPage from "@/components/admin/branch/branch-page"

function formatSlugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata({ params }) {
  const formattedTitle = formatSlugToTitle(params.company)
  return {
    title: `Branch - ${formattedTitle}`,
    description: `Branch for ${formattedTitle}`,
  }
}

export default function Page() {
  return <BranchPage />
}
