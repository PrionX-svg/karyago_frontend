"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricCard } from "../metric-card";

// Mock employee data
const employees = [
  {
    id: "EMP001",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Frontend Developer",
    department: "Engineering",
    location: "New York, NY",
    joinDate: "2022-03-15",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
    salary: "$95,000",
    performance: 4.8,
    attendance: 96,
  },
  {
    id: "EMP002",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 234-5678",
    position: "UX Designer",
    department: "Design",
    location: "San Francisco, CA",
    joinDate: "2021-08-20",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&text=SW",
    salary: "$85,000",
    performance: 4.9,
    attendance: 98,
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 345-6789",
    position: "Backend Developer",
    department: "Engineering",
    location: "Austin, TX",
    joinDate: "2023-01-10",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&text=MJ",
    salary: "$90,000",
    performance: 4.6,
    attendance: 94,
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    phone: "+1 (555) 456-7890",
    position: "Marketing Manager",
    department: "Marketing",
    location: "Chicago, IL",
    joinDate: "2020-11-05",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&text=ED",
    salary: "$75,000",
    performance: 4.7,
    attendance: 97,
  },
  {
    id: "EMP005",
    name: "David Brown",
    email: "david.brown@company.com",
    phone: "+1 (555) 567-8901",
    position: "Sales Representative",
    department: "Sales",
    location: "Miami, FL",
    joinDate: "2022-06-12",
    status: "on-leave",
    avatar: "/placeholder.svg?height=40&width=40&text=DB",
    salary: "$65,000",
    performance: 4.4,
    attendance: 89,
  },
];

const departments = [
  "All",
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
];
const statuses = ["All", "Active", "On Leave", "Inactive"];

export function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" ||
      employee.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Active" && employee.status === "active") ||
      (selectedStatus === "On Leave" && employee.status === "on-leave") ||
      (selectedStatus === "Inactive" && employee.status === "inactive");

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "on-leave":
        return <Badge className="bg-orange-500 text-white">On Leave</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-gray-100 dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-2 font-poppins">
            Employee Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your team members and their information
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value="418"
          change="+12 this month"
          trend="up"
          icon={Users}
          variant="primary"
        />
        <MetricCard
          title="Active Employees"
          value="395"
          change="+5 this week"
          trend="up"
          icon={TrendingUp}
        />
        <MetricCard
          title="On Leave"
          value="18"
          change="-2 from last week"
          trend="down"
          icon={Calendar}
        />
        <MetricCard
          title="Avg Performance"
          value="4.7"
          change="+0.2 this quarter"
          trend="up"
          icon={Clock}
        />
      </div>

      {/* Filters and Search */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-border/30 backdrop-blur-sm rounded-2xl"
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full lg:w-48 rounded-2xl">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48 rounded-2xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card
            key={employee.id}
            className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl hover:bg-card/70 transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 ring-2 ring-border">
                    <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold font-poppins">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {employee.position}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-xl"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl">
                    <DropdownMenuItem className="rounded-xl">
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl">
                      Edit Employee
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl">
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl text-destructive">
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="rounded-xl">
                  {employee.department}
                </Badge>
                {getStatusBadge(employee.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{employee.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Joined {new Date(employee.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {employee.performance}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Performance
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {employee.attendance}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Attendance
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 rounded-xl">
                  View Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-xl bg-transparent"
                >
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
