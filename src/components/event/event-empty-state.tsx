"use client";

import React from "react";
import { Calendar, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface EventEmptyStateProps {
  onCreateEvent: () => void;
}

export function EventEmptyState({ onCreateEvent }: EventEmptyStateProps) {
  const t = useTranslations("event");
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed rounded-xl border-orange-300 dark:border-orange-700/50">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="mb-8">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 dark:from-orange-900/20 dark:via-orange-800/20 dark:to-orange-700/20 rounded-full"></div>
            <div className="absolute inset-4 bg-white dark:bg-stone-800 rounded-full shadow-lg flex items-center justify-center">
              <Calendar className="w-12 h-12 text-orange-600 dark:text-orange-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/70 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {t("noEventsYet")}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {t("emptyStateDescription")}
        </p>

        {/* CTA Button */}
        <Button onClick={onCreateEvent}>
          <Plus className="w-5 h-5 mr-2" />
          {t("createFirstEvent")}
        </Button>
      </div>
    </div>
  );
}
