"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Square, Coffee } from "lucide-react"

interface TimeEntry {
  type: "clock-in" | "clock-out" | "break-start" | "break-end"
  time: string
  timestamp: Date
}

export function TimeTrackingWidget() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null)
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null)
  const [totalWorkTime, setTotalWorkTime] = useState(0)
  const [totalBreakTime, setTotalBreakTime] = useState(0)
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([
    { type: "clock-in", time: "09:00 AM", timestamp: new Date() },
    { type: "break-start", time: "12:00 PM", timestamp: new Date() },
    { type: "break-end", time: "01:00 PM", timestamp: new Date() },
  ])

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleClockIn = () => {
    const now = new Date()
    setIsWorking(true)
    setWorkStartTime(now)
    setTodayEntries((prev) => [
      ...prev,
      {
        type: "clock-in",
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: now,
      },
    ])
  }

  const handleClockOut = () => {
    const now = new Date()
    setIsWorking(false)
    setIsOnBreak(false)
    setWorkStartTime(null)
    setBreakStartTime(null)
    setTodayEntries((prev) => [
      ...prev,
      {
        type: "clock-out",
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: now,
      },
    ])
  }

  const handleBreakStart = () => {
    const now = new Date()
    setIsOnBreak(true)
    setBreakStartTime(now)
    setTodayEntries((prev) => [
      ...prev,
      {
        type: "break-start",
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: now,
      },
    ])
  }

  const handleBreakEnd = () => {
    const now = new Date()
    setIsOnBreak(false)
    setBreakStartTime(null)
    setTodayEntries((prev) => [
      ...prev,
      {
        type: "break-end",
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: now,
      },
    ])
  }

  const getStatusBadge = () => {
    if (isOnBreak) return <Badge className="bg-orange-500 text-white">On Break</Badge>
    if (isWorking) return <Badge className="bg-green-500 text-white">Working</Badge>
    return <Badge variant="secondary">Clocked Out</Badge>
  }

  const getEntryIcon = (type: string) => {
    switch (type) {
      case "clock-in":
        return <Play className="w-3 h-3 text-green-500" />
      case "clock-out":
        return <Square className="w-3 h-3 text-red-500" />
      case "break-start":
        return <Coffee className="w-3 h-3 text-orange-500" />
      case "break-end":
        return <Play className="w-3 h-3 text-blue-500" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const getEntryLabel = (type: string) => {
    switch (type) {
      case "clock-in":
        return "Clocked In"
      case "clock-out":
        return "Clocked Out"
      case "break-start":
        return "Break Started"
      case "break-end":
        return "Break Ended"
      default:
        return type
    }
  }

  return (
    <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          Time Tracking
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Time */}
        <div className="text-center p-4 bg-muted/30 rounded-2xl">
          <div className="text-3xl font-bold font-mono text-foreground">
            {mounted ? currentTime.toLocaleTimeString() : "--:--:--"}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {mounted
              ? currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
              : "---"}
          </div>
        </div>

        {/* Work Time Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50/50 dark:bg-green-950/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
            <div className="text-lg font-bold text-green-700 dark:text-green-400">7:45:30</div>
            <div className="text-xs text-green-600 dark:text-green-500">Work Time</div>
          </div>
          <div className="text-center p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
            <div className="text-lg font-bold text-orange-700 dark:text-orange-400">1:15:00</div>
            <div className="text-xs text-orange-600 dark:text-orange-500">Break Time</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {!isWorking ? (
            <Button
              onClick={handleClockIn}
              className="bg-green-500 hover:bg-green-600 text-white rounded-2xl col-span-2"
            >
              <Play className="w-4 h-4 mr-2" />
              Clock In
            </Button>
          ) : (
            <>
              {!isOnBreak ? (
                <Button
                  onClick={handleBreakStart}
                  variant="outline"
                  className="rounded-2xl border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 bg-transparent"
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  Start Break
                </Button>
              ) : (
                <Button onClick={handleBreakEnd} className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl">
                  <Play className="w-4 h-4 mr-2" />
                  End Break
                </Button>
              )}
              <Button
                onClick={handleClockOut}
                variant="outline"
                className="rounded-2xl border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 bg-transparent"
              >
                <Square className="w-4 h-4 mr-2" />
                Clock Out
              </Button>
            </>
          )}
        </div>

        {/* Today's Entries */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Today's Activity</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {todayEntries.slice(-5).map((entry, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-xl bg-muted/20">
                {getEntryIcon(entry.type)}
                <span className="text-sm flex-1">{getEntryLabel(entry.type)}</span>
                <span className="text-xs text-muted-foreground">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
