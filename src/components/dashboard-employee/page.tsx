"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Calendar,
  Clock,
  Bell,
  Users,
  Building2,
  Menu,
  X,
  Settings,
  Star,
  Heart,
  Smile,
  Target,
  Award,
  Home,
  Briefcase,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

export default function EmployeeDashboard({}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClocked, setIsClocked] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [workLocation, setWorkLocation] = useState<"Office" | "Home Office">("Office")
  const [notes, setNotes] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editType, setEditType] = useState<string>("")
  const [editDate, setEditDate] = useState("")
  const [editReason, setEditReason] = useState("")
  const [originalTime, setOriginalTime] = useState("")
  const [requestedTime, setRequestedTime] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClockIn = () => {
    setIsClocked(true)
    setClockInTime(new Date())
  }

  const handleClockOut = () => {
    setIsClocked(false)
    setClockInTime(null)
  }

  const handleSubmitEditRequest = () => {
    console.log({
      editType,
      editDate,
      originalTime,
      requestedTime,
      editReason,
    })

    setEditDialogOpen(false)
    setEditType("")
    setEditDate("")
    setEditReason("")
    setOriginalTime("")
    setRequestedTime("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const getWorkingHours = () => {
    if (!clockInTime) return "00:00:00"
    const diff = currentTime.getTime() - clockInTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Sidebar */}
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
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-900 hover:bg-gray-100 bg-gray-100 rounded-xl font-medium"
            >
              <Building2 className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
            >
              <User className="w-4 h-4 mr-3" />
              Profile
            </Button>

            {/* Attendance */}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
            >
              <Clock className="w-4 h-4 mr-3" />
              Attendance
            </Button>
            {/* Department */}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
            >
              <Users className="w-4 h-4 mr-3" />
              Department
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
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

        {/* Dashboard Content */}
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
            {/* Clock In/Out Card */}
            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
              <Card className="bg-white/95 backdrop-blur-xl border-gray-200 shadow-lg rounded-3xl h-full hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 md:p-8 h-full flex flex-col justify-between">
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <div className="text-5xl md:text-6xl font-semibold text-gray-900 mb-3 tracking-tight">
                      {isClocked ? getWorkingHours() : formatTime(currentTime)}
                    </div>
                    <p className="text-gray-600 mb-4 font-medium text-sm md:text-base">
                      {currentTime.toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {/* Office/Home Office toggle */}
                    <div className="mb-6 flex justify-center">
                      <div className="inline-flex bg-gray-100 rounded-2xl p-1">
                        <button
                          onClick={() => setWorkLocation("Office")}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                            workLocation === "Office"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>Office</span>
                        </button>
                        <button
                          onClick={() => setWorkLocation("Home Office")}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                            workLocation === "Home Office"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <Home className="w-4 h-4" />
                          <span>Home Office</span>
                        </button>
                      </div>
                    </div>

                    {/* Notes field */}
                    <div className="mb-6">
                      <Textarea
                        placeholder="Add notes for today..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-gray-50 border-gray-200 rounded-2xl resize-none text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={handleClockIn}
                        disabled={isClocked}
                        className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Clock In
                      </Button>
                      <Button
                        onClick={handleClockOut}
                        disabled={!isClocked}
                        className="bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Clock Out
                      </Button>
                    </div>

                    {/* Request Edit button with dialog */}
                    <div className="mt-4">
                      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        
                        <DialogContent className="sm:max-w-[500px] rounded-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-900">
                              Request Attendance Edit
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Submit a request to edit your attendance record. Your manager will review and approve or
                              reject the request.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-type" className="text-sm font-medium text-gray-900">
                                Edit Type
                              </Label>
                              <Select value={editType} onValueChange={setEditType}>
                                <SelectTrigger id="edit-type" className="rounded-xl">
                                  <SelectValue placeholder="Select edit type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="clock-in">Clock In Time</SelectItem>
                                  <SelectItem value="clock-out">Clock Out Time</SelectItem>
                                  <SelectItem value="full-day">Full Day Edit</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-date" className="text-sm font-medium text-gray-900">
                                Date
                              </Label>
                              <Input
                                id="edit-date"
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="rounded-xl"
                              />
                            </div>

                            {editType && editType !== "full-day" && (
                              <>
                                <div className="space-y-2">
                                  <Label htmlFor="original-time" className="text-sm font-medium text-gray-900">
                                    Original Time
                                  </Label>
                                  <Input
                                    id="original-time"
                                    type="time"
                                    value={originalTime}
                                    onChange={(e) => setOriginalTime(e.target.value)}
                                    className="rounded-xl"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="requested-time" className="text-sm font-medium text-gray-900">
                                    Requested Time
                                  </Label>
                                  <Input
                                    id="requested-time"
                                    type="time"
                                    value={requestedTime}
                                    onChange={(e) => setRequestedTime(e.target.value)}
                                    className="rounded-xl"
                                  />
                                </div>
                              </>
                            )}

                            <div className="space-y-2">
                              <Label htmlFor="edit-reason" className="text-sm font-medium text-gray-900">
                                Reason for Edit
                              </Label>
                              <Textarea
                                id="edit-reason"
                                placeholder="Please provide a detailed reason for this edit request..."
                                value={editReason}
                                onChange={(e) => setEditReason(e.target.value)}
                                className="rounded-xl resize-none"
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="rounded-xl">
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSubmitEditRequest}
                              disabled={!editType || !editDate || !editReason}
                              className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl"
                            >
                              Submit Request
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Rate */}
            <div className="md:col-span-1">
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl h-full">
                <CardContent className="p-6 text-white h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-white font-semibold text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Attendance Rate
                    </CardTitle>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-2">95%</div>
                    <p className="text-sm text-blue-100 flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      This month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Work Hours */}
            <div className="md:col-span-1">
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl h-full">
                <CardContent className="p-6 text-white h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-white font-semibold text-lg flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Total Hours
                    </CardTitle>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">160h</div>
                    <p className="text-sm text-purple-100 flex items-center">
                      <Smile className="w-3 h-3 mr-1" />
                      This month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Edit Requests */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="bg-white/95 backdrop-blur-xl border-gray-200 shadow-lg rounded-3xl h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-gray-900 font-semibold text-xl flex items-center">
                    <Edit className="w-6 h-6 mr-3 text-orange-500" />
                    My Edit Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="group p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl hover:shadow-md transition-all duration-300 border border-yellow-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Clock In Time Edit</h4>
                          <p className="text-xs text-gray-600 mt-1">January 3, 2025</p>
                        </div>
                        <Badge className="bg-yellow-500 text-white rounded-full flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Pending</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">Requested: 08:00 → 08:30</p>
                    </div>

                    <div className="group p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all duration-300 border border-green-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Clock Out Time Edit</h4>
                          <p className="text-xs text-gray-600 mt-1">January 2, 2025</p>
                        </div>
                        <Badge className="bg-green-500 text-white rounded-full flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Approved</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">Requested: 17:00 → 17:30</p>
                    </div>

                    <div className="group p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl hover:shadow-md transition-all duration-300 border border-red-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Full Day Edit</h4>
                          <p className="text-xs text-gray-600 mt-1">December 30, 2024</p>
                        </div>
                        <Badge className="bg-red-500 text-white rounded-full flex items-center space-x-1">
                          <XCircle className="w-3 h-3" />
                          <span>Rejected</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">Insufficient documentation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <div className="md:col-span-2 lg:col-span-4">
              <Card className="bg-white/95 backdrop-blur-xl border-gray-200 shadow-lg rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-gray-900 font-semibold text-xl flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-orange-500" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl hover:shadow-md transition-all duration-300 border border-orange-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">Company Gathering</h4>
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
                          Upcoming
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Monthly Gathering with activities and lunch</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2" />
                          01/01/2025
                        </p>
                        <p className="flex items-center">
                          <Building2 className="w-3 h-3 mr-2" />
                          Pagi Sore
                        </p>
                      </div>
                    </div>

                    <div className="group p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl hover:shadow-md transition-all duration-300 border border-orange-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">Company Gathering</h4>
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
                          Upcoming
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Monthly Gathering with activities and lunch</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2" />
                          01/01/2025
                        </p>
                        <p className="flex items-center">
                          <Building2 className="w-3 h-3 mr-2" />
                          Pagi Sore
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
    </div>
  )
}
