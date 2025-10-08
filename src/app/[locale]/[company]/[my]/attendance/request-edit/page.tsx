"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Clock, Users, ChevronLeft, ChevronRight, Send, Building2, Bell, Settings, Menu, X } from "lucide-react"
import { ChatbotPopup } from "@/components/chatbot-popup"

export default function RequestEditAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [locationType, setLocationType] = useState("office")
  const [clockInChecked, setClockInChecked] = useState(false)
  const [clockOutChecked, setClockOutChecked] = useState(false)
  const [clockInTime, setClockInTime] = useState("")
  const [clockOutTime, setClockOutTime] = useState("")
  const [reason, setReason] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      date: selectedDate,
      locationType,
      clockIn: clockInChecked ? clockInTime : null,
      clockOut: clockOutChecked ? clockOutTime : null,
      reason,
    })
    // Handle form submission
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-orange-500 to-red-500">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">User Name</h3>
                <p className="text-sm text-white/80">Role</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link href="/employee/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
              >
                <Building2 className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
            </Link>

            <Link href="/employee/profile">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
              >
                <User className="w-4 h-4 mr-3" />
                Profile
              </Button>
            </Link>

            <Link href="/employee/attendance">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-900 hover:bg-gray-100 bg-gray-100 rounded-xl font-medium"
              >
                <Clock className="w-4 h-4 mr-3" />
                Attendance
              </Button>
            </Link>

            <Link href="/employee/organization">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
              >
                <Users className="w-4 h-4 mr-3" />
                Department
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden hover:bg-gray-100 rounded-xl"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  <Bell className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Request to Edit Attendance</h1>
                  <p className="text-gray-600">Edit your attendance here</p>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>

            <Card className="bg-white/95 backdrop-blur-xl border-gray-200 shadow-lg rounded-3xl border-0 overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {/* Calendar Section */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                    

                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      className="rounded-2xl bg-white shadow-sm border-0"
                    />
                  </div>

                  {/* Form Section */}
                  <div className="space-y-6">
                    {/* Date Section */}
                    <div className="space-y-4">
                      <Label className="text-gray-700 font-medium">Date</Label>
                      <RadioGroup value={locationType} onValueChange={setLocationType} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="office" id="office" />
                          <Label htmlFor="office" className="text-gray-700 cursor-pointer">
                            Office
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="home" id="home" />
                          <Label htmlFor="home" className="text-gray-700 cursor-pointer">
                            Home Office
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Clock In Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="clock-in"
                          checked={clockInChecked}
                          onCheckedChange={(checked) => setClockInChecked(checked as boolean)}
                        />
                        <Label htmlFor="clock-in" className="text-gray-700 font-medium cursor-pointer">
                          Clock In
                        </Label>
                      </div>
                      {clockInChecked && (
                        <div>
                          <Label className="text-sm text-gray-600 mb-2 block">Clock In Time</Label>
                          <Input
                            type="time"
                            value={clockInTime}
                            onChange={(e) => setClockInTime(e.target.value)}
                            className="border-gray-300 rounded-xl"
                          />
                        </div>
                      )}
                    </div>

                    {/* Clock Out Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="clock-out"
                          checked={clockOutChecked}
                          onCheckedChange={(checked) => setClockOutChecked(checked as boolean)}
                        />
                        <Label htmlFor="clock-out" className="text-gray-700 font-medium cursor-pointer">
                          Clock Out
                        </Label>
                      </div>
                      {clockOutChecked && (
                        <div>
                          <Label className="text-sm text-gray-600 mb-2 block">Clock Out Time</Label>
                          <Input
                            type="time"
                            value={clockOutTime}
                            onChange={(e) => setClockOutTime(e.target.value)}
                            className="border-gray-300 rounded-xl"
                          />
                        </div>
                      )}
                    </div>

                    {/* Reason Section */}
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium">Reason</Label>
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please provide a reason for your attendance edit request..."
                        className="border-gray-300 rounded-xl min-h-[120px] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chatbot */}
      <ChatbotPopup />
    </div>
  )
}
