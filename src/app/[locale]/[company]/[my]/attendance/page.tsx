"use client"

import { useState, useEffect, useMemo } from "react"
import { useEmployeeSelfStore } from "@/stores/employee-self-store"
import { useAttendanceEditStore } from "@/stores/attendance-edit-store"
import { useCompanyStore } from "@/stores/company-store"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Edit, ChevronLeft, ChevronRight, X } from "lucide-react"
import { employeeAPI } from "@/lib/api/employee-api"
import { DatePicker } from "@/components/ui/date-picker"
import { toZonedTime, format } from "date-fns-tz"
import { id } from "date-fns/locale"
import { useTranslations } from "next-intl"


export default function AttendancePage() {
    const { currentCompany } = useCompanyStore()
    const { attendanceList, fetchAttendanceRange } = useEmployeeSelfStore()
    const { myEditRequests, fetchMyEditRequests } = useAttendanceEditStore()

    const [viewType, setViewType] = useState<"attendance" | "edit-request">("attendance")
    const [timeFilter] = useState<"this-week" | "this-month">("this-week")
    const [searchTerm, setSearchTerm] = useState("")
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const [statusFilter, setStatusFilter] = useState("all")

    const [currentPage, setCurrentPage] = useState(1)

    const ITEMS_PER_PAGE = 10

    /** Range filter waktu */
    const getDateRange = (filter: string) => {
        const now = new Date()
        const start = new Date()
        if (filter === "this-week") start.setDate(now.getDate() - 7)
        else start.setMonth(now.getMonth() - 1)
        return { from: start, to: now }
    }

    /** Fetch data attendance + edit requests */
    useEffect(() => {
        if (!currentCompany?.uuid) return
        const { from, to } = getDateRange(timeFilter)
        fetchAttendanceRange(from, to, currentCompany.uuid)
        fetchMyEditRequests(currentCompany.uuid)
    }, [currentCompany?.uuid, timeFilter, fetchAttendanceRange, fetchMyEditRequests])

    // useEffect(() => {
    //     console.log("🟢 attendanceList (from store):", attendanceList)
    // }, [attendanceList])


    const filteredAttendance = attendanceList.filter((a) => {
        const workDate = a.work_date ? new Date(a.work_date) : undefined

        // 🔍 Filter by search
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            const matchDate = a.work_date?.toLowerCase().includes(term)
            const matchNotes = a.notes?.toLowerCase().includes(term)
            if (!matchDate && !matchNotes) return false
        }

        // 🧾 Filter by status
        if (statusFilter !== "all" && a.status !== statusFilter) return false

        // 🗓️ Filter by date range
        if (dateFrom && workDate && workDate < dateFrom) return false
        if (dateTo && workDate && workDate > dateTo) return false

        return true
    })

    const filteredEditRequests = myEditRequests.filter((r) => {
        const workDate = r.work_date ? new Date(r.work_date) : undefined

        if (statusFilter !== "all" && r.status !== statusFilter) return false
        if (searchTerm && !r.reason?.toLowerCase().includes(searchTerm.toLowerCase())) return false
        if (dateFrom && workDate && workDate < dateFrom) return false
        if (dateTo && workDate && workDate > dateTo) return false

        return true
    })

    // 🧭 Sort attendance by work_date (newest first)
    const sortedAttendance = [...filteredAttendance].sort((a, b) => {
        const dateA = new Date(a.work_date ?? 0).getTime()
        const dateB = new Date(b.work_date ?? 0).getTime()
        return dateB - dateA // newest first
    })

    // 🧭 Sort edit requests by work_date (newest first)
    const sortedEditRequests = [...filteredEditRequests].sort((a, b) => {
        const dateA = new Date(a.work_date ?? 0).getTime()
        const dateB = new Date(b.work_date ?? 0).getTime()
        return dateB - dateA
    })


    /** Pagination */
    const totalPages = Math.ceil(sortedAttendance.length / ITEMS_PER_PAGE)
    const paginatedAttendance = sortedAttendance.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    /** 💡 Summary Stats (otomatis hitung dari attendanceList) */
    const summaryStats = useMemo(() => {
        const present = attendanceList.filter((a) => a.status === "PRESENT").length
        const absent = attendanceList.filter((a) => a.status === "ABSENT").length
        const open = attendanceList.filter((a) => a.status === "OPEN").length

        // Total jam kerja dari backend
        const totalHours = attendanceList.reduce(
            (acc, a) => acc + (a.total_work_hours ?? 0),
            0
        )

        // Hitung total lembur:
        // kalau overtime_hours ada → pakai backend,
        // kalau null tapi is_overtime true → hitung selisih jam > 8 jam
        const totalOvertime = attendanceList.reduce((acc, a) => {
            if (a.is_overtime) {
                if (a.overtime_hours) {
                    return acc + a.overtime_hours
                }
                // fallback manual: total_work_hours - 8 jam
                if (a.total_work_hours && a.total_work_hours > 8) {
                    return acc + (a.total_work_hours - 8)
                }
            }
            return acc
        }, 0)

        return {
            present,
            absent,
            open,
            totalHours: parseFloat(totalHours.toFixed(1)),
            totalOvertime: parseFloat(totalOvertime.toFixed(1)),
            totalDays: attendanceList.length,
        }
    }, [attendanceList])

    // State untuk modal edit request
    const [editType, setEditType] = useState<
        "CLOCK_IN" | "CLOCK_OUT" | "BOTH" | "HOME_FLAG" | "BOTH_PLUS_FLAG"
    >("CLOCK_IN")

    const [requestedClockIn, setRequestedClockIn] = useState("")
    const [requestedClockOut, setRequestedClockOut] = useState("")
    const [isHomeOffice, setIsHomeOffice] = useState(false)
    const [reason, setReason] = useState("")


    const [showEditModal, setShowEditModal] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedAttendance, setSelectedAttendance] = useState<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openEditModal = (att: any) => {
        setSelectedAttendance(att)
        setShowEditModal(true)
    }

    const handleSubmitEditRequest = async () => {
        if (!selectedAttendance) {
            toast.error("Please select an attendance record first.")
            return
        }

        try {
            // Validasi dasar
            if (!reason.trim()) {
                toast.error("Please provide a reason for your request.")
                return
            }

            // Tentukan request_type otomatis
            const requestType = (() => {
                if (editType === "CLOCK_IN") return "CLOCK_IN"
                if (editType === "CLOCK_OUT") return "CLOCK_OUT"
                if (editType === "BOTH") return "BOTH"
                if (editType === "HOME_FLAG") return "HOME_FLAG"
                if (editType === "BOTH_PLUS_FLAG") return "BOTH_PLUS_FLAG"
                return null
            })()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload: Record<string, any> = {
                work_date: selectedAttendance.work_date,
                request_type: requestType,
                reason,
            }

            // Clock In / Out proposal times
            const workDate = selectedAttendance.work_date
            if (requestedClockIn)
                payload.proposed_clock_in_at = `${workDate}T${requestedClockIn}:00+07:00`
            if (requestedClockOut)
                payload.proposed_clock_out_at = `${workDate}T${requestedClockOut}:00+07:00`


            // Home flag
            if (["HOME_FLAG", "BOTH_PLUS_FLAG"].includes(requestType!))
                payload.proposed_is_home_office = isHomeOffice

            console.log("📤 Submitting edit request:", payload)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await employeeAPI.createEditRequest(payload as any)

            toast.success("Edit request submitted successfully!")
            setShowEditModal(false)

            if (currentCompany?.uuid) {
                await fetchMyEditRequests(currentCompany.uuid)
            }
        } catch (error) {
            console.error("❌ Error submitting edit request:", error)
            toast.error("Failed to submit edit request.")
        }
    }

    const attendancePage = useTranslations("attendance");

    const getEditStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return attendancePage("statusPending");
      case "APPROVED":
        return attendancePage("statusApproved");
      case "REJECTED":
        return attendancePage("statusRejected");
      default:
        return status;
    }
    
  };

    return (
        <main className="p-4 sm:p-6 min-h-screen">
            {/* Header */}
            <div className="mb-8 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 justify-center sm:justify-start">
                    <div className="mx-auto sm:mx-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-orange-500 to-red-500 bg-clip-text text-transparent">
                            {attendancePage("title-1")}
                        </h1>
                        <p className="text-gray-600 text-xs sm:text-sm">{attendancePage("description-1")}</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row flex-wrap gap-3 justify-between">
                        <Input
                            placeholder={
                                viewType === "attendance"
                                    ? attendancePage("searchPlaceholder-1")
                                    : attendancePage("searchPlaceholder-2")
                            }
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 sm:h-12 w-full lg:w-[260px] rounded-2xl border-gray-200 bg-white focus:border-orange-500 focus:ring-orange-500"
                        />
                        <Select value={viewType} onValueChange={(val: "attendance" | "edit-request") => setViewType(val)}>
                            <SelectTrigger className="h-11 sm:h-12 w-full lg:w-[180px] rounded-2xl border-gray-200 bg-white font-medium text-gray-700">
                                <SelectValue placeholder="Select View" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="attendance">{attendancePage("filterTitle-1")}</SelectItem>
                                <SelectItem value="edit-request">{attendancePage("filterTitle-2")}</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Date Range */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
                            <DatePicker date={dateFrom} onDateChange={setDateFrom} placeholder={attendancePage("filterPlaceholderDateFrom")} />
                            <span className="text-gray-400 hidden sm:block">–</span>
                            <DatePicker date={dateTo} onDateChange={setDateTo} placeholder={attendancePage("filterPlaceholderDateTo")} />
                        </div>

                        {/* Status Filter */}
                        <div className="w-full lg:w-[180px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-11 sm:h-12 w-full rounded-2xl border-gray-200 bg-white font-medium text-gray-700">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{attendancePage("filterPlaceholderStatusDefault")}</SelectItem>
                                    {viewType === "attendance" ? (
                                        <>
                                            <SelectItem value="PRESENT">{attendancePage("filterPlaceholderStatusAttendance-1")}</SelectItem>
                                            <SelectItem value="ABSENT">{attendancePage("filterPlaceholderStatusAttendance-2")}</SelectItem>
                                            <SelectItem value="OPEN">{attendancePage("filterPlaceholderStatusAttendance-3")}</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="PENDING">{attendancePage("filterPlaceholderStatusEditAttendance-1")}</SelectItem>
                                            <SelectItem value="APPROVED">{attendancePage("filterPlaceholderStatusEditAttendance-2")}</SelectItem>
                                            <SelectItem value="REJECTED">{attendancePage("filterPlaceholderStatusEditAttendance-3")}</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {viewType === "attendance" ? (
                <>
                    {/* Attendance Table */}
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden overflow-x-auto mb-6">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance List</h2>

                            {/* Header */}
                            <div className="hidden md:grid md:grid-cols-9 gap-4 pb-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
                                <span>{attendancePage("tableHeaderDate")}</span>
                                <span>{attendancePage("tableHeaderAttendanceClockIn")}</span>
                                <span>{attendancePage("tableHeaderAttendanceClockOut")}</span>
                                <span>{attendancePage("tableHeaderAttendanceType")}</span>
                                <span>{attendancePage("tableHeaderAttendanceTotalHours")}</span>
                                <span>{attendancePage("tableHeaderAttendanceOvetime")}</span>
                                <span>{attendancePage("tableHeaderAttendanceNotes")}</span>
                                <span>{attendancePage("tableHeaderAttendanceStatus")}</span>
                                <span>{attendancePage("tableHeaderAttendanceAction")}</span>
                            </div>

                            {/* Rows */}
                            <div className="space-y-3 mt-4">
                                {paginatedAttendance.map((a) => (
                                    <div
                                        key={a.uuid}
                                        className="grid md:grid-cols-9 grid-cols-2 sm:grid-cols-4 gap-y-2 sm:gap-3 md:gap-4 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                                    >
                                        {/* ✅ Date */}
                                        <div className="col-span-2 sm:col-span-1">
                                            <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderDate")}</p>
                                            <p className="font-medium text-gray-900">
                                                {a.work_date
                                                    ? format(new Date(a.work_date), "dd/MMM/yyyy", { locale: id })
                                                    : "-"}
                                            </p>
                                        </div>

                                        {/* ✅ Clock In */}
                                        <div>
                                            <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderAttendanceClockIn")}</p>
                                            <p className="text-gray-700 whitespace-nowrap">
                                                {a.clock_in_at ? a.clock_in_at.slice(11, 16).replace(":", ".") : "-"}
                                                {/* {a.clock_in_at
                                                    ? format(toZonedTime(a.clock_in_at, "Asia/Jakarta"), "HH.mm")
                                                    : "-"} */}
                                            </p>
                                        </div>

                                        {/* ✅ Clock Out */}
                                        <div>
                                            <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderAttendanceClockOut")}</p>
                                            <p className="text-gray-700 whitespace-nowrap">
                                                {a.clock_out_at ? a.clock_out_at.slice(11, 16).replace(":", ".") : "-"}
                                            </p>
                                        </div>

                                        {/* ✅ Type */}
                                        <div>
                                            <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderAttendanceType")}</p>
                                            <Badge
                                                className={`${a.is_home_office
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    } border-0 rounded-full text-xs sm:text-sm`}
                                            >
                                                {a.is_home_office ? "Home Office" : "In Office"}
                                            </Badge>
                                        </div>

                                        {/* ✅ Total Hours */}
                                        <div>
                                            <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderAttendanceTotalHours")}</p>
                                            <p className="text-gray-800 font-medium text-sm text-center">
                                                {a.total_work_hours ? `${a.total_work_hours.toFixed(1)}h` : "-"}
                                            </p>
                                        </div>

                                        {/* ✅ Overtime */}
                                        <div>
                                            <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderAttendanceOvetime")}</p>
                                            {a.is_overtime ? (
                                                <Badge className="bg-orange-100 text-orange-700 border-0 rounded-full text-xs sm:text-sm">
                                                    {a.overtime_hours ? `${a.overtime_hours.toFixed(1)}h` : "OT"}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </div>

                                        {/* ✅ Notes */}
                                        <div className="col-span-2 sm:col-span-1">
                                            <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderAttendanceNotes")}</p>
                                            <p className="text-gray-500 text-sm break-words">{a.notes || "-"}</p>
                                        </div>

                                        {/* ✅ Status */}
                                        <div>
                                            <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderAttendanceStatus")}</p>
                                            <Badge
                                                className={`${a.status === "PRESENT"
                                                    ? "bg-green-100 text-green-700"
                                                    : a.status === "OPEN"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    } border-0 rounded-full text-xs sm:text-sm`}
                                            >
                                                {a.status}
                                            </Badge>
                                        </div>

                                        {/* ✅ Action */}
                                        <div className="flex justify-center items-center">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-purple-500 hover:text-purple-700"
                                                onClick={() => openEditModal(a)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}


                                {paginatedAttendance.length === 0 && (
                                    <p className="text-center text-gray-500 text-sm py-4">
                                        {attendancePage("noAttendance")}
                                    </p>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center space-x-4 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="rounded-xl"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm text-gray-600">
                                        {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="rounded-xl"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ✅ Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {/* Present Days */}
                        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <p className="text-green-100 text-sm font-medium mb-2">{attendancePage("summaryStat-1")}</p>
                                <p className="text-4xl font-bold">{summaryStats.present}</p>
                            </CardContent>
                        </Card>

                        {/* Still Open */}
                        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <p className="text-yellow-100 text-sm font-medium mb-2">{attendancePage("summaryStat-2")}</p>
                                <p className="text-4xl font-bold">{summaryStats.open}</p>
                            </CardContent>
                        </Card>

                        {/* Absent Days */}
                        <Card className="bg-gradient-to-br from-red-500 to-pink-500 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <X className="w-6 h-6" />
                                </div>
                                <p className="text-red-100 text-sm font-medium mb-2">{attendancePage("summaryStat-3")}</p>
                                <p className="text-4xl font-bold">{summaryStats.absent}</p>
                            </CardContent>
                        </Card>

                        {/* Total Hours */}
                        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <p className="text-blue-100 text-sm font-medium mb-2">{attendancePage("totalHours")}</p>
                                <p className="text-4xl font-bold">{summaryStats.totalHours}h</p>
                            </CardContent>
                        </Card>

                        {/* Total Overtime */}
                        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <p className="text-orange-100 text-sm font-medium mb-2">{attendancePage("summaryStat-5")}</p>
                                <p className="text-4xl font-bold">{summaryStats.totalOvertime}h</p>
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                /* Edit Requests */
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{attendancePage("editRequestList")}</h2>

                        <div className="hidden md:grid md:grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
                            <span>{attendancePage("tableHeaderDate")}</span>
                            <span>{attendancePage("tableHeaderEditAttendanceType")}</span>
                            <span>{attendancePage("tableHeaderEditAttendanceReason")}</span>
                            <span>{attendancePage("tableHeaderEditAttendanceStatus")}</span>
                            <span>{attendancePage("tableHeaderEditAttendanceRequestedTime")}</span>
                        </div>

                        <div className="space-y-3 mt-4">
                            {sortedEditRequests.map((r) => (
                                <div
                                    key={r.id}
                                    className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-y-2 sm:gap-3 md:gap-4 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                                >
                                    {/* 🗓️ Date */}
                                    <div>
                                        <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderDate")}</p>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                                            {r.work_date
                                                ? format(new Date(r.work_date), "dd/MMM/yyyy", { locale: id })
                                                : "-"}
                                        </p>
                                    </div>

                                    {/* 🧾 Type */}
                                    <div>
                                        <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderEditAttendanceType")}</p>
                                        {r.proposed_is_home_office !== null && (
                                            <Badge
                                                className={`${r.proposed_is_home_office
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    } border-0 rounded-full text-[10px] sm:text-xs md:text-sm px-2 py-0.5`}
                                            >
                                                {r.proposed_is_home_office ? "Home Office" : "In Office"}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* 💬 Reason */}
                                    <div className="col-span-2 sm:col-span-1">
                                        <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderEditAttendanceReason")}</p>
                                        <p className="text-sm text-gray-600 break-words">{r.reason || "-"}</p>
                                    </div>

                                    {/* 🏷️ Status */}
                                    <div>
                                        <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderEditAttendanceStatus")}</p>
                                        <Badge
                                            className={`${r.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : r.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                } border-0 rounded-full text-xs sm:text-sm`}
                                        >
                                            {getEditStatusLabel(r.status)}
                                        </Badge>
                                    </div>

                                    {/* 🕒 Requested Time */}
                                    <div>
                                        <p className="text-xs text-gray-400 md:hidden">{attendancePage("tableHeaderEditAttendanceRequestedTime")}</p>
                                        <p className="text-sm text-gray-600">
                                            {r.proposed_clock_in_at
                                                ? format(toZonedTime(r.proposed_clock_in_at, "Asia/Jakarta"), "HH.mm")
                                                : "-"}{" "}
                                            →{" "}
                                            {r.proposed_clock_out_at
                                                ? format(toZonedTime(r.proposed_clock_out_at, "Asia/Jakarta"), "HH.mm")
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                            ))}


                            {myEditRequests.length === 0 && (
                                <p className="text-center text-gray-500 text-sm py-4">
                                    {attendancePage("noRequests")}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
            {showEditModal && selectedAttendance && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-xl w-[90%] sm:w-[420px] md:w-[480px] max-h-[90vh] overflow-y-auto p-5 sm:p-6 relative animate-in fade-in-50">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowEditModal(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center mb-4 space-x-3">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 flex items-center justify-center rounded-xl">
                                <Edit className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold">{attendancePage("editRequestTitle")}</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">{attendancePage("tableHeaderDate")}</label>
                                <Input value={selectedAttendance.work_date} disabled />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">{attendancePage("editRequestType")}</label>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                <Select value={editType} onValueChange={(v) => setEditType(v as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CLOCK_IN">Clock In</SelectItem>
                                        <SelectItem value="CLOCK_OUT">Clock Out</SelectItem>
                                        <SelectItem value="BOTH">Clock In & Clock Out</SelectItem>
                                        <SelectItem value="HOME_FLAG">Work Type Only</SelectItem>
                                        <SelectItem value="BOTH_PLUS_FLAG">All</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* CLOCK IN / CLOCK OUT / BOTH */}
                            {["CLOCK_IN", "CLOCK_OUT", "BOTH", "BOTH_PLUS_FLAG"].includes(editType) && (
                                <div className="grid grid-cols-2 gap-3">
                                    {["CLOCK_IN", "BOTH", "BOTH_PLUS_FLAG"].includes(editType) && (
                                        <div>
                                            <label className="text-sm text-gray-600">{attendancePage("editClockIn")}</label>
                                            <Input
                                                type="time"
                                                value={requestedClockIn}
                                                onChange={(e) => setRequestedClockIn(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {["CLOCK_OUT", "BOTH", "BOTH_PLUS_FLAG"].includes(editType) && (
                                        <div>
                                            <label className="text-sm text-gray-600">{attendancePage("editClockOut")}</label>
                                            <Input
                                                type="time"
                                                value={requestedClockOut}
                                                onChange={(e) => setRequestedClockOut(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* HOME FLAG / BOTH_PLUS_FLAG */}
                            {["HOME_FLAG", "BOTH_PLUS_FLAG"].includes(editType) && (
                                <div className="flex items-center space-x-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="homeFlag"
                                        checked={isHomeOffice}
                                        onChange={(e) => setIsHomeOffice(e.target.checked)}
                                        className="w-4 h-4 text-purple-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="homeFlag" className="text-sm text-gray-700">
                                        {attendancePage("editSetAsHomeOffie")}
                                    </label>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    {attendancePage("editReasonLabel")}
                                </label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                                    rows={3}
                                    placeholder={attendancePage("editReasonPlaceholder")}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl"
                                onClick={handleSubmitEditRequest}
                            >
                                {attendancePage("submitEditRequest")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    )
}
