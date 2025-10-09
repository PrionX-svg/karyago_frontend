"use client"

import { useState, useEffect } from "react"
import { Search, Download, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { employeeAPI } from "@/lib/api/employee-api"
import { useCompanyStore } from "@/stores/company-store"
import { toast } from "sonner"

export default function EmployeeAttendancePage() {
  const { currentCompany } = useCompanyStore()
  const [records, setRecords] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [loading, setLoading] = useState(true)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!currentCompany?.uuid) return
      try {
        setLoading(true)
        const now = new Date()
        const from = new Date(now.getFullYear(), now.getMonth(), 1)
        const to = now
        const res = await employeeAPI.listRange(from, to, currentCompany.uuid)
        const data = Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data)
            ? res.data
            : []
        setRecords(data)
      } catch (err) {
        console.error("❌ Fetch attendance failed:", err)
        toast.error("Failed to load attendance data")
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [currentCompany?.uuid])

  const filteredData = records.filter((r) => {
    const search = searchQuery.toLowerCase()
    const matchesSearch =
      r.employee_name?.toLowerCase().includes(search) ||
      r.department_name?.toLowerCase().includes(search)
    const matchesStatus = statusFilter === "all" || r.status?.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const summary = {
    present: records.filter((r) => r.status === "PRESENT").length,
    open: records.filter((r) => r.status === "OPEN").length,
    absent: records.filter((r) => r.status === "ABSENT").length,
  }

  return (
    <div className="w-full h-full flex flex-col bg-background p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Employee Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and monitor attendance for all employees</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" /> Filter Date
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Present", value: summary.present, color: "text-green-600", bg: "bg-green-100" },
          { label: "Open", value: summary.open, color: "text-yellow-600", bg: "bg-yellow-100" },
          { label: "Absent", value: summary.absent, color: "text-red-600", bg: "bg-red-100" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 flex items-center justify-between bg-white">
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center`}>
              <Clock className={`w-5 h-5 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employee or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-400">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-400">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.employee_name}</TableCell>
                    <TableCell>{r.department_name}</TableCell>
                    <TableCell>{formatDate(r.work_date)}</TableCell>
                    <TableCell>{r.clock_in_at ? r.clock_in_at.slice(0, 5) : "-"}</TableCell>
                    <TableCell>{r.clock_out_at ? r.clock_out_at.slice(0, 5) : "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${r.is_home_office
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                          } border-0 rounded-full`}
                      >
                        {r.is_home_office ? "Home" : "Office"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${r.status === "PRESENT"
                            ? "bg-green-100 text-green-700"
                            : r.status === "OPEN"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          } border-0 rounded-full`}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{r.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
