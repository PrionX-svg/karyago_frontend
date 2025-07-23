"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

// Mock data for performance metrics
const performanceData = [
  {
    month: "Jan",
    productivity: 85,
    quality: 92,
    attendance: 95,
    satisfaction: 88,
  },
  {
    month: "Feb",
    productivity: 88,
    quality: 89,
    attendance: 93,
    satisfaction: 90,
  },
  {
    month: "Mar",
    productivity: 92,
    quality: 94,
    attendance: 97,
    satisfaction: 92,
  },
  {
    month: "Apr",
    productivity: 87,
    quality: 91,
    attendance: 94,
    satisfaction: 89,
  },
  {
    month: "May",
    productivity: 94,
    quality: 96,
    attendance: 98,
    satisfaction: 95,
  },
  {
    month: "Jun",
    productivity: 91,
    quality: 93,
    attendance: 96,
    satisfaction: 93,
  },
];

const taskCompletionData = [
  { week: "W1", completed: 24, pending: 6, overdue: 2 },
  { week: "W2", completed: 28, pending: 4, overdue: 1 },
  { week: "W3", completed: 32, pending: 8, overdue: 3 },
  { week: "W4", completed: 29, pending: 5, overdue: 1 },
];

const skillsData = [
  { name: "Technical Skills", value: 92, color: "#3b82f6" },
  { name: "Communication", value: 88, color: "#10b981" },
  { name: "Leadership", value: 85, color: "#f59e0b" },
  { name: "Problem Solving", value: 90, color: "#ef4444" },
  { name: "Teamwork", value: 94, color: "#8b5cf6" },
];

const workHoursData = [
  { day: "Mon", hours: 8.5, overtime: 0.5 },
  { day: "Tue", hours: 8.2, overtime: 0.2 },
  { day: "Wed", hours: 9.1, overtime: 1.1 },
  { day: "Thu", hours: 8.0, overtime: 0 },
  { day: "Fri", hours: 7.8, overtime: 0 },
  { day: "Sat", hours: 4.0, overtime: 0 },
  { day: "Sun", hours: 0, overtime: 0 },
];

export function PerformanceCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Trends */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            Performance Trends
            <Badge className="ml-auto bg-green-500 text-white">Improving</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                opacity={0.5}
              />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="quality"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="satisfaction"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">
                Productivity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-muted-foreground">Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">
                Satisfaction
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Completion */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            Task Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskCompletionData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                opacity={0.5}
              />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="completed"
                stackId="a"
                fill="#10b981"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="pending"
                stackId="a"
                fill="#f59e0b"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="overdue"
                stackId="a"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground">Overdue</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Hours */}
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            Weekly Work Hours
            <Badge className="ml-auto bg-blue-500 text-white">
              45.6h Total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={workHoursData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="overtime"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">
                Regular Hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-muted-foreground">Overtime</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
