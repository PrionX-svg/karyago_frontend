"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { api } from "@/lib/api/api"
import { employeeAPI } from "@/lib/api/employee-api"
import Link from "next/link"
import { useCompanyStore } from "@/stores/company-store"
import { useEmployeeStore } from "@/stores/employee-store"
import { Building2, Users, Target, Briefcase } from "lucide-react"

interface Division {
  uuid: string
  name: string
}

interface SubDivision {
  uuid: string
  name: string
  division_uuid?: string
}

interface EditRequest {
  id: string
  user_name?: string
  edit_type: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

interface AttendanceRecord {
  status: string
}


export default function AdminDashboardPage({ params }: { params: { locale: string; company: string } }) {
  const { currentCompany } = useCompanyStore()
  const { employees, terminatedEmployees } = useEmployeeStore()

  const [divisions, setDivisions] = useState<Division[]>([])
  const [subDivisions, setSubDivisions] = useState<SubDivision[]>([])
  const [editRequests, setEditRequests] = useState<EditRequest[]>([])

  const [attendanceRate, setAttendanceRate] = useState<number | null>(null)

  // 🔹 Fetch all core data
  useEffect(() => {
    const load = async () => {
      if (!currentCompany?.uuid) return
      try {
        await api.getEmployeeByCompanyUuid(currentCompany.uuid)
        await api.getDivisionsByCompanyUuid(currentCompany.uuid)
        await api.getSubDivisionsByCompanyUuid(currentCompany.uuid)
        const edits = await employeeAPI.getAllEditRequests(currentCompany.uuid)
        setEditRequests(edits.data || [])
      } catch (err) {
        console.error("❌ Failed loading dashboard:", err)
      }
    }
    load()
  }, [currentCompany?.uuid])

  // 🔹 Ambil data divisions & sub-divisions langsung dari store
  useEffect(() => {
    const { division, subDivision } = useCompanyStore.getState()
    setDivisions(division || [])
    setSubDivisions(subDivision || [])
  }, [currentCompany?.uuid]) // cukup trigger ulang saat company berubah


  // 🔹 Hitung attendance rate (akurat)
  useEffect(() => {
    const calcRate = async () => {
      if (!currentCompany?.uuid) return
      try {
        const now = new Date()
        const from = new Date(now.getFullYear(), now.getMonth(), 1)
        const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const range = await employeeAPI.listAllAttendance(from, to, currentCompany.uuid)
        console.log("📊 Attendance range result:", range)
        const records = range.data || []

        // hanya karyawan aktif
        const activeCount = employees.filter((e) => !e.termination?.date).length


        // total hari kerja (exclude sabtu & minggu)
        const totalWorkDays = Array.from({ length: to.getDate() }, (_, i) => {
          const d = new Date(from)
          d.setDate(d.getDate() + i)
          const day = d.getDay()
          return day !== 0 && day !== 6 // exclude Sun & Sat
        }).filter(Boolean).length

        // total hadir
        const totalPresent = records.filter((r: AttendanceRecord) => r.status === "PRESENT").length

        // rate
        const totalPossible = activeCount * totalWorkDays
        const rate = totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0

        setAttendanceRate(rate)
      } catch (err) {
        console.error("⚠️ Failed to calc attendance rate:", err)
      }
    }

    calcRate()
  }, [currentCompany?.uuid, employees])


  // 🔹 Stats
  const stats = useMemo(() => ({
    activeEmployees: employees.length,
    terminatedEmployees: terminatedEmployees.length,
    divisions: divisions.length,
    subDivisions: subDivisions.length,
  }), [employees, terminatedEmployees, divisions, subDivisions])

  const formatEditType = (type: string) => {
    switch (type) {
      case "CLOCK_IN":
        return "Clock In"
      case "CLOCK_OUT":
        return "Clock Out"
      case "BOTH":
        return "Clock In & Out"
      case "HOME_FLAG":
        return "Work Type"
      case "BOTH_PLUS_FLAG":
        return "All Request Type"
      case "BOTH PLUS FLAG":
        return "All Request Type"
      default:
        return type || "-"
    }
  }

  return (
    <div className="w-full max-w-full space-y-6">
      {/* 🔸 Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6 text-green-600" />} value={stats.activeEmployees} label="Active Employees" />
        <StatCard icon={<Briefcase className="w-6 h-6 text-orange-600" />} value={stats.terminatedEmployees} label="Terminated Employees" />
        <StatCard icon={<Building2 className="w-6 h-6 text-blue-600" />} value={stats.divisions} label="Division" />
        <StatCard icon={<Target className="w-6 h-6 text-purple-600" />} value={stats.subDivisions} label="Sub-Division" />
      </div>

      {/* 🔸 Employee Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subDivisions.length > 0 ? (
            subDivisions.map((sub) => {
              // hitung semua karyawan yang ada di sub-divisi ini
              const members = employees.filter((e) => e.subDivision?.uuid === sub.uuid).length

              const percent = employees.length > 0 ? ((members / employees.length) * 100).toFixed(0) : 0

              return (
                <div key={sub.uuid} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{sub.name}</span>
                    <span className="font-medium">
                      {members} ({percent}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground">No sub-division data found</p>
          )}


        </CardContent>
      </Card>

      {/* 🔸 Attendance & Edit Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-6xl font-bold text-foreground">{attendanceRate ? `${attendanceRate.toFixed(0)}%` : "--"}</div>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Requested Edit Attendance</CardTitle>
            <Link href={`/${params.locale}/${params.company}/employees/attendance-requests`} className="text-sm text-primary hover:underline">
              See more
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {editRequests.length > 0 ? (
              editRequests.slice(0, 5).map((req) => (
                <div key={req.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{req.user_name?.slice(0, 2).toUpperCase() || "UN"}</AvatarFallback></Avatar>
                    <div>
                      <p className="text-sm font-medium">{req.user_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{formatEditType(req.edit_type)}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md ${req.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                    req.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>{req.status}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent requests</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ✅ Simple reusable stat card */
function StatCard({ icon, value, label }: { icon: React.ReactNode, value: number | string, label: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">{icon}</div>
          <div className="text-4xl font-bold text-foreground">{value}</div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
