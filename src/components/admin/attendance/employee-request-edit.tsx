"use client"

import { useState } from "react"
import { Search, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type RequestStatus = "pending" | "approved" | "rejected"

interface AttendanceRequest {
  id: string
  employeeName: string
  date: string
  reason: string
  requestedDate: string
  status: RequestStatus
  rejectionReason?: string
}

const mockRequests: AttendanceRequest[] = [
  {
    id: "1",
    employeeName: "Sarah Johnson",
    date: "Tue, 02 Jan 2025",
    reason: "Internet connection issue prevented me from clock in on time",
    requestedDate: "02/01/2025",
    status: "pending",
  },
  {
    id: "2",
    employeeName: "Michael Chen",
    date: "Thu, 16 Jan 2025",
    reason: "Internet connection issue prevented me from clock in on time",
    requestedDate: "16/01/2025",
    status: "pending",
  },
  {
    id: "3",
    employeeName: "Emily Rodriguez",
    date: "Fri, 17 Jan 2025",
    reason: "Forgot to clock in and clock out due to urgent meeting",
    requestedDate: "17/01/2025",
    status: "pending",
  },
  {
    id: "4",
    employeeName: "David Kim",
    date: "Mon, 20 Jan 2025",
    reason: "System error during clock out process",
    requestedDate: "20/01/2025",
    status: "approved",
  },
  {
    id: "5",
    employeeName: "Lisa Anderson",
    date: "Wed, 22 Jan 2025",
    reason: "Forgot to clock out after working late",
    requestedDate: "22/01/2025",
    status: "rejected",
    rejectionReason: "Insufficient evidence provided",
  },
]

export default function RequestedEditAttendancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [requests, setRequests] = useState(mockRequests)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()

  const handleApprove = (id: string) => {
    try {
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" as RequestStatus } : req)))
      toast({
        title: "Request Approved",
        description: "The attendance edit request has been approved successfully.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while approving the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectClick = (id: string) => {
    setSelectedRequestId(id)
    setRejectionReason("")
    setRejectDialogOpen(true)
  }

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this request.",
        variant: "destructive",
      })
      return
    }

    try {
      if (selectedRequestId) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequestId
              ? { ...req, status: "rejected" as RequestStatus, rejectionReason: rejectionReason }
              : req,
          ),
        )
        toast({
          title: "Request Rejected",
          description: "The attendance edit request has been rejected.",
          variant: "default",
        })
      }
      setRejectDialogOpen(false)
      setSelectedRequestId(null)
      setRejectionReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while rejecting the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = requests.filter((r) => r.status === "pending").length

  return (
    <div className="w-full h-full flex flex-col bg-background p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Requested Edit Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">View and approval employee's edit attendance request</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border-2 border-primary/20 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leave request"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {filteredRequests.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No attendance requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={cn(
                "bg-card border border-border rounded-lg p-4 transition-all",
                request.status === "approved" && "opacity-60",
                request.status === "rejected" && "opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{request.date}</h3>
                    {request.status === "approved" && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 font-medium">
                        Approved
                      </span>
                    )}
                    {request.status === "rejected" && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-600 font-medium">
                        Rejected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{request.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      <span className="font-medium">Employee:</span> {request.employeeName}
                    </span>
                    <span>
                      <span className="font-medium">Requested:</span> {request.requestedDate}
                    </span>
                  </div>
                  {request.status === "rejected" && request.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-500/5 border border-red-500/20 rounded text-xs">
                      <span className="font-medium text-red-600">Rejection Reason:</span>{" "}
                      <span className="text-muted-foreground">{request.rejectionReason}</span>
                    </div>
                  )}
                </div>

                {request.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApprove(request.id)}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRejectClick(request.id)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Attendance Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this attendance edit request. This will be shared with the employee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
