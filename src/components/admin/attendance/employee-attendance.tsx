"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"
import { DatePicker } from "@/components/ui/date-picker"
import { CalendarClockIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export default function EmployeeAttendancePage() {
  const { currentCompany } = useCompanyStore()
  const [attendanceList, setAttendanceList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!currentCompany?.uuid) return
      try {
        const now = new Date()
        const defaultFrom = dateFrom || new Date(now.getFullYear(), now.getMonth(), 1)
        const defaultTo = dateTo || now
        const res = await employeeAPI.listAllAttendance(defaultFrom, defaultTo, currentCompany.uuid)
        setAttendanceList(res.data || [])
      } catch (err) {
        console.error("❌ Failed to fetch attendance:", err)
      }
    }
    fetchAttendance()
  }, [currentCompany?.uuid, dateFrom, dateTo])

  // Ambil nama unik untuk dropdown employee
  const employeeNames = useMemo(() => {
    // ambil nama unik, tapi hanya untuk record yang punya uuid valid
    const unique = new Set(
      attendanceList
        .filter((a) => a.uuid && a.uuid.trim() !== "") // 🔥 hide dummy employees
        .map((a) => a.employee_name)
        .filter(Boolean)
    )
    return ["all", ...Array.from(unique)]
  }, [attendanceList])

  const filtered = attendanceList.filter((a) => {
    if (!a.uuid || a.uuid.trim() === "") return false
    if (selectedEmployee !== "all" && a.employee_name !== selectedEmployee) return false
    if (selectedStatus !== "all" && a.status !== selectedStatus) return false
    if (searchTerm && !a.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (dateFrom && new Date(a.work_date) < dateFrom) return false
    if (dateTo && new Date(a.work_date) > dateTo) return false
    return true
  })

  // 🧭 Sort attendance by work_date (newest first)
  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.work_date ?? 0).getTime()
    const dateB = new Date(b.work_date ?? 0).getTime()
    return dateB - dateA // newest first
  })


  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <main className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950 rounded-xl border border-orange-200 dark:border-orange-800 group-hover:from-orange-100 group-hover:to-orange-200 dark:group-hover:from-orange-800 dark:group-hover:to-orange-900 transition-colors">
            <CalendarClockIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div> Employee Attendance
        </h1>
        <div className="flex flex-wrap gap-3 items-center">
          {/* 🔍 Search by name */}
          <Input
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />

          {/* 👤 Filter by employee */}
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              {employeeNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name === "all" ? "All Employees" : name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 🗓️ Date range */}
          <div className="flex gap-2 items-center">
            <DatePicker date={dateFrom} onDateChange={setDateFrom} placeholder="From" />
            <span>–</span>
            <DatePicker date={dateTo} onDateChange={setDateTo} placeholder="To" />
          </div>

          {/* 📊 Status */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PRESENT">Present</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-md border-0 rounded-3xl">
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden md:grid md:grid-cols-8 text-sm font-semibold text-gray-500 border-b pb-2 mb-2">
            <span>Name</span>
            <span>Date</span>
            <span>Clock In</span>
            <span>Clock Out</span>
            <span>Total Hours</span>
            <span>Overtime</span>
            <span>Status</span>
            <span>Notes</span>
          </div>

          {paginated.map((a, index) => (
            <div
              key={
                a.uuid && a.uuid.trim() !== ""
                  ? a.uuid
                  : `temp-${a.employee_name || "unknown"}-${a.work_date || "no-date"}-${index}`
              }
              className={`grid md:grid-cols-8 gap-3 py-3 border-b last:border-0 items-center text-sm ${a.is_overtime ? "bg-orange-50" : "bg-white"
                }`}
            >
              <span className="font-medium">{a.employee_name || "-"}</span>
              <span>{a.work_date
                ? format(new Date(a.work_date), "dd/MMM/yyyy", { locale: id })
                : "-"}</span>
              <span>{a.clock_in_at
                ? new Date(a.clock_in_at).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Jakarta",
                })
                : "-"}
              </span>
              <span>{a.clock_out_at
                ? new Date(a.clock_out_at).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Jakarta",
                })
                : "-"}
              </span>
              {/* Total Hours */}
              <span className="text-center text-gray-800 font-medium">
                {a.total_work_hours ? `${a.total_work_hours.toFixed(1)}h` : "-"}
              </span>

              {/* Overtime */}
              <span className="text-center">
                {a.is_overtime ? (
                  <Badge className="bg-orange-100 text-orange-700 border-0 rounded-full text-xs px-2 py-1">
                    {a.overtime_hours ? `${a.overtime_hours.toFixed(1)}h` : "OT"}
                  </Badge>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </span>
              <Badge
                className={`${a.status === "PRESENT"
                  ? "bg-green-100 text-green-700"
                  : a.status === "OPEN"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                  }`}
              >
                {a.status}
              </Badge>
              <span className="text-gray-500">{a.notes || "-"}</span>
            </div>
          ))}

          {paginated.length === 0 && <p className="text-center text-gray-400 py-6">No records found</p>}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 items-center gap-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">{page} / {totalPages}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
