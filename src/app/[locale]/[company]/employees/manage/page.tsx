// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import EmployeePage from "@/components/admin/employee-manage/employee"

function formatSlugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata({ params }) {
  const formattedTitle = formatSlugToTitle(params.company)
  return {
    title: `Employee - ${formattedTitle}`,
    description: `Employee for ${formattedTitle}`,
  }
}

export default function Page() {
  return <EmployeePage />
}

