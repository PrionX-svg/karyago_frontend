"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Generate realistic attendance data for a full year based on patterns
const generateYearAttendanceData = (year: number) => {
  const data = [];
  const startDate = new Date(year, 0, 1); // January 1st
  const endDate = new Date(year, 11, 31); // December 31st

  // Define holidays and special dates
  const holidays = [
    new Date(year, 0, 1), // New Year's Day
    new Date(year, 0, 15), // MLK Day (3rd Monday)
    new Date(year, 1, 19), // Presidents Day (3rd Monday)
    new Date(year, 4, 27), // Memorial Day (last Monday)
    new Date(year, 6, 4), // Independence Day
    new Date(year, 8, 2), // Labor Day (1st Monday)
    new Date(year, 9, 14), // Columbus Day (2nd Monday)
    new Date(year, 10, 11), // Veterans Day
    new Date(year, 10, 28), // Thanksgiving (4th Thursday)
    new Date(year, 10, 29), // Black Friday
    new Date(year, 11, 25), // Christmas
    new Date(year, 11, 31), // New Year's Eve
  ];

  // Define vacation periods (common vacation times)
  const vacationPeriods = [
    { start: new Date(year, 11, 23), end: new Date(year, 11, 30) }, // Christmas week
    { start: new Date(year, 6, 1), end: new Date(year, 6, 7) }, // July 4th week
    { start: new Date(year, 7, 15), end: new Date(year, 7, 22) }, // Summer vacation
    { start: new Date(year, 3, 8), end: new Date(year, 3, 12) }, // Spring break
  ];

  // Define sick leave periods (realistic patterns)
  const sickDays = [
    new Date(year, 1, 15), // Winter flu
    new Date(year, 1, 16),
    new Date(year, 3, 8), // Spring cold
    new Date(year, 9, 22), // Fall illness
    new Date(year, 11, 5), // Winter illness
  ];

  // Performance patterns throughout the year
  const getPerformanceMultiplier = (date: Date) => {
    const month = date.getMonth();

    // January: New Year motivation boost
    if (month === 0) return 1.2;

    // February-March: Winter blues, slightly lower performance
    if (month === 1 || month === 2) return 0.9;

    // April-May: Spring energy boost
    if (month === 3 || month === 4) return 1.1;

    // June-August: Summer consistency
    if (month >= 5 && month <= 7) return 1.0;

    // September: Back to work energy
    if (month === 8) return 1.15;

    // October-November: Steady performance
    if (month === 9 || month === 10) return 1.05;

    // December: Holiday season, mixed performance
    if (month === 11) return 0.95;

    return 1.0;
  };

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateStr = date.toISOString().split("T")[0];

    let level = 0;
    let hours = 0;
    let status = "Weekend";

    if (!isWeekend) {
      const isHoliday = holidays.some(
        (holiday) => holiday.toDateString() === date.toDateString()
      );

      const isVacation = vacationPeriods.some(
        (period) => date >= period.start && date <= period.end
      );

      const isSickDay = sickDays.some(
        (sickDay) => sickDay.toDateString() === date.toDateString()
      );

      if (isHoliday) {
        level = 0;
        hours = 0;
        status = "Holiday";
      } else if (isVacation) {
        level = 0;
        hours = 0;
        status = "Vacation";
      } else if (isSickDay) {
        level = 0;
        hours = 0;
        status = "Sick Leave";
      } else {
        // Regular work day - determine performance based on patterns
        const performanceMultiplier = getPerformanceMultiplier(date);
        const basePerformance = 0.85; // Base 85% good performance
        const adjustedPerformance = basePerformance * performanceMultiplier;

        // Monday blues - slightly more likely to be late
        const isMondayBlues = dayOfWeek === 1 && adjustedPerformance < 0.9;

        // Friday energy - more likely to stay late or leave early
        const isFriday = dayOfWeek === 5;

        // Month-end crunch time
        const isMonthEnd = date.getDate() >= 28;

        if (
          adjustedPerformance >= 1.1 ||
          (isMonthEnd && adjustedPerformance >= 0.95)
        ) {
          // High performance day - overtime
          level = 4;
          hours = 8.5 + (adjustedPerformance - 1.0) * 3;
          status = "Overtime";
        } else if (adjustedPerformance >= 0.95 && !isMondayBlues) {
          // Good performance day - on time
          level = 3;
          hours = 8 + (adjustedPerformance - 0.95) * 2;
          status = "On Time";
        } else if (
          adjustedPerformance >= 0.8 ||
          (isFriday && adjustedPerformance >= 0.75)
        ) {
          // Decent day but some issues
          if (isFriday && date.getDate() % 3 === 0) {
            // Friday early leave (deterministic pattern)
            level = 2;
            hours = 6 + adjustedPerformance * 1.5;
            status = "Early Leave";
          } else {
            // Regular partial day
            level = 2;
            hours = 6.5 + adjustedPerformance * 2;
            status = "Partial Day";
          }
        } else if (adjustedPerformance >= 0.6 || isMondayBlues) {
          // Late arrival
          level = 1;
          hours = 7 + adjustedPerformance * 1.5;
          status = "Late Arrival";
        } else {
          // Poor performance day - absent (very rare)
          level = 0;
          hours = 0;
          status = "Absent";
        }

        // Round hours to 1 decimal place
        hours = Math.round(hours * 10) / 10;
      }
    }

    data.push({
      date: dateStr,
      level,
      hours,
      status,
      isWeekend,
      dayOfWeek,
      isHoliday: holidays.some((h) => h.toDateString() === date.toDateString()),
      isVacation: vacationPeriods.some((p) => date >= p.start && date <= p.end),
    });
  }

  return data;
};

