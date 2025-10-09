"use client"

import { useEffect, useState } from "react"
import { Search, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCompanyStore } from "@/stores/company-store"
import { employeeAPI } from "@/lib/api/employee-api"
import { toast } from "sonner"

export default function AttendanceEditRequestsPage() {
  const { currentCompany } = useCompanyStore()
  const [requests, setRequests] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    const loadRequests = async () => {
      if (!currentCompany?.uuid) return
      try {
        setLoading(true)
        const res = await employeeAPI.getAllEditRequests(currentCompany.uuid)
        const data = Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data)
          ? res.data
          : []
        setRequests(data)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load requests")
      } finally {
        setLoading(false)
      }
    }
    loadRequests()
  }, [currentCompany?.uuid])

  const handleApprove = async (id: string) => {
    try {
      await employeeAPI.approveEditRequest(id)
      toast.success("Request approved")
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r)))
    } catch {
      toast.error("Failed to approve")
    }
  }

  const handleReject = async () => {
    if (!selected) return
    try {
      await employeeAPI.rejectEditRequest(selected.id)
      toast.success("Request rejected")
      setRequests((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status: "REJECTED" } : r)))
      setSelected(null)
      setRejectionReason("")
    } catch {
      toast.error("Failed to reject")
    }
  }

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reason?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filter === "all" || r.status?.toLowerCase() === filter.toLowerCase()
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Attendance Requests</h1>
        <Input
          placeholder="Search employee or reason..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No edit requests found</p>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className={`p-4 rounded-xl border ${
                r.status === "APPROVED"
                  ? "border-green-300 bg-green-50"
                  : r.status === "REJECTED"
                  ? "border-red-300 bg-red-50"
                  : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {r.employee_name} — {r.work_date}
                  </h3>
                  <p className="text-sm text-gray-600">{r.reason || "-"}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {r.status}</p>
                </div>
                {r.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button size="icon" className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(r.id)}>
                      <Check className="w-4 h-4 text-white" />
                    </Button>
                    <Button size="icon" className="bg-red-500 hover:bg-red-600" onClick={() => setSelected(r)}>
                      <X className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
