"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api/api"
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
  Calendar,
  Clock,
  Target,
  Award,
  Heart,
  Smile,
  Edit,
  Briefcase,
  Home,
} from "lucide-react"

export default function EmployeeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  const { currentCompany } = useCompanyStore()
  const { fetchMyEditRequests, myEditRequests } = useAttendanceEditStore()

  const {
    attendanceToday,
    fetchAttendanceToday,
    clockIn,
    clockOut,
    toggleHomeOffice,
    saveNotes,
    isHomeOffice,
    notes,
    resetForNewDay,
  } = useEmployeeSelfStore()

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
        toast.error("Failed to load dashboard data")
      }
    }
    loadData()
  }, [currentCompany?.uuid])

  /** Auto-reset saat ganti hari */
  useEffect(() => {
    if (!currentCompany?.uuid) return
    let lastDate = new Date().toDateString()

    const interval = setInterval(async () => {
      const now = new Date().toDateString()
      if (now !== lastDate) {
        lastDate = now
        toast.info("A new attendance day has started 🌅")
        resetForNewDay()
        await fetchAttendanceToday(currentCompany.uuid)
      }
    }, 60000) // cek tiap 1 menit

    return () => clearInterval(interval)
  }, [currentCompany?.uuid])

  /** Format jam tampil */
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

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
                      <> • Clock In at {attendanceToday.clock_in_at}</>
                    )}
                    {attendanceToday.clock_out_at && (
                      <> • Clock Out at {attendanceToday.clock_out_at}</>
                    )}
                  </p>
                )}

                {/* Office/Home toggle */}
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
                      <span>Office</span>
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
                      <span>Home Office</span>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <Textarea
                    placeholder="Add notes for today..."
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
                    onClick={() => clockIn(currentCompany?.uuid)}
                    disabled={
                      attendanceToday?.status === "OPEN" ||
                      attendanceToday?.status === "PRESENT"
                    }
                    className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Clock In
                  </Button>
                  <Button
                    onClick={() => clockOut(currentCompany?.uuid)}
                    disabled={attendanceToday?.status !== "OPEN"}
                    className="bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Clock Out
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
              Attendance Rate
            </CardTitle>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <p className="text-sm text-blue-100 flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                This month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Hours */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 shadow-lg rounded-3xl">
          <CardContent className="p-6 text-white flex flex-col justify-between">
            <CardTitle className="text-white font-semibold text-lg flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Total Hours
            </CardTitle>
            <div>
              <div className="text-4xl font-bold mb-2">160h</div>
              <p className="text-sm text-purple-100 flex items-center">
                <Smile className="w-3 h-3 mr-1" />
                This month
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
                My Edit Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myEditRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">There's no edit request</p>
                ) : (
                  myEditRequests.map((req) => (
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
                            {req.edit_type.replace("_", " ").toUpperCase()}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">{req.work_date}</p>
                        </div>
                        <Badge
                          className={`rounded-full ${req.status === "PENDING"
                              ? "bg-yellow-500"
                              : req.status === "APPROVED"
                                ? "bg-green-500"
                                : "bg-red-500"
                            } text-white`}
                        >
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{req.reason || "-"}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
