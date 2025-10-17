"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, ListChecksIcon, X } from "lucide-react"
import { toast } from "sonner"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toZonedTime } from "date-fns-tz"

interface EditRequestItem {
  id: string
  user_name: string
  department_name?: string
  work_date: string
  edit_type: string
  reason?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  proposed_clock_in_at?: string | null
  proposed_clock_out_at?: string | null
  proposed_is_home_office?: boolean
}


export default function EmployeeEditRequestsPage() {
  const { currentCompany } = useCompanyStore()
  const [requests, setRequests] = useState<EditRequestItem[]>([])
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id?: string; reason: string }>({
    open: false,
    reason: "",
  })

  const fetchRequests = useCallback(async () => {
    if (!currentCompany?.uuid) return
    try {
      const res = await employeeAPI.getAllEditRequests(currentCompany.uuid)
      setRequests(res.data || [])
    } catch (err) {
      console.error("❌ Failed to fetch edit requests:", err)
    }
  }, [currentCompany?.uuid])

  useEffect(() => {
    fetchRequests()
  }, [currentCompany?.uuid, fetchRequests])

  const employeeNames = useMemo(() => {
    const unique = new Set(
      requests
        .filter((r) => r.user_name && r.user_name.trim() !== "")
        .map((r) => r.user_name.trim())
    )
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b, "id"))]
  }, [requests])

  const filtered = requests.filter((r) => {
    if (selectedEmployee !== "all" && r.user_name !== selectedEmployee) return false
    if (selectedStatus !== "all" && r.status !== selectedStatus) return false
    if (search && !r.user_name.toLowerCase().includes(search.toLowerCase())) return false
    if (dateFrom && new Date(r.work_date) < dateFrom) return false
    if (dateTo && new Date(r.work_date) > dateTo) return false
    return true
  })

  const sortedRequests = [...filtered].sort(
    (a, b) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime()
  )

  const handleApprove = async (id: string) => {
    try {
      await employeeAPI.approveEditRequest(id)
      toast.success("Request approved")
      fetchRequests()
    } catch {
      toast.error("Failed to approve request")
    }
  }

  const handleReject = (id: string) => setRejectModal({ open: true, id, reason: "" })

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
    } catch {
      toast.error("Failed to reject request")
    }
  }

  const formatEditType = (type: string) => {
    switch (type) {
      case "CLOCK_IN": return "Clock In"
      case "CLOCK_OUT": return "Clock Out"
      case "BOTH": return "Clock In & Out"
      case "HOME_FLAG": return "Work Type"
      case "BOTH_PLUS_FLAG":
      case "BOTH PLUS FLAG": return "All Request Type"
      default: return type || "-"
    }
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950 rounded-xl border border-orange-200 dark:border-orange-800">
            <ListChecksIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          Attendance Edit Requests
        </h1>
      </div>

      {/* Toolbar */}
      <div className="w-full bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm flex flex-wrap gap-3 justify-between items-start sm:items-center mb-6 overflow-hidden">
        <div className="flex flex-wrap gap-3 flex-1 min-w-0">
          <Input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-48 min-w-0"
          />

          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-full sm:w-44 min-w-0">
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
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-start sm:justify-end w-full sm:w-auto min-w-0">
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <DatePicker date={dateFrom} onDateChange={setDateFrom} placeholder="From" />
            <span className="text-gray-500">–</span>
            <DatePicker date={dateTo} onDateChange={setDateTo} placeholder="To" />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-36 min-w-0">
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

      {/* Table & Card Layout */}
      <Card className="shadow-md border-0 rounded-3xl">
        <CardHeader>
          <CardTitle>Edit Requests</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Desktop table */}
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {sortedRequests.map((r) => (
              <Card key={r.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{r.user_name}</h3>
                  <Badge
                    className={`text-xs ${r.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : r.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {r.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <p><strong>Date:</strong> {r.work_date ? format(new Date(r.work_date), "dd/MMM/yyyy", { locale: id }) : "-"}</p>
                  <p><strong>Type:</strong> {formatEditType(r.edit_type)}</p>
                  <p><strong>Time:</strong>  {r.proposed_clock_in_at
                    ? format(toZonedTime(r.proposed_clock_in_at, "Asia/Jakarta"), "HH.mm")
                    : "-"}{" "}
                    →{" "}
                    {r.proposed_clock_out_at
                      ? format(toZonedTime(r.proposed_clock_out_at, "Asia/Jakarta"), "HH.mm")
                      : "-"}</p>
                  <p><strong>Reason:</strong> {r.reason || "-"}</p>
                </div>
                {r.status === "PENDING" && (
                  <div className="flex justify-end gap-2 mt-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(r.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(r.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Desktop rows */}
          <div className="hidden md:block">
            {sortedRequests.map((r) => (
              <div
                key={r.id}
                className="grid md:grid-cols-8 items-center py-3 border-b text-sm hover:bg-gray-50 transition-all"
              >
                <span className="font-medium text-gray-900">{r.user_name ?? ""}</span>
                <span className="text-gray-600">{r.department_name}</span>
                <span>{r.work_date ? format(new Date(r.work_date), "dd/MMM/yyyy", { locale: id }) : "-"}</span>
                <span>{formatEditType(r.edit_type)}</span>
                <span>
                  {r.proposed_clock_in_at
                    ? format(toZonedTime(r.proposed_clock_in_at, "Asia/Jakarta"), "HH.mm")
                    : "-"}{" "}
                  →{" "}
                  {r.proposed_clock_out_at
                    ? format(toZonedTime(r.proposed_clock_out_at, "Asia/Jakarta"), "HH.mm")
                    : "-"}
                  {r.proposed_is_home_office && <Badge className="ml-2 bg-blue-100 text-blue-700">Home Office</Badge>}
                </span>
                <span className="text-gray-500 truncate">{r.reason}</span>
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
                <div className="flex justify-center gap-2">
                  {r.status === "PENDING" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(r.id)}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(r.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && <p className="text-center text-gray-400 py-6">No edit requests found</p>}
        </CardContent>

        {/* 🔶 Type of Request Explanation */}
        <div className="px-6 pb-6 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Type of Request:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc list-inside space-y-1">
            <li>
              <strong>Clock In</strong> — Employee requests to adjust their clock-in time.
            </li>
            <li>
              <strong>Clock Out</strong> — Employee requests to adjust their clock-out time.
            </li>
            <li>
              <strong>Clock In & Out</strong> — Adjustment for both clock-in and clock-out times.
            </li>
            <li>
              <strong>Work Type</strong> — Change between office and home work type.
            </li>
            <li>
              <strong>All Request Type</strong> — Combination of Clock In, Clock Out, and Work Type.
            </li>
          </ul>
        </div>
      </Card>

      {/* Reject Modal */}
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
              <Button variant="outline" onClick={() => setRejectModal({ open: false, reason: "" })}>Cancel</Button>
              <Button variant="destructive" onClick={confirmReject}>Reject</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
