"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"
import { DatePicker } from "@/components/ui/date-picker"
import { CalendarClockIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useTranslations } from "next-intl"

interface AttendanceItem {
  uuid: string
  employee_name: string
  work_date: string
  clock_in_at?: string | null
  clock_out_at?: string | null
  total_work_hours?: number
  overtime_hours?: number
  is_overtime?: boolean
  notes?: string | null
  status?: "PRESENT" | "ABSENT" | "OPEN"
}

export default function EmployeeAttendancePage() {
  const { currentCompany } = useCompanyStore()
  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>([])
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
        const defaultFrom = dateFrom || new Date("2000-01-01")
        const defaultTo = dateTo || new Date("2100-01-01")
        const res = await employeeAPI.listAllAttendance(defaultFrom, defaultTo, currentCompany.uuid)
        setAttendanceList(res.data || [])
      } catch (err) {
        console.error("❌ Failed to fetch attendance:", err)
      }
    }
    fetchAttendance()
  }, [currentCompany?.uuid, dateFrom, dateTo])

  const employeeNames = useMemo(() => {
    const unique = new Set(
      attendanceList
        .filter((a) => a.uuid && a.uuid.trim() !== "")
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

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.work_date ?? 0).getTime()
    const dateB = new Date(b.work_date ?? 0).getTime()
    return dateB - dateA
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const t = useTranslations("attendance")

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950 rounded-xl border border-orange-200 dark:border-orange-800">
            <CalendarClockIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          {t("title-4")}
        </h1>
      </div>

      {/* Filter Toolbar */}
      <div className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm flex flex-wrap gap-3 justify-between items-start sm:items-center mb-6 overflow-hidden">
        <div className="flex flex-wrap gap-3 flex-1 min-w-0">
          <Input
            placeholder={t("searchPlaceholder-3")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-48 min-w-0"
          />

          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-full sm:w-44 min-w-0">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              {employeeNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name === "all" ? t("filterTitleEmployeeName") : name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-start sm:justify-end w-full sm:w-auto min-w-0">
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <DatePicker date={dateFrom} onDateChange={setDateFrom} placeholder={t("filterPlaceholderDateFrom")} />
            <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">–</span>
            <DatePicker date={dateTo} onDateChange={setDateTo} placeholder={t("filterPlaceholderDateTo")} />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-36 min-w-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filterPlaceholderStatusDefault")}</SelectItem>
              <SelectItem value="PRESENT">{t("filterPlaceholderStatusAttendance-1")}</SelectItem>
              <SelectItem value="ABSENT">{t("filterPlaceholderStatusAttendance-2")}</SelectItem>
              <SelectItem value="OPEN">{t("filterPlaceholderStatusAttendance-3")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-md border border-gray-200 dark:border-gray-800 rounded-3xl bg-white dark:bg-neutral-900">
        <CardContent>
          {/* Table View for Desktop */}
          <div className="hidden md:grid md:grid-cols-8 text-sm font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            <span>{t("tableHeaderName")}</span>
            <span>{t("tableHeaderDate")}</span>
            <span>{t("tableHeaderAttendanceClockIn")}</span>
            <span>{t("tableHeaderAttendanceClockOut")}</span>
            <span>{t("tableHeaderAttendanceTotalHours")}</span>
            <span>{t("tableHeaderAttendanceOvetime")}</span>
            <span>{t("tableHeaderAttendanceStatus")}</span>
            <span>{t("tableHeaderAttendanceNotes")}</span>
          </div>

          {/* Card View for Mobile */}
          <div className="md:hidden space-y-3">
            {paginated.map((a, index) => (
              <Card key={index} className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{a.employee_name}</h3>
                  <Badge
                    className={`text-xs ${a.status === "PRESENT"
                      ? "bg-green-100 text-green-700"
                      : a.status === "OPEN"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {a.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <p><strong>{t("tableHeaderDate")}:</strong> {a.work_date ? format(new Date(a.work_date), "dd/MMM/yyyy", { locale: id }) : "-"}</p>
                  <p>
                    <strong>{t("tableHeaderAttendanceClockIn")}:</strong>{" "}
                    {a.clock_in_at ? a.clock_in_at.slice(11, 16).replace(":", ".") : "-"}
                  </p>
                  <p>
                    <strong>{t("tableHeaderAttendanceClockOut")}:</strong>{" "}
                    {a.clock_out_at ? a.clock_out_at.slice(11, 16).replace(":", ".") : "-"}
                  </p>

                  <p><strong>{t("tableHeaderAttendanceTotalHours")}:</strong> {a.total_work_hours ? `${a.total_work_hours.toFixed(1)}h` : "-"}</p>
                  {a.is_overtime && (
                    <p><strong>{t("tableHeaderAttendanceOvetime")}:</strong> {a.overtime_hours ? `${a.overtime_hours.toFixed(1)}h` : "OT"}</p>
                  )}
                  <p><strong>{t("tableHeaderAttendanceNotes")}:</strong> {a.notes || "-"}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Rows */}
          <div className="hidden md:block">
            {paginated.map((a, index) => (
              <div
                key={index}
                className={`grid md:grid-cols-8 gap-3 py-3 border-b last:border-0 items-center text-sm ${a.is_overtime
                  ? "bg-orange-50 dark:bg-orange-950/30"
                  : "bg-white dark:bg-neutral-900"
                  } border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100`}

              >
                <span className="font-medium">{a.employee_name || "-"}</span>
                <span>{a.work_date ? format(new Date(a.work_date), "dd/MMM/yyyy", { locale: id }) : "-"}</span>
                <span> {a.clock_in_at ? a.clock_in_at.slice(11, 16).replace(":", ".") : "-"}</span>
                <span>{a.clock_out_at ? a.clock_out_at.slice(11, 16).replace(":", ".") : "-"}</span>
                <span className="text-center text-gray-800 dark:text-gray-100 **:font-medium">
                  {a.total_work_hours ? `${a.total_work_hours.toFixed(1)}h` : "-"}
                </span>
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
          </div>

          {/* Empty State */}
          {paginated.length === 0 && <p className="text-center text-gray-400 py-6">No records found</p>}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 items-center gap-4">
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
