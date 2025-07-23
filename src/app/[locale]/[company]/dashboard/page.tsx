"use client";

import { useState } from "react";
import { CEODashboard } from "@/components/dashboard/admin/ceo-dashboard";
import { EmployeeDashboard } from "@/components/dashboard/employee/employee-dashboard";

// Mock user data - in real app this would come from authentication context
const mockUser = {
  id: "1",
  name: "Trisha Kyrlova",
  role: "ceo", // or "employee"
  title: "Chief Executive Officer",
  avatar: "/placeholder.svg?height=40&width=40&text=TK",
  email: "trisha@company.com",
};

export default function DashboardPage() {
  const [user] = useState(mockUser);

  return (
    <>
      {user.role === "ceo" ? (
        <CEODashboard user={user} />
      ) : (
        <EmployeeDashboard user={user} />
      )}
    </>
  );
}
