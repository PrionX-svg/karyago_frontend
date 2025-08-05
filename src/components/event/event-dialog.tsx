"use client";

import React from "react";
import { Calendar } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";
import { EventType } from "@/lib/types/event-type";
import { safeParseDate } from "@/lib/utils/date-utils";
import FileUploader from "../FileUploader";

interface EventDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "edit";
  event?: EventType | null;
  form: {
    name: string;
    startDate: string;
    endDate: string;
    photo?: string | File | null;
  };
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  onPhotoChange?: (file: File | null) => void;
  onDateChange?: (
    field: "startDate" | "endDate",
    date: Date | undefined
  ) => void;
}

export function EventDialog({
  open,
  setOpen,
  mode,
  event,
  form,
  handleInput,
  handleSubmit,
  isLoading = false,
  onPhotoChange,
  onDateChange,
}: EventDialogProps) {
  const t = useTranslations("event");
  const isEditMode = mode === "edit";

  // File state for deferred upload
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    typeof form.photo === "string" ? form.photo : null
  );

  // Convert string dates to Date objects for the DatePicker
  // Use safe date parsing to avoid timezone issues
  const startDate = safeParseDate(form.startDate);
  const endDate = safeParseDate(form.endDate);

  React.useEffect(() => {
    if (open) {
      setPreviewUrl(typeof form.photo === "string" ? form.photo : null);
      setSelectedFile(null);
    }
  }, [open, form.photo]);

  // When file is selected, update preview and notify parent
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    onPhotoChange?.(file);
  };

  // On dialog close, reset file state
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedFile(null);
      setPreviewUrl(typeof form.photo === "string" ? form.photo : null);
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-lg border dark:border-stone-700">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {isEditMode ? t("editEvent") : t("createEvent")}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                {isEditMode
                  ? t("editEventDesc")
                  : t("createEventDesc")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t("eventNameLabel")}
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInput}
                placeholder={t("eventNamePlaceholder")}
                className="w-full"
                required
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-sm font-medium">
                  {t("startDateLabel")}
                </Label>
                <DatePicker
                  date={startDate}
                  onDateChange={(date) => onDateChange?.("startDate", date)}
                  placeholder={t("startDatePlaceholder")}
                  disabled={isLoading}
                  id="start_date"
                  name="start_date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-sm font-medium">
                  {t("endDateLabel")}
                </Label>
                <DatePicker
                  date={endDate}
                  onDateChange={(date) => onDateChange?.("endDate", date)}
                  placeholder={t("endDatePlaceholder")}
                  disabled={isLoading}
                  id="end_date"
                  name="end_date"
                />
              </div>
            </div>
          </div>

          {/* Event Photo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("eventPhotoLabel")}</Label>
            <FileUploader
              value={selectedFile ? undefined : form.photo || null}
              onChange={handleFileChange}
              previewUrl={previewUrl}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? t("updating") : t("creating")}
                </div>
              ) : (
                <>{isEditMode ? t("updateEvent") : t("createEventButton")}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
