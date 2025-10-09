"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"

export default function AdminDashboardPage({
  params,
}: {
  params: { locale: string; company: string }
}) {
  const { currentCompany } = useCompanyStore()

  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [editRequests, setEditRequests] = useState<any[]>([])
  const [attendanceRate, setAttendanceRate] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Helper: format tanggal ke YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split("T")[0]

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentCompany?.uuid) return
      try {
        setLoading(true)

        // 🏢 Fetch departments (gunakan plural sesuai route backend)
        const deptRes = await employeeAPI.getDepartments(currentCompany.uuid)
        const deptData = Array.isArray(deptRes.data?.items)
          ? deptRes.data.items
          : Array.isArray(deptRes.data)
          ? deptRes.data
          : []
        setDepartments(deptData)

        // 👥 Fetch attendance range (last 30 days)
        const now = new Date()
        const from = new Date(now)
        from.setDate(now.getDate() - 30)
        const empRes = await employeeAPI.listRange(from, now, currentCompany.uuid)
        const empData = Array.isArray(empRes.data?.items)
          ? empRes.data.items
          : Array.isArray(empRes.data)
          ? empRes.data
          : []
        setEmployees(empData)

        // ✏️ Fetch edit attendance requests
        const editRes = await employeeAPI.getAllEditRequests(currentCompany.uuid)
        const editData = Array.isArray(editRes.data?.items)
          ? editRes.data.items
          : Array.isArray(editRes.data)
          ? editRes.data
          : []
        setEditRequests(editData)

        // 📊 Hitung attendance rate
        const total = empData.length
        const present = empData.filter((a) => a.status === "PRESENT").length
        setAttendanceRate(total > 0 ? (present / total) * 100 : 0)
      } catch (err) {
        console.error("❌ Error loading dashboard:", err)
        toast.error("Failed to load admin dashboard data.")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [currentCompany?.uuid])

  /** 📈 Summary statistics */
  const summary = useMemo(() => {
    // Jumlah employee aktif (status PRESENT)
    const activeEmployees = employees.filter((a) => a.status === "PRESENT").length

    // Employee baru (join bulan ini)
    const newEmployees = employees.filter((a) => {
      const date = new Date(a.work_date)
      const now = new Date()
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    }).length

    // Kelompok department berdasarkan group_name
    const deptGroups = [
      ...new Set(departments.map((d: any) => d.group_name || "Ungrouped")),
    ]

    return { activeEmployees, newEmployees, deptGroups }
  }, [employees, departments])

  const recentRequests = editRequests.slice(0, 5)

  return (
    <div className="w-full max-w-full space-y-6">
      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-5xl font-bold text-foreground">
              {loading ? "-" : summary.activeEmployees}
            </div>
            <p className="text-sm text-muted-foreground">Active Employee</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-5xl font-bold text-foreground">
              {loading ? "-" : summary.newEmployees}
            </div>
            <p className="text-sm text-muted-foreground">New Employee</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-5xl font-bold text-foreground">
              {loading ? "-" : summary.deptGroups.length}
            </div>
            <p className="text-sm text-muted-foreground">Department Group</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-5xl font-bold text-foreground">
              {loading ? "-" : departments.length}
            </div>
            <p className="text-sm text-muted-foreground">Department</p>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 Employee Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {summary.deptGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No department group data available.
            </p>
          ) : (
            summary.deptGroups.map((group) => {
              const groupDepts = departments.filter((d) => d.group_name === group)
              const count = groupDepts.length
              const percent =
                departments.length > 0
                  ? Math.round((count / departments.length) * 100)
                  : 0
              return (
                <div key={group} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{group}</span>
                    <span className="font-medium">{percent}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-600 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* 🔹 Attendance Rate + Edit Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-6xl font-bold text-foreground">
                {loading ? "--" : `${attendanceRate.toFixed(0)}%`}
              </div>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Requested Edit Attendance</CardTitle>
            <Link
              href={`/${params.locale}/${params.company}/employees/attendance-requests`}
              className="text-sm text-primary hover:underline"
            >
              See more
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests.</p>
            ) : (
              recentRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between border-b pb-3 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {r.user_name?.substring(0, 2).toUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{r.user_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.edit_type?.replace("_", " ") || "-"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${
                      r.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : r.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
