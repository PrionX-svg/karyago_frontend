"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

export function GitHubContribution() {
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
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const contributionData = useMemo(() => {
    const data = [];
    // Use a fixed seed or a deterministic loop instead of Math.random()
    for (let week = 0; week < 52; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        // Deterministic “random” value between 0-4
        const intensity = (week * 7 + day) % 5;
        weekData.push({
          intensity,
          date: new Date(2024, 0, week * 7 + day + 1),
          contributions: intensity * 2 + intensity,
        });
      }
      data.push(weekData);
    }
    return data;
  }, []);

  const getIntensityClass = (intensity: number) => {
    const classes = [
      "bg-muted/30", // 0 contributions
      "bg-green-200 dark:bg-green-900/40", // 1-2 contributions
      "bg-green-300 dark:bg-green-800/60", // 3-4 contributions
      "bg-green-400 dark:bg-green-700/80", // 5-6 contributions
      "bg-green-500 dark:bg-green-600", // 7+ contributions
    ];
    return classes[intensity] || classes[0];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalContributions = contributionData
    .flat()
    .reduce((sum, day) => sum + day.contributions, 0);

  const currentStreak = () => {
    const flatData = contributionData.flat().reverse();
    let streak = 0;
    for (const day of flatData) {
      if (day.contributions > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <Card className="p-0 feature-card card-hover-lift animate-fade-in overflow-hidden rounded-sm">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            GitHub Activity
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {totalContributions} contributions this year
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Current streak: {currentStreak()} days</span>
          <span>•</span>
          <span>Erik Garnacho</span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Contribution Grid */}
          <div className="relative">
            {/* Month labels */}
            <div className="flex justify-between text-xs text-muted-foreground mb-2 px-1">
              {months.slice(0, 12).map((month, index) => (
                <span
                  key={month}
                  className={`animate-fade-in ${
                    index % 2 === 0 ? "opacity-100" : "opacity-60"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {month}
                </span>
              ))}
            </div>

            {/* Main grid container */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              {/* Day labels */}
              <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2 flex-shrink-0">
                <div className="h-3"></div> {/* Spacer for month labels */}
                {weekDays.map((day, index) => (
                  <div
                    key={day}
                    className={`h-3 flex items-center justify-end pr-1 animate-fade-in ${
                      index % 2 === 1 ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {index % 2 === 1 ? "" : day.slice(0, 3)}
                  </div>
                ))}
              </div>

              {/* Contribution squares */}
              <div className="flex gap-1 min-w-0">
                {contributionData.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-1 flex-shrink-0"
                  >
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`
                          w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer
                          hover:scale-110 hover:ring-2 hover:ring-primary/50 hover:ring-offset-1
                          ${getIntensityClass(day.intensity)}
                        `}
                        title={`${
                          day.contributions
                        } contributions on ${formatDate(day.date)}`}
                        style={{
                          animationDelay: `${(weekIndex * 7 + dayIndex) * 2}ms`,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityClass(level)}`}
                  title={`${
                    level === 0
                      ? "No"
                      : level === 4
                      ? "10+"
                      : `${level * 2}-${level * 2 + 1}`
                  } contributions`}
                />
              ))}
            </div>
            <span>More</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {totalContributions}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {currentStreak()}
              </div>
              <div className="text-xs text-muted-foreground">
                Current Streak
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {Math.max(
                  ...contributionData.flat().map((d) => d.contributions)
                )}
              </div>
              <div className="text-xs text-muted-foreground">Best Day</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
