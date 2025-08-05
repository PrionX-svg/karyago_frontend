"use client";

import React from "react";
import { Calendar, Clock, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventType } from "@/lib/types/event-type";

interface EventCardProps {
  event: EventType;
  onEdit: (event: EventType) => void;
  onDelete: (event: EventType) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const t = useTranslations("event");
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilEvent = (startDate: string) => {
    const today = new Date();
    const eventDate = new Date(startDate);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return t("pastEvent");
    if (diffDays === 0) return t("today");
    if (diffDays === 1) return t("tomorrow");
    return t("inXDays", { days: diffDays });
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
      return {
        status: "upcoming",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      };
    } else if (today >= start && today <= end) {
      return {
        status: "ongoing",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      };
    } else {
      return {
        status: "completed",
        color:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300",
      };
    }
  };

  const eventStatus = getEventStatus(event.startDate, event.endDate);

  return (
    <Card className="p-0 group transition-all duration-200 bg-white dark:bg-stone-900/60 hover:-translate-y-1 border border-gray-100 dark:border-stone-700">
      <CardContent className="p-0">
        <div className="p-6">
          {/* Status Badge and Actions */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}
            >
              {eventStatus.status.charAt(0).toUpperCase() +
                eventStatus.status.slice(1)}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => onEdit(event)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                  {t("editEvent")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(event)}
                  className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("deleteEvent")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Event Photo */}
          {event.photo && (
            <div className="mb-4">
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={event.photo}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Event Title */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
              {event.name}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {getDaysUntilEvent(event.startDate)}
            </p>
          </div>

          {/* Date Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{t("start")}</span>
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {formatDate(event.startDate)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{t("end")}</span>
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {formatDate(event.endDate)}
              </span>
            </div>
          </div>

          {/* Duration Bar */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{t("duration")}</span>
              <span>
                {t("daysCount", {
                  count: Math.ceil(
                    (new Date(event.endDate).getTime() -
                      new Date(event.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
