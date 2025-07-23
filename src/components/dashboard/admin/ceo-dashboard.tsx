"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Clock,
  UserPlus,
  Cake,
  AlertTriangle,
  Calendar,
  FileText,
} from "lucide-react";
import { MetricCard } from "../../metric-card";
import { EmployeeChart } from "./employee-chart";
import { NotificationPanel } from "./notification-panel";

interface User {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  email: string;
}

interface CEODashboardProps {
  user: User;
}

// Mock data
const employeeStats = {
  total: 418,
  attendanceRate: 87,
  newThisMonth: 12,
  lateToday: 5,
};

const newEmployees = [
  {
    name: "John Smith",
    position: "Frontend Developer",
    startDate: "2024-07-15",
    avatar: "/placeholder.svg?height=32&width=32&text=JS",
  },
  {
    name: "Sarah Wilson",
    position: "UX Designer",
    startDate: "2024-07-18",
    avatar: "/placeholder.svg?height=32&width=32&text=SW",
  },
  {
    name: "Mike Johnson",
    position: "Backend Developer",
    startDate: "2024-07-20",
    avatar: "/placeholder.svg?height=32&width=32&text=MJ",
  },
];

const upcomingBirthdays = [
  {
    name: "Alice Brown",
    date: "July 25",
    avatar: "/placeholder.svg?height=32&width=32&text=AB",
  },
  {
    name: "David Lee",
    date: "July 27",
    avatar: "/placeholder.svg?height=32&width=32&text=DL",
  },
  {
    name: "Emma Davis",
    date: "July 30",
    avatar: "/placeholder.svg?height=32&width=32&text=ED",
  },
];

const lateEmployees = [
  {
    name: "Tom Wilson",
    time: "9:15 AM",
    avatar: "/placeholder.svg?height=32&width=32&text=TW",
  },
  {
    name: "Lisa Garcia",
    time: "9:30 AM",
    avatar: "/placeholder.svg?height=32&width=32&text=LG",
  },
  {
    name: "James Miller",
    time: "9:45 AM",
    avatar: "/placeholder.svg?height=32&width=32&text=JM",
  },
];

const leaveRequests = [
  {
    name: "Robert Taylor",
    type: "Annual Leave",
    dates: "Aug 1-5",
    status: "pending",
    avatar: "/placeholder.svg?height=32&width=32&text=RT",
  },
  {
    name: "Jennifer White",
    type: "Sick Leave",
    dates: "July 25",
    status: "approved",
    avatar: "/placeholder.svg?height=32&width=32&text=JW",
  },
  {
    name: "Michael Brown",
    type: "Personal Leave",
    dates: "Aug 10-12",
    status: "pending",
    avatar: "/placeholder.svg?height=32&width=32&text=MB",
  },
];

const companyEvents = [
  {
    title: "Team Building Workshop",
    date: "July 28",
    participants: 45,
    status: "upcoming",
  },
  {
    title: "Quarterly Review Meeting",
    date: "July 30",
    participants: 25,
    status: "upcoming",
  },
  {
    title: "Summer Company Picnic",
    date: "August 5",
    participants: 120,
    status: "upcoming",
  },
];

export function CEODashboard({ user }: CEODashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Hello {user.name.split(" ")[0]}
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome to the HR management system
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value={employeeStats.total.toString()}
          change="+7% last month"
          trend="up"
          icon={Users}
          variant="primary"
        />
        <MetricCard
          title="Attendance Rate"
          value={`${employeeStats.attendanceRate}%`}
          change="+2% today"
          trend="up"
          icon={Clock}
        />
        <MetricCard
          title="New Employees"
          value={employeeStats.newThisMonth.toString()}
          change="+3 this month"
          trend="up"
          icon={UserPlus}
        />
        <MetricCard
          title="Late Today"
          value={employeeStats.lateToday.toString()}
          change="-2 from yesterday"
          trend="down"
          icon={AlertTriangle}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Employee Distribution Chart */}
        <div className="lg:col-span-2">
          <EmployeeChart />
        </div>

        {/* Notifications */}
        <div>
          <NotificationPanel />
        </div>
      </div>

      {/* Employee Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Employees */}
        <Card className="backdrop-blur-xl bg-white/60 border-white/20 shadow-xl shadow-black/5 rounded-3xl hover:bg-white/70 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              New Employees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {newEmployees.map((employee, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all duration-200"
              >
                <Avatar className="w-10 h-10 ring-2 ring-white/50">
                  <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">
                    {employee.name}
                  </p>
                  <p className="text-xs text-gray-600">{employee.position}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-50/80 text-blue-700 border-blue-200/50 rounded-xl"
                >
                  {new Date(employee.startDate).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Birthdays */}
        <Card className="backdrop-blur-xl bg-white/60 border-white/20 shadow-xl shadow-black/5 rounded-3xl hover:bg-white/70 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center">
                <Cake className="w-5 h-5 text-pink-600" />
              </div>
              Upcoming Birthdays
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBirthdays.map((person, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all duration-200"
              >
                <Avatar className="w-10 h-10 ring-2 ring-white/50">
                  <AvatarImage src={person.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs">
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">
                    {person.name}
                  </p>
                  <p className="text-xs text-gray-600">{person.date}</p>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white border-0 rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200"
                >
                  Send Wishes
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Late Employees */}
        <Card className="backdrop-blur-xl bg-white/60 border-white/20 shadow-xl shadow-black/5 rounded-3xl hover:bg-white/70 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              Late Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lateEmployees.map((employee, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all duration-200"
              >
                <Avatar className="w-10 h-10 ring-2 ring-white/50">
                  <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">
                    {employee.name}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    Arrived at {employee.time}
                  </p>
                </div>
                <Badge className="text-xs bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 rounded-xl shadow-lg shadow-orange-500/25">
                  Late
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests & Company Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leave Requests */}
        <Card className="backdrop-blur-xl bg-white/60 border-white/20 shadow-xl shadow-black/5 rounded-3xl hover:bg-white/70 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              Leave Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaveRequests.map((request, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/30 hover:bg-white/60 transition-all duration-200"
              >
                <Avatar className="w-12 h-12 ring-2 ring-white/50">
                  <AvatarImage src={request.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {request.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">
                    {request.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {request.type} • {request.dates}
                  </p>
                </div>
                <div className="flex gap-2">
                  {request.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-xl shadow-lg shadow-green-500/25"
                      >
                        Approve
                      </Button>
                    </>
                  ) : (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 rounded-xl">
                      Approved
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Company Events */}
        <Card className="backdrop-blur-xl bg-white/60 border-white/20 shadow-xl shadow-black/5 rounded-3xl hover:bg-white/70 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              Company Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-100/50">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {companyEvents.length}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                Upcoming Events
              </p>
            </div>
            {companyEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/30 hover:bg-white/60 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {event.date} • {event.participants} participants
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-xl border-purple-200 text-purple-700 bg-purple-50/50"
                >
                  {event.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
