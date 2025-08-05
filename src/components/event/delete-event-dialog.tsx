"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventType } from "@/lib/types/event-type";

interface DeleteEventDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: EventType | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteEventDialog({
  open,
  setOpen,
  event,
  onConfirm,
  isLoading = false,
}: DeleteEventDialogProps) {
  const t = useTranslations("event");
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-red-900 dark:text-red-100">
                {t("deleteEvent")}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                {t("deleteEventWarning")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            {t("deleteEventConfirmation")}
          </p>

          {event && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("eventNameLabel")}:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">
                    {event.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("duration")}:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("deleting")}
              </div>
            ) : (
              t("deleteEvent")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
