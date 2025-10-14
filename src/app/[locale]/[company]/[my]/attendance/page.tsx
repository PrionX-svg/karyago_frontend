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
import { Calendar, Clock, FileText, Edit, ChevronLeft, ChevronRight, Info, X } from "lucide-react"
import { employeeAPI } from "@/lib/api/employee-api"

export default function AttendancePage() {
    const { currentCompany } = useCompanyStore()
    const { attendanceList, fetchAttendanceRange } = useEmployeeSelfStore()
    const { myEditRequests, fetchMyEditRequests } = useAttendanceEditStore()

    const [viewType, setViewType] = useState<"attendance" | "edit-request">("attendance")
    const [timeFilter, setTimeFilter] = useState<"this-week" | "this-month">("this-week")
    const [searchTerm, setSearchTerm] = useState("")
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
    }, [currentCompany?.uuid, timeFilter])

    useEffect(() => {
        console.log("🟢 attendanceList (from store):", attendanceList)
    }, [attendanceList])

    /** Filter hasil pencarian */
    const filteredAttendance = attendanceList.filter((att) => {
        if (!searchTerm) return true
        const term = searchTerm.toLowerCase()
        return (
            att.work_date?.toLowerCase().includes(term) ||
            att.notes?.toLowerCase().includes(term)
        )
    })

    /** Pagination */
    const totalPages = Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE)
    const paginatedAttendance = filteredAttendance.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    /** 💡 Summary Stats (otomatis hitung dari attendanceList) */
    const summaryStats = useMemo(() => {
        const present = attendanceList.filter((a) => a.status === "PRESENT").length
        const absent = attendanceList.filter((a) => a.status === "ABSENT").length
        const open = attendanceList.filter((a) => a.status === "OPEN").length

        // Hitung total jam kerja hanya untuk yang sudah clock in & out
        const totalMs = attendanceList.reduce((acc, a) => {
            if (a.clock_in_at && a.clock_out_at) {
                const inTime = new Date(`${a.work_date}T${a.clock_in_at}`).getTime()
                const outTime = new Date(`${a.work_date}T${a.clock_out_at}`).getTime()
                if (!isNaN(inTime) && !isNaN(outTime) && outTime > inTime) {
                    return acc + (outTime - inTime)
                }
            }
            return acc
        }, 0)

        const totalHours = Math.floor(totalMs / 1000 / 60 / 60)

        return {
            present,
            absent,
            open,
            totalHours,
            totalDays: attendanceList.length,
        }
    }, [attendanceList])


    const [editType, setEditType] = useState<
        "CLOCK_IN" | "CLOCK_OUT" | "BOTH" | "HOME_FLAG" | "BOTH_PLUS_FLAG"
    >("CLOCK_IN")

    const [requestedClockIn, setRequestedClockIn] = useState("")
    const [requestedClockOut, setRequestedClockOut] = useState("")
    const [isHomeOffice, setIsHomeOffice] = useState(false)
    const [reason, setReason] = useState("")


    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedAttendance, setSelectedAttendance] = useState<any>(null)

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

            const payload: any = {
                work_date: selectedAttendance.work_date,
                request_type: requestType,
                reason,
            }

            // Clock In / Out proposal times
            const workDate = selectedAttendance.work_date
            if (requestedClockIn)
                payload.proposed_clock_in_at = `${workDate}T${requestedClockIn}:00Z`
            if (requestedClockOut)
                payload.proposed_clock_out_at = `${workDate}T${requestedClockOut}:00Z`

            // Home flag
            if (["HOME_FLAG", "BOTH_PLUS_FLAG"].includes(requestType!))
                payload.proposed_is_home_office = isHomeOffice

            console.log("📤 Submitting edit request:", payload)

            await employeeAPI.createEditRequest(payload)

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




    return (
        <main className="p-6 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-br from-orange-500 to-red-500 bg-clip-text text-transparent">
                            My Attendance
                        </h1>
                        <p className="text-gray-600 text-sm">Your attendance records and summary</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <Card className="mb-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="Search by date or notes"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 rounded-2xl border-gray-200 bg-white focus:border-purple-500 focus:ring-purple-500"
                    />

                    <Select
                        value={viewType}
                        onValueChange={(val: "attendance" | "edit-request") => setViewType(val)}
                    >
                        <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white">
                            <SelectValue placeholder="Select View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="attendance">Attendance List</SelectItem>
                            <SelectItem value="edit-request">Edit Request List</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white">
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {viewType === "attendance" ? (
                <>
                    {/* Attendance Table */}
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden mb-6">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance List</h2>

                            {/* Header */}
                            <div className="hidden md:grid md:grid-cols-9 gap-4 pb-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
                                <span>Date</span>
                                <span>Clock In</span>
                                <span>Clock Out</span>
                                <span>Type</span>
                                <span>Total Hours</span>
                                <span>Overtime</span>
                                <span>Notes</span>
                                <span>Status</span>
                                <span>Actions</span>
                            </div>

                            {/* Rows */}
                            <div className="space-y-3 mt-4">
                                {paginatedAttendance.map((a) => (
                                    <div
                                        key={a.uuid}
                                        className="grid grid-cols-1 md:grid-cols-9 gap-4 pb-3 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                                    >
                                        <span className="font-medium text-gray-900">{a.work_date || "-"}</span>
                                        <span className="text-gray-700 whitespace-nowrap">{a.clock_in_at
                                            ? new Date(a.clock_in_at).toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                                timeZone: "Asia/Jakarta", // 🌍 penting: ubah ke WIB
                                            })
                                            : "-"}</span>
                                        <span className="text-gray-700 whitespace-nowrap">{a.clock_out_at
                                            ? new Date(a.clock_out_at).toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                                timeZone: "Asia/Jakarta",
                                            })
                                            : "-"}</span>
                                        <span>
                                            <Badge
                                                className={`${a.is_home_office
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    } border-0 rounded-full`}
                                            >
                                                {a.is_home_office ? "Home Office" : "In Office"}
                                            </Badge>
                                        </span>
                                        {/* 🆕 Total Work Hours */}
                                        <span className="text-center text-gray-800 font-medium text-sm">
                                            {a.total_work_hours ? `${a.total_work_hours.toFixed(1)}h` : "-"}
                                        </span>

                                        {/* 🆕 Overtime */}
                                        <span className="text-center">
                                            {a.is_overtime ? (
                                                <Badge className="bg-orange-100 text-orange-700 border-0 rounded-full">
                                                    {a.overtime_hours ? `${a.overtime_hours.toFixed(1)}h` : "OT"}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </span>
                                        <span className="text-gray-400 text-sm">{a.notes || "-"}</span>
                                        <span>
                                            <Badge
                                                className={`${a.status === "PRESENT"
                                                    ? "bg-green-100 text-green-700"
                                                    : a.status === "OPEN"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    } border-0 rounded-full`}
                                            >
                                                {a.status}
                                            </Badge>
                                        </span>
                                        <span className="flex justify-center">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-purple-500 hover:text-purple-700"
                                                onClick={() => openEditModal(a)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </span>
                                    </div>

                                ))}

                                {paginatedAttendance.length === 0 && (
                                    <p className="text-center text-gray-500 text-sm py-4">
                                        No attendance records found.
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
                                <p className="text-green-100 text-sm font-medium mb-2">Present Days</p>
                                <p className="text-4xl font-bold">{summaryStats.present}</p>
                            </CardContent>
                        </Card>

                        {/* Still Open */}
                        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <p className="text-yellow-100 text-sm font-medium mb-2">Still Open</p>
                                <p className="text-4xl font-bold">{summaryStats.open}</p>
                            </CardContent>
                        </Card>

                        {/* Absent Days */}
                        <Card className="bg-gradient-to-br from-red-500 to-pink-500 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <X className="w-6 h-6" />
                                </div>
                                <p className="text-red-100 text-sm font-medium mb-2">Absent Days</p>
                                <p className="text-4xl font-bold">{summaryStats.absent}</p>
                            </CardContent>
                        </Card>

                        {/* Total Hours */}
                        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <p className="text-blue-100 text-sm font-medium mb-2">Total Hours</p>
                                <p className="text-4xl font-bold">{summaryStats.totalHours}h</p>
                            </CardContent>
                        </Card>

                        {/* Total Overtime */}
                        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <p className="text-orange-100 text-sm font-medium mb-2">Total Overtime</p>
                                <p className="text-4xl font-bold">
                                    {
                                        attendanceList.reduce((acc, a) => acc + (a.is_overtime ? a.overtime_hours ?? 0 : 0), 0).toFixed(1)
                                    }h
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                /* Edit Requests */
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Request List</h2>

                        <div className="hidden md:grid md:grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
                            <span>Date</span>
                            <span>Type</span>
                            <span>Reason</span>
                            <span>Status</span>
                            <span>Requested Time</span>
                        </div>

                        <div className="space-y-3 mt-4">
                            {myEditRequests.map((r) => (
                                <div
                                    key={r.id}
                                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                                >
                                    <span className="font-medium text-gray-900">{r.work_date}</span>
                                    <span className="text-gray-700"> {r.proposed_is_home_office !== null && (
                                        <Badge
                                            className={`ml-2 rounded-full ${r.proposed_is_home_office
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                                } border-0`}
                                        >
                                            {r.proposed_is_home_office ? "Home Office" : "In Office"}
                                        </Badge>
                                    )}</span>
                                    <span className="text-sm text-gray-600">{r.reason || "-"}</span>
                                    <span>
                                        <Badge
                                            className={`${r.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : r.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                } border-0 rounded-full`}
                                        >
                                            {r.status}
                                        </Badge>
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {r.proposed_clock_in_at
                                            ? new Date(r.proposed_clock_in_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
                                            : "-"}{" "}
                                        →{" "}
                                        {r.proposed_clock_out_at
                                            ? new Date(r.proposed_clock_out_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
                                            : "-"}

                                    </span>
                                </div>
                            ))}

                            {myEditRequests.length === 0 && (
                                <p className="text-center text-gray-500 text-sm py-4">
                                    No edit requests found.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
            {showEditModal && selectedAttendance && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in-50">
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
                            <h2 className="text-xl font-semibold">Request Attendance Edit</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Date</label>
                                <Input value={selectedAttendance.work_date} disabled />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Request Type</label>
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
                                            <label className="text-sm text-gray-600">Requested Clock In</label>
                                            <Input
                                                type="time"
                                                value={requestedClockIn}
                                                onChange={(e) => setRequestedClockIn(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {["CLOCK_OUT", "BOTH", "BOTH_PLUS_FLAG"].includes(editType) && (
                                        <div>
                                            <label className="text-sm text-gray-600">Requested Clock Out</label>
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
                                        Set as Home Office
                                    </label>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Reason for Edit Request
                                </label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                                    rows={3}
                                    placeholder="Explain why you need to edit..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl"
                                onClick={handleSubmitEditRequest}
                            >
                                Submit Request
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    )
}
