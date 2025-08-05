"use client";

import React from "react";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventType } from "@/lib/types/event-type";

interface EventStatsProps {
  events: EventType[];
}

export function EventStats({ events }: EventStatsProps) {
  const t = useTranslations("event");
  
  const getEventStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return "upcoming";
    if (today >= start && today <= end) return "ongoing";
    return "completed";
  };

  const upcomingEvents = events.filter(
    (event) => getEventStatus(event.startDate, event.endDate) === "upcoming"
  );

  const ongoingEvents = events.filter(
    (event) => getEventStatus(event.startDate, event.endDate) === "ongoing"
  );

  const completedEvents = events.filter(
    (event) => getEventStatus(event.startDate, event.endDate) === "completed"
  );

  const nextEvent = upcomingEvents.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )[0];

  const getDaysUntilEvent = (startDate: string) => {
    const today = new Date();
    const eventDate = new Date(startDate);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statsCards = [
    {
      title: t("totalEvents"),
      value: events.length,
      icon: Calendar,
      color: "bg-blue-500",
      gradient:
        "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    },
    {
      title: t("upcoming"),
      value: upcomingEvents.length,
      icon: Clock,
      color: "bg-green-500",
      gradient:
        "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
    },
    {
      title: t("ongoing"),
      value: ongoingEvents.length,
      icon: TrendingUp,
      color: "bg-orange-500",
      gradient:
        "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    },
    {
      title: t("completed"),
      value: completedEvents.length,
      icon: Users,
      color: "bg-gray-500",
      gradient:
        "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="border border-gray-200 dark:border-stone-700"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}
                >
                  <stat.icon
                    className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Event Preview */}
      {nextEvent && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t("nextEvent")}: {nextEvent.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(nextEvent.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
              >
                {getDaysUntilEvent(nextEvent.startDate) === 1
                  ? t("tomorrow")
                  : t("inXDays", { days: getDaysUntilEvent(nextEvent.startDate) })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