const getIntensityClass = (
  level: number,
  isWeekend: boolean,
  status: string
) => {
  if (isWeekend) {
    return "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800";
  }

  // Special handling for holidays and vacation
  if (status === "Holiday") {
    return "bg-blue-100 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/50";
  }

  if (status === "Vacation") {
    return "bg-purple-100 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900/50";
  }

  if (status === "Sick Leave") {
    return "bg-pink-100 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/50 hover:bg-pink-200 dark:hover:bg-pink-900/50";
  }

  switch (level) {
    case 0:
      return "bg-red-100 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/50";
    case 1:
      return "bg-orange-100 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-900/50";
    case 2:
      return "bg-yellow-100 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/50";
    case 3:
      return "bg-green-200 dark:bg-green-900/40 border-green-300 dark:border-green-800/60 hover:bg-green-300 dark:hover:bg-green-800/60";
    case 4:
      return "bg-green-400 dark:bg-green-700/70 border-green-500 dark:border-green-600/80 hover:bg-green-500 dark:hover:bg-green-600/80";
    default:
      return "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  }
};

const getStatusColor = (level: number) => {
  switch (level) {
    case 0:
      return "text-red-600 dark:text-red-400";
    case 1:
      return "text-orange-600 dark:text-orange-400";
    case 2:
      return "text-yellow-600 dark:text-yellow-400";
    case 3:
      return "text-green-600 dark:text-green-400";
    case 4:
      return "text-green-700 dark:text-green-300";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AttendanceHeatmap() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Memoize attendance data to prevent recalculation on hover
  const attendanceData = useMemo(
    () => generateYearAttendanceData(selectedYear),
    [selectedYear]
  );

  // Memoize stats calculation to prevent recalculation on hover
  const stats = useMemo(() => {
    const workDays = attendanceData.filter((d) => !d.isWeekend);
    return {
      totalWorkDays: workDays.length,
      presentDays: workDays.filter((d) => d.level > 0).length,
      onTimeDays: workDays.filter((d) => d.level >= 3).length,
      lateDays: workDays.filter((d) => d.level === 1).length,
      absentDays: workDays.filter(
        (d) =>
          d.level === 0 &&
          !d.isHoliday &&
          !d.isVacation &&
          d.status !== "Sick Leave"
      ).length,
      overtimeDays: workDays.filter((d) => d.level === 4).length,
      holidayDays: workDays.filter((d) => d.isHoliday).length,
      vacationDays: workDays.filter((d) => d.isVacation).length,
      sickDays: workDays.filter((d) => d.status === "Sick Leave").length,
      totalHours: workDays.reduce((sum, d) => sum + d.hours, 0),
    };
  }, [attendanceData]);

  const attendanceRate = Math.round(
    (stats.presentDays / stats.totalWorkDays) * 100
  );
  const punctualityRate = Math.round(
    (stats.onTimeDays / stats.presentDays) * 100
  );

  // Create weeks array for the heatmap - memoized to prevent recalculation
  const weeks = useMemo(() => {
    const weeksArray = [];
    const firstDay = new Date(selectedYear, 0, 1);
    const lastDay = new Date(selectedYear, 11, 31);

    // Find the first Sunday of the year (or before)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Find the last Saturday of the year (or after)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const dayData = attendanceData.find((d) => d.date === dateStr);

        week.push({
          date: new Date(currentDate),
          dateStr,
          data: dayData || {
            level: 0,
            hours: 0,
            status: "No Data",
            isWeekend: false,
          },
          isCurrentYear: currentDate.getFullYear() === selectedYear,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeksArray.push(week);
    }

    return weeksArray;
  }, [attendanceData, selectedYear]);

  // Get month labels for the top - memoized
  const monthLabels = useMemo(() => {
    const monthsInYear = [];

    for (let month = 0; month < 12; month++) {
      const date = new Date(selectedYear, month, 1);
      monthsInYear.push({
        name: months[month],
        month: month,
      });
    }

    return monthsInYear;
  }, [selectedYear]);

  return (
    <TooltipProvider>
      <Card className="backdrop-blur-xl bg-card/60 border-border/20 shadow-xl rounded-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Attendance Heatmap
              <Badge className="bg-green-500 text-white">
                {attendanceRate}% Present
              </Badge>
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedYear(selectedYear - 1)}
                className="w-8 h-8 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg min-w-[4rem] text-center">
                {selectedYear}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedYear(selectedYear + 1)}
                disabled={selectedYear >= new Date().getFullYear()}
                className="w-8 h-8 rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="text-center p-3 bg-muted/30 rounded-2xl">
              <div className="text-lg font-bold text-foreground">
                {stats.presentDays}
              </div>
              <div className="text-xs text-muted-foreground">Present Days</div>
            </div>
            <div className="text-center p-3 bg-green-50/50 dark:bg-green-950/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
              <div className="text-lg font-bold text-green-700 dark:text-green-400">
                {stats.onTimeDays}
              </div>
              <div className="text-xs text-green-600 dark:text-green-500">
                On Time
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
              <div className="text-lg font-bold text-orange-700 dark:text-orange-400">
                {stats.lateDays}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-500">
                Late
              </div>
            </div>
            <div className="text-center p-3 bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
              <div className="text-lg font-bold text-red-700 dark:text-red-400">
                {stats.absentDays}
              </div>
              <div className="text-xs text-red-600 dark:text-red-500">
                Absent
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                {stats.holidayDays}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">
                Holidays
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
              <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                {stats.vacationDays}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-500">
                Vacation
              </div>
            </div>
            <div className="text-center p-3 bg-pink-50/50 dark:bg-pink-950/20 rounded-2xl border border-pink-200/50 dark:border-pink-800/50">
              <div className="text-lg font-bold text-pink-700 dark:text-pink-400">
                {stats.sickDays}
              </div>
              <div className="text-xs text-pink-600 dark:text-pink-500">
                Sick Days
              </div>
            </div>
            <div className="text-center p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/50">
              <div className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                {stats.overtimeDays}
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-500">
                Overtime
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">
                Attendance Rate: {attendanceRate}%
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">
                Punctuality Rate: {punctualityRate}%
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium">
                Avg Hours/Day:{" "}
                {stats.presentDays > 0
                  ? (stats.totalHours / stats.presentDays).toFixed(1)
                  : "0.0"}
                h
              </span>
            </div>
          </div>

          {/* Heatmap */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {stats.presentDays} days worked in {selectedYear} •{" "}
                {Math.round(stats.totalHours)} total hours
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></div>
                  <div className="w-3 h-3 rounded-sm bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50"></div>
                  <div className="w-3 h-3 rounded-sm bg-yellow-100 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40 border border-green-300 dark:border-green-800/60"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/70 border border-green-500 dark:border-green-600/80"></div>
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Month labels */}
            <div className="flex gap-1 ml-8">
              {monthLabels.map((month) => (
                <div
                  key={month.name}
                  className="text-xs text-muted-foreground text-center flex-1 min-w-0"
                  style={{ minWidth: "2rem" }}
                >
                  {month.name}
                </div>
              ))}
            </div>

            {/* Day labels and heatmap grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 w-8">
                {days.map((day, index) => (
                  <div
                    key={day}
                    className="h-3 text-xs text-muted-foreground flex items-center"
                  >
                    {index % 2 === 1 ? day : ""}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-1 flex-1 overflow-x-auto w-full justify-between">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => {
                      const isCurrentYear = day.isCurrentYear;
                      const dayData = day.data;

                      return (
                        <Tooltip key={`${weekIndex}-${dayIndex}`}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "w-3 h-3 rounded-sm border cursor-pointer transition-all duration-200 hover:scale-110",
                                isCurrentYear
                                  ? getIntensityClass(
                                      dayData.level,
                                      dayData.isWeekend,
                                      dayData.status
                                    )
                                  : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-30"
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                              <div className="font-semibold">
                                {day.date.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                              {isCurrentYear && (
                                <>
                                  <div
                                    className={cn(
                                      "font-medium",
                                      getStatusColor(dayData.level)
                                    )}
                                  >
                                    {dayData.status}
                                  </div>
                                  {!dayData.isWeekend && dayData.level > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                      {dayData.hours}h worked
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"></div>
              <span className="text-muted-foreground">Weekend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50"></div>
              <span className="text-muted-foreground">Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-purple-100 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50"></div>
              <span className="text-muted-foreground">Vacation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-pink-100 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/50"></div>
              <span className="text-muted-foreground">Sick Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50"></div>
              <span className="text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-orange-100 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50"></div>
              <span className="text-muted-foreground">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-yellow-100 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50"></div>
              <span className="text-muted-foreground">Partial Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40 border border-green-300 dark:border-green-800/60"></div>
              <span className="text-muted-foreground">On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/70 border border-green-500 dark:border-green-600/80"></div>
              <span className="text-muted-foreground">Overtime</span>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-muted/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">
                  Attendance Insights for {selectedYear}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div>
                    • Total work days: {stats.totalWorkDays} days (
                    {Math.round((stats.totalWorkDays / 365) * 100)}% of year)
                  </div>
                  <div>
                    • Average work week: {(stats.totalHours / 52).toFixed(1)}{" "}
                    hours
                  </div>
                  <div>
                    • Work consistency:{" "}
                    {stats.presentDays / stats.totalWorkDays >= 0.95
                      ? "Excellent reliability"
                      : stats.presentDays / stats.totalWorkDays >= 0.9
                      ? "Good attendance"
                      : "Room for improvement"}
                  </div>
                  <div>
                    • Performance pattern:{" "}
                    {stats.overtimeDays > stats.onTimeDays * 0.3
                      ? "High dedication with frequent overtime"
                      : "Consistent standard schedule"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
