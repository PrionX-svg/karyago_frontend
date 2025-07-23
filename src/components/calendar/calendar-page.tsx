"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarIcon,
  Plus,
  Clock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Video,
  Coffee,
  Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock calendar data
const events = [
  {
    id: 1,
    title: "Team Standup",
    time: "09:00 AM",
    duration: "30 min",
    type: "meeting",
    attendees: ["John Smith", "Sarah Wilson", "Mike Johnson"],
    location: "Conference Room A",
    color: "bg-blue-500",
    date: new Date(2024, 6, 22), // July 22, 2024
  },
  {
    id: 2,
    title: "Client Presentation",
    time: "02:00 PM",
    duration: "1 hour",
    type: "presentation",
    attendees: ["Emily Davis", "David Brown"],
    location: "Virtual - Zoom",
    color: "bg-green-500",
    date: new Date(2024, 6, 22),
  },
  {
    id: 3,
    title: "Coffee Break",
    time: "03:30 PM",
    duration: "15 min",
    type: "break",
    attendees: [],
    location: "Kitchen",
    color: "bg-orange-500",
    date: new Date(2024, 6, 22),
  },
  {
    id: 4,
    title: "Project Review",
    time: "10:00 AM",
    duration: "2 hours",
    type: "meeting",
    attendees: ["John Smith", "Sarah Wilson", "Emily Davis"],
    location: "Conference Room B",
    color: "bg-purple-500",
    date: new Date(2024, 6, 23),
  },
  {
    id: 5,
    title: "HR Interview",
    time: "11:00 AM",
    duration: "45 min",
    type: "interview",
    attendees: ["Trisha Kyrlova"],
    location: "HR Office",
    color: "bg-pink-500",
    date: new Date(2024, 6, 24),
  },
]

const upcomingEvents = events.filter((event) => event.date >= new Date()).slice(0, 5)

const getEventIcon = (type: string) => {
  switch (type) {
    case "meeting":
      return <Users className="w-4 h-4" />
    case "presentation":
      return <Video className="w-4 h-4" />
    case "break":
      return <Coffee className="w-4 h-4" />
    case "interview":
      return <Briefcase className="w-4 h-4" />
    default:
      return <CalendarIcon className="w-4 h-4" />
  }
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return events.filter((event) => event.date.toDateString() === date.toDateString())
  }

  const isToday = (day: number) => {
    const today = new Date()
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-gray-100 dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-2 font-poppins">
            Calendar
          </h1>
          <p className="text-muted-foreground text-lg">Manage your schedule and upcoming events</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-poppins">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth("prev")}
                    className="w-10 h-10 rounded-2xl"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth("next")}
                    className="w-10 h-10 rounded-2xl"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty days */}
                {emptyDays.map((_, index) => (
                  <div key={`empty-${index}`} className="h-20 p-2"></div>
                ))}

                {/* Days */}
                {days.map((day) => {
                  const dayEvents = getEventsForDate(day)
                  return (
                    <div
                      key={day}
                      className={cn(
                        "h-20 p-2 border border-border/30 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-accent/50",
                        isToday(day) && "bg-primary/10 border-primary/30",
                        isSelected(day) && "bg-primary/20 border-primary/50",
                      )}
                      onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    >
                      <div className={cn("text-sm font-medium mb-1", isToday(day) && "text-primary font-bold")}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn("text-xs px-2 py-1 rounded-lg text-white truncate", event.color)}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
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
            <CardContent className="space-y-4">
              {events
                .filter((event) => event.date.toDateString() === new Date().toDateString())
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white", event.color)}
                    >
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {event.time} • {event.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                      {event.attendees.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-2">
                            {event.attendees.slice(0, 3).map((attendee, index) => (
                              <Avatar key={index} className="w-6 h-6 border-2 border-background">
                                <AvatarImage
                                  src={`/placeholder.svg?height=24&width=24&text=${attendee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}`}
                                />
                                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                  {attendee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {event.attendees.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{event.attendees.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                </div>
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white", event.color)}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString()} • {event.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs rounded-xl">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
