"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const workingFormatData = [
  { name: "Office", value: 60, color: "#10b981" },
  { name: "Hybrid", value: 30, color: "#f59e0b" },
  { name: "Remote", value: 10, color: "#3b82f6" },
]

const departmentData = [
  { name: "Engineering", employees: 120, color: "#3b82f6" },
  { name: "Marketing", employees: 45, color: "#10b981" },
  { name: "Sales", employees: 80, color: "#f59e0b" },
  { name: "HR", employees: 25, color: "#ef4444" },
  { name: "Finance", employees: 35, color: "#8b5cf6" },
  { name: "Operations", employees: 55, color: "#06b6d4" },
]

export function EmployeeChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Working Format Distribution */}
      <Card className="backdrop-blur-xl bg-white/60 border-white/20 shadow-xl shadow-black/5 rounded-3xl hover:bg-white/70 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800 font-semibold">Working Format Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workingFormatData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workingFormatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    418
                  </p>
                  <p className="text-sm text-gray-500 font-medium">Total</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {workingFormatData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Distribution */}
      <Card className="backdrop-blur-xl bg-white/60 border-white/20 shadow-xl shadow-black/5 rounded-3xl hover:bg-white/70 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800 font-semibold">Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} stroke="#64748b" />
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
              <Bar dataKey="employees" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
