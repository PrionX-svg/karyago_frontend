"use client"

import { useState } from "react"
import { Search, Upload, Plus, Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const employeesData = [
  {
    id: 1,
    name: "John Anderson",
    email: "john.anderson@company.com",
    phone: "+6281234567890",
    department: "Engineering",
    branch: "Jakarta HQ",
    position: "Senior Software Engineer",
    status: "Full-time",
    employmentStatus: "active" as const,
    joinDate: "2023-01-15",
    terminationDate: null,
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@company.com",
    phone: "+6281234567891",
    department: "Marketing",
    branch: "Surabaya",
    position: "Marketing Manager",
    status: "Full-time",
    employmentStatus: "active" as const,
    joinDate: "2023-03-20",
    terminationDate: null,
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "+6281234567892",
    department: "Engineering",
    branch: "Jakarta HQ",
    position: "Frontend Developer",
    status: "Contract",
    employmentStatus: "terminated" as const,
    joinDate: "2023-06-10",
    terminationDate: "2024-12-31",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "+6281234567893",
    department: "Human Resources",
    branch: "Bandung",
    position: "HR Specialist",
    status: "Full-time",
    employmentStatus: "active" as const,
    joinDate: "2023-02-28",
    terminationDate: null,
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.kim@company.com",
    phone: "+6281234567894",
    department: "Sales",
    branch: "Jakarta HQ",
    position: "Sales Executive",
    status: "Full-time",
    employmentStatus: "terminated" as const,
    joinDate: "2023-04-12",
    terminationDate: "2024-11-15",
  },
  {
    id: 6,
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    phone: "+6281234567895",
    department: "Finance",
    branch: "Jakarta HQ",
    position: "Financial Analyst",
    status: "Part-time",
    employmentStatus: "active" as const,
    joinDate: "2023-07-01",
    terminationDate: null,
  },
]

export default function ManageEmployeePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [employmentFilter, setEmploymentFilter] = useState<"active" | "terminated" | "all">("active")

  const activeCount = employeesData.filter((e) => e.employmentStatus === "active").length
  const terminatedCount = employeesData.filter((e) => e.employmentStatus === "terminated").length
  const totalCount = employeesData.length

  const filteredEmployees = employeesData
    .filter((employee) => {
      if (employmentFilter === "all") return true
      return employee.employmentStatus === employmentFilter
    })
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.phone.includes(searchQuery) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.branch.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Full-time":
        return "default"
      case "Contract":
        return "secondary"
      case "Part-time":
        return "outline"
      default:
        return "outline"
    }
  }

  const getEmploymentStatusBadge = (employmentStatus: "active" | "terminated") => {
    if (employmentStatus === "active") {
      return (
        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20">
          Active
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20">
        Terminated
      </Badge>
    )
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
                <p className="text-sm text-muted-foreground">Organize and manage your employees</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-xs text-muted-foreground">Total Employees</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={employmentFilter === "active" ? "default" : "outline"}
            onClick={() => setEmploymentFilter("active")}
            className="gap-2"
          >
            Active
            <Badge variant="secondary" className="ml-1 bg-background/80">
              {activeCount}
            </Badge>
          </Button>
          <Button
            variant={employmentFilter === "terminated" ? "default" : "outline"}
            onClick={() => setEmploymentFilter("terminated")}
            className="gap-2"
          >
            Terminated
            <Badge variant="secondary" className="ml-1 bg-background/80">
              {terminatedCount}
            </Badge>
          </Button>
          <Button
            variant={employmentFilter === "all" ? "default" : "outline"}
            onClick={() => setEmploymentFilter("all")}
            className="gap-2"
          >
            All
            <Badge variant="secondary" className="ml-1 bg-background/80">
              {totalCount}
            </Badge>
          </Button>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees by name, email, or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Import Employees
            </Button>
            <Button className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Employee Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Branch</TableHead>
                <TableHead className="font-semibold">Position</TableHead>
                <TableHead className="font-semibold">Employment Status</TableHead>
                <TableHead className="font-semibold">Contract Type</TableHead>
                <TableHead className="font-semibold">Join Date</TableHead>
                {(employmentFilter === "terminated" || employmentFilter === "all") && (
                  <TableHead className="font-semibold">Termination Date</TableHead>
                )}
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={employmentFilter === "terminated" || employmentFilter === "all" ? 11 : 10}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No employees found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className={`hover:bg-muted/30 ${employee.employmentStatus === "terminated" ? "opacity-60" : ""}`}
                  >
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {employee.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{employee.branch}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.position}</TableCell>
                    <TableCell>{getEmploymentStatusBadge(employee.employmentStatus)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(employee.status)}>{employee.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(employee.joinDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    {(employmentFilter === "terminated" || employmentFilter === "all") && (
                      <TableCell className="text-muted-foreground">
                        {employee.terminationDate
                          ? new Date(employee.terminationDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          disabled={employee.employmentStatus === "terminated"}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          disabled={employee.employmentStatus === "terminated"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {filteredEmployees.length} of{" "}
            {employmentFilter === "all" ? totalCount : employmentFilter === "active" ? activeCount : terminatedCount}{" "}
            employees
          </div>
          <div className="flex items-center gap-4">
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
