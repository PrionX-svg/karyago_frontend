"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  FileText,
  Bell,
  Users,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { MetricCard } from "../../metric-card";
import { TimeTrackingWidget } from "./time-tracking-widget";
import { AttendanceHeatmap } from "./attendance-heatmap";
import { PerformanceCharts } from "./performance-charts";

interface EmployeeDashboardProps {
  user: {
    id: string;
    name: string;
    role: string;
    title: string;
    avatar: string;
    email: string;
  };
}

// Mock employee data
const employeeInfo = {
  employeeId: "EMP001",
  department: "Engineering",
  joinDate: "2022-03-15",
  workingDays: 418,
  phone: "+1 (555) 123-4567",
  address: "123 Main St, City, State 12345",
};

const todaySchedule = {
  shift: "Morning Shift",
  startTime: "09:00 AM",
  endTime: "06:00 PM",
  breakTime: "12:00 PM - 01:00 PM",
  status: "active",
};

const announcements = [
  {
    title: "New Health Insurance Policy",
    content:
      "We're excited to announce our enhanced health insurance coverage starting next month.",
    date: "July 22, 2024",
    priority: "high",
  },
  {
    title: "Office Renovation Update",
    content:
      "The 3rd floor renovation will be completed by the end of this month.",
    date: "July 20, 2024",
    priority: "medium",
  },
  {
    title: "Team Building Event",
    content: "Join us for our quarterly team building event on July 28th.",
    date: "July 18, 2024",
    priority: "low",
  },
];

const companyEvents = [
  {
    title: "Team Building Workshop",
    date: "July 28",
    time: "2:00 PM",
    participating: true,
  },
  {
    title: "Quarterly Review Meeting",
    date: "July 30",
    time: "10:00 AM",
    participating: false,
  },
  {
    title: "Summer Company Picnic",
    date: "August 5",
    time: "12:00 PM",
    participating: true,
  },
];

const quickActions = [
  { title: "Apply for Leave", icon: Calendar, color: "bg-blue-500" },
  { title: "Request Document", icon: FileText, color: "bg-green-500" },
  { title: "Update Profile", icon: Calendar, color: "bg-purple-500" },
  { title: "View Payslip", icon: FileText, color: "bg-orange-500" },
];

export function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 font-poppins">
          Hello {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome to the HR management system
        </p>
      </div>

      {/* Personal Info & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 ring-2 ring-border">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold font-poppins">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.title}</p>
                <Badge variant="secondary" className="mt-2">
                  {employeeInfo.employeeId}
                </Badge>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{employeeInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs">{employeeInfo.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{employeeInfo.department}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Days in Company"
            value={employeeInfo.workingDays.toString()}
            change="+7% last month"
            trend="up"
            icon={Calendar}
            variant="primary"
          />
          <MetricCard
            title="Leave Balance"
            value="18"
            change="5 used this year"
            trend="neutral"
            icon={Calendar}
          />
          <MetricCard
            title="Performance Score"
            value="4.8"
            change="+0.2 this quarter"
            trend="up"
            icon={Users}
          />
        </div>
      </div>

      {/* Time Tracking & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeTrackingWidget />

        {/* Today's Schedule */}
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 font-poppins">
                    {todaySchedule.shift}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {todaySchedule.startTime} - {todaySchedule.endTime}
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Break Time:</span>
                  <span>{todaySchedule.breakTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    On Time
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-16 flex flex-col items-center gap-2 hover:bg-accent bg-transparent rounded-2xl"
                    >
                      <div
                        className={`w-6 h-6 rounded-lg ${action.color} flex items-center justify-center`}
                      >
                        <action.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium">
                        {action.title}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Heatmap */}
      <AttendanceHeatmap />

      {/* Performance Charts */}
      <PerformanceCharts />

      {/* Announcements & Company Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Announcements */}
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              Company Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-2xl bg-muted/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm font-poppins">
                    {announcement.title}
                  </h4>
                  <Badge
                    variant={
                      announcement.priority === "high"
                        ? "destructive"
                        : announcement.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  {announcement.date}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Company Events */}
        <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              Company Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {companyEvents.length}
              </p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>

            {companyEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-border rounded-2xl bg-muted/20"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm font-poppins">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.date} at {event.time}
                  </p>
                  {event.participating && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      You're participating
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={event.participating ? "default" : "outline"}
                  className="rounded-xl"
                >
                  {event.participating ? "View Details" : "Join Event"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
