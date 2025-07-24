"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, Coffee, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type ClockStatus = "clocked-out" | "clocked-in" | "on-break";

interface TimeEntry {
  id: string;
  type: "clock-in" | "clock-out" | "break-start" | "break-end";
  timestamp: Date;
  location?: string;
}

export function ClockWidget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<ClockStatus>("clocked-out");
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [totalWorkedTime, setTotalWorkedTime] = useState(0); // in minutes
  const [totalBreakTime, setTotalBreakTime] = useState(0); // in minutes
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate worked time
  useEffect(() => {
    if (status === "clocked-in" && clockInTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const workedMinutes = Math.floor(
          (now.getTime() - clockInTime.getTime()) / (1000 * 60)
        );
        setTotalWorkedTime(workedMinutes - totalBreakTime);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, clockInTime, totalBreakTime]);

  // Calculate break time
  useEffect(() => {
    if (status === "on-break" && breakStartTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const breakMinutes = Math.floor(
          (now.getTime() - breakStartTime.getTime()) / (1000 * 60)
        );
        setTotalBreakTime((prev) => prev + breakMinutes);
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [status, breakStartTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCurrentLocation = () => {
    // Mock location - in real app, you'd use geolocation API
    return "Office - Floor 3";
  };

  const addTimeEntry = (type: TimeEntry["type"]) => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      type,
      timestamp: new Date(),
      location: getCurrentLocation(),
    };
    setTimeEntries((prev) => [newEntry, ...prev.slice(0, 4)]); // Keep last 5 entries
  };

  const handleClockIn = () => {
    const now = new Date();
    setStatus("clocked-in");
    setClockInTime(now);
    setTotalWorkedTime(0);
    setTotalBreakTime(0);
    addTimeEntry("clock-in");
  };

  const handleClockOut = () => {
    setStatus("clocked-out");
    setClockInTime(null);
    setBreakStartTime(null);
    addTimeEntry("clock-out");
  };

  const handleBreakStart = () => {
    setStatus("on-break");
    setBreakStartTime(new Date());
    addTimeEntry("break-start");
  };

  const handleBreakEnd = () => {
    setStatus("clocked-in");
    setBreakStartTime(null);
    addTimeEntry("break-end");
  };

  const getStatusConfig = () => {
    switch (status) {
      case "clocked-in":
        return {
          color: "bg-green-500",
          text: "Clocked In",
          textColor: "text-green-700 dark:text-green-300",
          bgColor: "bg-green-50 dark:bg-green-950",
        };
      case "on-break":
        return {
          color: "bg-yellow-500",
          text: "On Break",
          textColor: "text-yellow-700 dark:text-yellow-300",
          bgColor: "bg-yellow-50 dark:bg-yellow-950",
        };
      default:
        return {
          color: "bg-gray-500",
          text: "Clocked Out",
          textColor: "text-gray-700 dark:text-gray-300",
          bgColor: "bg-gray-50 dark:bg-gray-950",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="feature-card card-hover-lift animate-fade-in h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Tracking
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1",
              statusConfig.textColor,
              statusConfig.bgColor
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", statusConfig.color)} />
            {statusConfig.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Time Display */}
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-foreground">
            {mounted ? formatTime(currentTime) : "--:--:--"}
          </div>
          <div className="text-sm text-muted-foreground">
            {mounted
              ? currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {status === "clocked-out" && (
            <>
              <Button
                onClick={handleClockIn}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                Clock In
              </Button>
              <Button variant="outline" disabled>
                <Square className="w-4 h-4" />
                Clock Out
              </Button>
            </>
          )}

          {status === "clocked-in" && (
            <>
              <Button
                onClick={handleBreakStart}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <Coffee className="w-4 h-4" />
                Start Break
              </Button>
              <Button
                onClick={handleClockOut}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Clock Out
              </Button>
            </>
          )}

          {status === "on-break" && (
            <>
              <Button
                onClick={handleBreakEnd}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4" />
                End Break
              </Button>
              <Button
                onClick={handleClockOut}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Clock Out
              </Button>
            </>
          )}
        </div>

        {/* Time Summary */}
        {status !== "clocked-out" && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {formatDuration(totalWorkedTime)}
              </div>
              <div className="text-xs text-muted-foreground">Worked Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {formatDuration(totalBreakTime)}
              </div>
              <div className="text-xs text-muted-foreground">Break Time</div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {timeEntries.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">
              Recent Activity
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {timeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-xs p-2 bg-muted/20 rounded"
                >
                  <div className="flex items-center gap-2">
                    {entry.type === "clock-in" && (
                      <Play className="w-3 h-3 text-green-500" />
                    )}
                    {entry.type === "clock-out" && (
                      <Square className="w-3 h-3 text-red-500" />
                    )}
                    {entry.type === "break-start" && (
                      <Coffee className="w-3 h-3 text-yellow-500" />
                    )}
                    {entry.type === "break-end" && (
                      <Play className="w-3 h-3 text-blue-500" />
                    )}
                    <span className="capitalize">
                      {entry.type.replace("-", " ")}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {formatTime(entry.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
          <MapPin className="w-3 h-3" />
          <span>{getCurrentLocation()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
