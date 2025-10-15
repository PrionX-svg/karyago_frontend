"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Check, ListChecksIcon, X } from "lucide-react"
import { toast } from "sonner"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export default function EmployeeEditRequestsPage() {
  const { currentCompany } = useCompanyStore()
  const [requests, setRequests] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  const fetchRequests = async () => {
    if (!currentCompany?.uuid) return
    try {
      const res = await employeeAPI.getAllEditRequests(currentCompany.uuid)
      console.log("🔥 Final API response:", res.data)

      // ⛔ Jangan map ulang — karena responseFormatter di API sudah handle formatnya
      setRequests(res.data || [])
    } catch (err) {
      console.error("❌ Failed to fetch edit requests:", err)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [currentCompany?.uuid])

  // For debugging purposes
  useEffect(() => {
    console.log("🔍 requests data sample:", requests)
  }, [requests])

  // unique employee names (filter dummy yg uuid kosong)
  const employeeNames = useMemo(() => {
    const unique = new Set(
      requests
        // hanya ambil yang punya user_name valid (hindari dummy)
        .filter((r) => r.user_name && r.user_name.trim() !== "")
        .map((r) => r.user_name.trim())
    )

    const sorted = Array.from(unique).sort((a, b) =>
      a.localeCompare(b, "id", { sensitivity: "base" })
    )

    return ["all", ...sorted]
  }, [requests])



  const [selectedEmployee, setSelectedEmployee] = useState("all")

  // ✅ Filtering logic
  const filtered = requests.filter((r) => {
    if (selectedEmployee !== "all" && r.user_name !== selectedEmployee) return false
    if (selectedStatus !== "all" && r.status !== selectedStatus) return false
    if (search && !r.user_name.toLowerCase().includes(search.toLowerCase())) return false
    if (dateFrom && new Date(r.work_date) < dateFrom) return false
    if (dateTo && new Date(r.work_date) > dateTo) return false
    return true
  })

  // 🧭 Sort edit requests by work_date (newest first)
  const sortedRequests = [...filtered].sort((a, b) => {
    const dateA = new Date(a.work_date ?? 0).getTime()
    const dateB = new Date(b.work_date ?? 0).getTime()
    return dateB - dateA
  })


  const handleApprove = async (id: string) => {
    try {
      await employeeAPI.approveEditRequest(id)
      toast.success("Request approved")
      fetchRequests()
    } catch (err) {
      toast.error("Failed to approve request")
    }
  }

  const [rejectModal, setRejectModal] = useState<{ open: boolean; id?: string; reason: string }>({
    open: false,
    reason: "",
  })

  const handleReject = async (id: string) => {
    setRejectModal({ open: true, id, reason: "" })
  }

  const confirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      toast.error("Please provide a reason for rejection.")
      return
    }

    try {
      await employeeAPI.rejectEditRequest(rejectModal.id!, rejectModal.reason)
      toast.success("Request rejected")
      setRejectModal({ open: false, reason: "" })
      fetchRequests()
    } catch (err) {
      toast.error("Failed to reject request")
    }
  }

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
    <main className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950 rounded-xl border border-orange-200 dark:border-orange-800 group-hover:from-orange-100 group-hover:to-orange-200 dark:group-hover:from-orange-800 dark:group-hover:to-orange-900 transition-colors">
            <ListChecksIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div> Attendance Edit Requests
        </h1>
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />

          {/* Employee filter */}
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

          {/* Date range */}
          <div className="flex gap-2 items-center">
            <DatePicker date={dateFrom} onDateChange={setDateFrom} placeholder="From" />
            <span>–</span>
            <DatePicker date={dateTo} onDateChange={setDateTo} placeholder="To" />
          </div>

          {/* Status */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-md border-0 rounded-3xl">
        <CardContent>
          <div className="hidden md:grid md:grid-cols-8 text-sm font-semibold text-gray-600 border-b pb-3 mb-3">
            <span>Name</span>
            <span>Department</span>
            <span>Date</span>
            <span>Type</span>
            <span>Requested Time</span>
            <span>Reason</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          {sortedRequests.map((r) => (
            <div
              key={r.id}
              className="grid md:grid-cols-8 items-center py-3 border-b text-sm hover:bg-gray-50 transition-all"
            >
              {/* Name */}
              <span className="font-medium text-gray-900">{r.user_name ?? ""}</span>

              {/* Department */}
              <span className="text-gray-600">{r.department_name}</span>

              {/* Date */}
              <span className="text-gray-700"> {r.work_date
                ? format(new Date(r.work_date), "dd/MMM/yyyy", { locale: id })
                : "-"}</span>

              {/* Type */}
              <span className="text-gray-700">{formatEditType(r.edit_type)}</span>

              {/* Requested Time */}
              <span className="text-gray-800">
                {r.proposed_clock_in_at
                  ? new Date(r.proposed_clock_in_at).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
                  })
                  : "-"}{" "}
                →{" "}
                {r.proposed_clock_out_at
                  ? new Date(r.proposed_clock_out_at).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
                  })
                  : "-"}{" "}
                {r.proposed_is_home_office && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700 border-0 rounded-full">
                    Home Office
                  </Badge>
                )}
              </span>

              {/* Reason */}
              <span className="text-gray-500 truncate">{r.reason}</span>

              {/* Status */}
              <Badge
                className={`${r.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : r.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  } rounded-full w-fit`}
              >
                {r.status}
              </Badge>

              {/* Actions */}
              <div className="flex justify-center gap-2">
                {r.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(r.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(r.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}


          {filtered.length === 0 && <p className="text-center text-gray-400 py-6">No edit requests found</p>}
        </CardContent>

        <div className="px-6 pb-6 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Type of Request:</h3>
          <ul className="text-sm text-gray-600 leading-relaxed list-disc list-inside">
            <li><strong>Clock In</strong> — Employee requests to adjust their clock-in time.</li>
            <li><strong>Clock Out</strong> — Employee requests to adjust their clock-out time.</li>
            <li><strong>Clock In & Out</strong> — Adjustment for both clock-in and clock-out times.</li>
            <li><strong>Work Type</strong> — Change between office and home work type.</li>
            <li><strong>All Request Type</strong> — Combination of Clock In, Clock Out, and Work Type.</li>
          </ul>
        </div>


        {rejectModal.open && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Reject Edit Request</h2>
              <p className="text-gray-600 mb-3">Please provide a reason for rejecting this request:</p>

              <textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Type your reason here..."
              />

              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={() => setRejectModal({ open: false, reason: "" })}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmReject}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}

      </Card>
    </main>
  )
}
