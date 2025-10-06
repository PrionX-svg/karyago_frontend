"use client"

import { useState } from "react"
import { Search, Download, Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AttendanceStatus = "present" | "open" | "absent"

interface AttendanceRecord {
  id: string
  employeeName: string
  department: string
  branch: string
  date: string
  clockIn: string
  clockOut: string
  totalHours: string
  status: AttendanceStatus
  location: string
  notes?: string
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: "1",
    employeeName: "Sarah Johnson",
    department: "Engineering",
    branch: "Jakarta HQ",
    date: "2025-01-06",
    clockIn: "08:45 AM",
    clockOut: "05:30 PM",
    totalHours: "8h 45m",
    status: "present", // Has both clock in and clock out
    location: "Office",
  },
  {
    id: "2",
    employeeName: "Michael Chen",
    department: "Marketing",
    branch: "Jakarta HQ",
    date: "2025-01-06",
    clockIn: "09:15 AM",
    clockOut: "06:00 PM",
    totalHours: "8h 45m",
    status: "present", // Has both clock in and clock out
    location: "Office",
  },
  {
    id: "3",
    employeeName: "Emily Rodriguez",
    department: "Sales",
    branch: "Surabaya",
    date: "2025-01-06",
    clockIn: "-",
    clockOut: "-",
    totalHours: "-",
    status: "absent", // No clock in and no clock out
    location: "-",
    notes: "No attendance recorded",
  },
  {
    id: "4",
    employeeName: "David Kim",
    department: "Engineering",
    branch: "Jakarta HQ",
    date: "2025-01-06",
    clockIn: "08:30 AM",
    clockOut: "-",
    totalHours: "-",
    status: "open", // Has clock in but no clock out yet
    location: "Remote",
    notes: "Still working",
  },
  {
    id: "5",
    employeeName: "Lisa Anderson",
    department: "HR",
    branch: "Bandung",
    date: "2025-01-06",
    clockIn: "08:50 AM",
    clockOut: "05:15 PM",
    totalHours: "8h 25m",
    status: "present", // Has both clock in and clock out
    location: "Office",
  },
  {
    id: "6",
    employeeName: "James Wilson",
    department: "Finance",
    branch: "Jakarta HQ",
    date: "2025-01-06",
    clockIn: "-",
    clockOut: "-",
    totalHours: "-",
    status: "absent", // No clock in and no clock out
    location: "-",
  },
  {
    id: "7",
    employeeName: "Anna Martinez",
    department: "Sales",
    branch: "Jakarta HQ",
    date: "2025-01-06",
    clockIn: "09:00 AM",
    clockOut: "-",
    totalHours: "-",
    status: "open", // Has clock in but no clock out yet
    location: "Office",
    notes: "Currently on shift",
  },
]

const statusConfig: Record<
  AttendanceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  present: { label: "Present", variant: "default" },
  open: { label: "Open", variant: "secondary" },
  absent: { label: "Absent", variant: "destructive" },
}

export default function AttendanceListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("today")

  const filteredData = mockAttendanceData.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.branch.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    present: mockAttendanceData.filter((r) => r.status === "present").length,
    open: mockAttendanceData.filter((r) => r.status === "open").length,
    absent: mockAttendanceData.filter((r) => r.status === "absent").length,
  }

  return (
    <div className="w-full h-full flex flex-col bg-background p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Attendance List</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and monitor employee attendance records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Select Date</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards - Updated to show only Present, Open, and Absent */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.present}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.open}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.absent}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee, department, or branch..."
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
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{record.branch}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.clockIn}</TableCell>
                    <TableCell>{record.clockOut}</TableCell>
                    <TableCell>{record.totalHours}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[record.status].variant}>{statusConfig[record.status].label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{record.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
