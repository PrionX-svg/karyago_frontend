"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Check, X } from "lucide-react"
import { toast } from "sonner"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"

export default function EmployeeEditRequestsPage() {
  const { currentCompany } = useCompanyStore()
  const [requests, setRequests] = useState<any[]>([])
  const [search, setSearch] = useState("")

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


  const filtered = requests.filter((r) =>
    r.user_name?.toLowerCase().includes(search.toLowerCase())
  )



  return (
    <main className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-orange-500" /> Attendance Edit Requests
        </h1>
        <Input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <Card className="shadow-md border-0 rounded-3xl">
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
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

          {filtered.map((r) => (
            <div
              key={r.id}
              className="grid md:grid-cols-8 items-center py-3 border-b text-sm hover:bg-gray-50 transition-all"
            >
              {/* Name */}
              <span className="font-medium text-gray-900">{r.user_name ?? ""}</span>

              {/* Department */}
              <span className="text-gray-600">{r.department_name}</span>

              {/* Date */}
              <span className="text-gray-700">{r.work_date}</span>

              {/* Type */}
              <span className="text-gray-700">{r.edit_type}</span>

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
