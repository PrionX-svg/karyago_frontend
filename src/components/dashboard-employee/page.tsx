"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useCompanyStore } from "@/stores/company-store"
import { useAttendanceEditStore } from "@/stores/attendance-edit-store"
import { useEmployeeSelfStore } from "@/stores/employee-self-store"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  Target,
  Award,
  Heart,
  Smile,
  Edit,
  Briefcase,
  Home,
} from "lucide-react"
import { useTranslations } from "next-intl"

interface AttendanceRecord {
  work_date: string
  status: string
  total_work_hours?: number
}

export default function EmployeeDashboard() {
  const tdashboardEmployee = useTranslations("dashboardEmployee");
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  const { currentCompany } = useCompanyStore()
  const { fetchMyEditRequests, myEditRequests } = useAttendanceEditStore()

  const {
    attendanceToday,
    fetchAttendanceToday,
    fetchAttendanceRange,
    clockIn,
    clockOut,
    toggleHomeOffice,
    saveNotes,
    isHomeOffice,
    notes,
    resetForNewDay,
  } = useEmployeeSelfStore()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 3

  /** Realtime clock display */
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  /** Load attendance data once */
  useEffect(() => {
    const loadData = async () => {
      try {
        if (currentCompany?.uuid) {
          await fetchAttendanceToday(currentCompany.uuid)
          await fetchMyEditRequests(currentCompany.uuid)
        }
      } catch (error) {
        console.error(error)
        toast.error(tdashboardEmployee("loadError"))
      }
    }
    loadData()
  }, [currentCompany?.uuid, fetchAttendanceToday, fetchMyEditRequests, tdashboardEmployee])

  /** Auto-reset saat ganti hari */
  useEffect(() => {
    if (!currentCompany?.uuid) return
    let lastDate = new Date().toDateString()

    const interval = setInterval(async () => {
      const now = new Date().toDateString()
      if (now !== lastDate) {
        lastDate = now
        toast.info(tdashboardEmployee("newDay"))
        resetForNewDay()
        await fetchAttendanceToday(currentCompany.uuid)
      }
    }, 60000) // cek tiap 1 menit

    return () => clearInterval(interval)
  }, [currentCompany?.uuid, fetchAttendanceToday, resetForNewDay, tdashboardEmployee])

  /** Format jam tampil */
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

  const [attendanceRate, setAttendanceRate] = useState<number | null>(null)
  const [totalHours, setTotalHours] = useState<number | null>(null)

  /** Pagination logic */
  const totalPages = Math.ceil(myEditRequests.length / ITEMS_PER_PAGE)
  const paginatedRequests = myEditRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Attendance Rate
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (!currentCompany?.uuid) return

      try {
        // Ambil range tanggal bulan ini
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const res = (await fetchAttendanceRange(startOfMonth, endOfMonth, currentCompany.uuid)) as unknown as { data?: AttendanceRecord[] }
        const attendances = res.data ?? []


        if (attendances.length === 0) {
          setAttendanceRate(0)
          setTotalHours(0)
          return
        }

        // Filter hanya hari kerja (exclude weekend)
        const workingDays = attendances.filter((a) => {
          const day = new Date(a.work_date).getDay()
          return day !== 0 && day !== 6 // 0 = Minggu, 6 = Sabtu
        })

        // Hitung jumlah hadir (status = PRESENT)
        const presentDays = workingDays.filter((a) => a.status === "PRESENT").length

        // Total hari kerja
        const totalDays = workingDays.length

        // Hitung attendance rate
        const rate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

        // 🎯 Total jam kerja langsung dari backend
        const totalHoursCalc = workingDays.reduce(
          (acc: number, a) => acc + (a.total_work_hours ?? 0),
          0
        )

        setAttendanceRate(rate)
        setTotalHours(totalHoursCalc)
      } catch (err) {
        console.error("❌ Failed to calculate monthly stats:", err)
      }
    }

    fetchMonthlyStats()
  }, [currentCompany?.uuid, fetchAttendanceRange])



  const formatEditType = (type: string) => {
    switch (type) {
      case "CLOCK_IN":
        return "Clock In"
      case "CLOCK_OUT":
        return "Clock Out"
      case "BOTH":
        return "Clock In & Out"
      case "HOME_FLAG":
        return tdashboardEmployee("editTypeHome")
      case "BOTH_PLUS_FLAG":
        return tdashboardEmployee("allRequestEditType")
      case "BOTH PLUS FLAG":
        return tdashboardEmployee("allRequestEditType")
      default:
        return type || "-"
    }
  }

  return (
    <main className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">

        {/* ⏰ Clock & Attendance Card */}
        <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
          <Card className="bg-white/95 backdrop-blur-xl border-gray-200 shadow-lg rounded-3xl h-full hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 md:p-8 h-full flex flex-col justify-between">
              <div className="text-center flex-1 flex flex-col justify-center">
                {/* Clock display */}
                <div className="text-5xl md:text-6xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {mounted ? formatTime(currentTime) : "--:--:--"}
                </div>
                <p className="text-gray-600 mb-4 font-medium text-sm md:text-base">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* Attendance Status */}
                {attendanceToday && (
                  <p className="text-sm text-gray-700 font-medium mb-4">
                    Status:{" "}
                    <span
                      className={`font-semibold ${attendanceToday.status === "OPEN"
                        ? "text-orange-600"
                        : attendanceToday.status === "PRESENT"
                          ? "text-green-600"
                          : "text-gray-500"
                        }`}
                    >
                      {attendanceToday.status}
                    </span>
                    {attendanceToday.clock_in_at && (
                      <>
                        {" "}• {tdashboardEmployee("clockCard.clockInAt")}{" "}
                        {new Date(attendanceToday.clock_in_at)
                          .toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .replace(":", ".")}
                      </>
                    )}
                    {attendanceToday.clock_out_at && (
                      <>
                        {" "}• {tdashboardEmployee("clockCard.clockOutAt")}{" "}
                        {new Date(attendanceToday.clock_out_at)
                          .toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .replace(":", ".")}
                      </>
                    )}
                  </p>
                )}

                {/* Work Type */}
                <div className="mb-6 flex justify-center">
                  <div className="inline-flex bg-gray-100 rounded-2xl p-1">
                    <button
                      onClick={() => toggleHomeOffice(false, currentCompany?.uuid)}
                      disabled={attendanceToday?.status === "PRESENT"}
                      className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${!isHomeOffice
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                        } ${attendanceToday?.status === "PRESENT"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>{tdashboardEmployee("clockCard.buttonOffice")}</span>
                    </button>
                    <button
                      onClick={() => toggleHomeOffice(true, currentCompany?.uuid)}
                      disabled={attendanceToday?.status === "PRESENT"}
                      className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${isHomeOffice
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                        } ${attendanceToday?.status === "PRESENT"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>{tdashboardEmployee("clockCard.buttonHomeOffice")}</span>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <Textarea
                    placeholder={tdashboardEmployee("clockCard.notesPlaceholder")}
                    value={notes}
                    onChange={(e) => saveNotes(e.target.value, currentCompany?.uuid)}
                    disabled={attendanceToday?.status === "PRESENT"}
                    className="w-full bg-gray-50 border-gray-200 rounded-2xl resize-none text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                    rows={2}
                  />
                </div>

                {/* Clock In / Out Buttons */}
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={() => clockIn(new Date(), currentCompany?.uuid)}
                    disabled={
                      attendanceToday?.status === "OPEN" ||
                      attendanceToday?.status === "PRESENT"
                    }
                    className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {tdashboardEmployee("clockCard.buttonClockIn")}
                  </Button>
                  <Button
                    onClick={() => clockOut(new Date(), currentCompany?.uuid)}
                    disabled={attendanceToday?.status !== "OPEN"}
                    className="bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {tdashboardEmployee("clockCard.buttonClockOut")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Rate */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 shadow-lg rounded-3xl">
          <CardContent className="p-6 text-white flex flex-col justify-between">
            <CardTitle className="text-white font-semibold text-lg flex items-center">
              <Target className="w-5 h-5 mr-2" />
              {tdashboardEmployee("attendanceRateCard.title")}
            </CardTitle>
            <div>
              <div className="text-5xl font-bold mb-2">
                {attendanceRate !== null ? `${attendanceRate.toFixed(0)}%` : "--"}
              </div>
              <p className="text-sm text-blue-100 flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                {tdashboardEmployee("attendanceRateCard.description")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Hours */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 shadow-lg rounded-3xl">
          <CardContent className="p-6 text-white flex flex-col justify-between">
            <CardTitle className="text-white font-semibold text-lg flex items-center">
              <Award className="w-5 h-5 mr-2" />
              {tdashboardEmployee("totalHoursCard.title")}
            </CardTitle>
            <div>
              <div className="text-4xl font-bold mb-2">
                {totalHours !== null ? `${totalHours.toFixed(0)}h` : "--"}
              </div>
              <p className="text-sm text-purple-100 flex items-center">
                <Smile className="w-3 h-3 mr-1" />
                {tdashboardEmployee("totalHoursCard.description")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* My Edit Requests */}
        <div className="md:col-span-2 lg:col-span-2">
          <Card className="bg-white/95 backdrop-blur-xl border-gray-200 shadow-lg rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 font-semibold text-xl flex items-center">
                <Edit className="w-6 h-6 mr-3 text-orange-500" />
                {tdashboardEmployee("editRequests.title")}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {myEditRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {tdashboardEmployee("editRequests.noRequests")}
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {paginatedRequests.map((req) => (
                      <div
                        key={req.id}
                        className={`group p-4 rounded-2xl border transition-all duration-300 ${req.status === "PENDING"
                          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100"
                          : req.status === "APPROVED"
                            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"
                            : "bg-gradient-to-br from-red-50 to-rose-50 border-red-100"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {formatEditType(req.edit_type.replace("_", " ").toUpperCase())}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {req.work_date}
                            </p>
                          </div>
                          <Badge
                            className={`rounded-full ${req.status === "PENDING"
                              ? "bg-yellow-500"
                              : req.status === "APPROVED"
                                ? "bg-green-500"
                                : "bg-red-500"
                              } text-white`}
                          >
                            {tdashboardEmployee(`editRequests.status${req.status.charAt(0)}${req.status.slice(1).toLowerCase()}`)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {req.reason || "-"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      >
                        {tdashboardEmployee("editRequests.pagePrev")}
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        {tdashboardEmployee("editRequests.pageNext")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
