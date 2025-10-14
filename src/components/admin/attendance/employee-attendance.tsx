"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"

export default function EmployeeAttendancePage() {
  const { currentCompany } = useCompanyStore()
  const [attendanceList, setAttendanceList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [timeFilter, setTimeFilter] = useState<"this-week" | "this-month">("this-month")
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!currentCompany?.uuid) return
      try {
        const now = new Date()
        const from = new Date(
          now.getFullYear(),
          now.getMonth(),
          timeFilter === "this-week" ? now.getDate() - 7 : 1
        )
        const to = new Date()
        const res = await employeeAPI.listAllAttendance(from, to, currentCompany.uuid)
        setAttendanceList(res.data || [])
      } catch (err) {
        console.error("❌ Failed to fetch attendance:", err)
      }
    }
    fetchAttendance()
  }, [currentCompany?.uuid, timeFilter])

  const filtered = attendanceList.filter((a) => {
    if (!searchTerm) return true
    const t = searchTerm.toLowerCase()
    return (
      a.user_name?.toLowerCase().includes(t) ||
      a.work_date?.toLowerCase().includes(t) ||
      a.notes?.toLowerCase().includes(t)
    )
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <main className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-orange-500" /> Employee Attendance
        </h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search employee or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
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

          {paginated.map((a) => (
            <div
              key={a.uuid}
              className={`grid md:grid-cols-8 gap-3 py-3 border-b last:border-0 items-center text-sm ${a.is_overtime ? "bg-orange-50" : "bg-white"
                }`}
            >
              <span className="font-medium">{a.employee_name || "-"}</span>
              <span>{a.work_date}</span>
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
