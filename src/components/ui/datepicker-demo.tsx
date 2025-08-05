"use client";

import React, { useState } from "react";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DatePickerDemo() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>DatePicker Component Demo</CardTitle>
          <CardDescription>
            This demonstrates the DatePicker component using shadcn Calendar and
            Popover.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker
                date={startDate}
                onDateChange={setStartDate}
                placeholder="Select start date"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <DatePicker
                date={endDate}
                onDateChange={setEndDate}
                placeholder="Select end date"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="font-medium mb-2">Selected Dates:</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start Date:{" "}
              {startDate ? startDate.toLocaleDateString() : "Not selected"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              End Date:{" "}
              {endDate ? endDate.toLocaleDateString() : "Not selected"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
