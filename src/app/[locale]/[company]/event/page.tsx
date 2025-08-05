"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeFormatDate } from "@/lib/utils/date-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import events from "@/lib/queries/event-queries";
import { EventCard } from "@/components/event/event-card";
import { EventDialog } from "@/components/event/event-dialog";
import { DeleteEventDialog } from "@/components/event/delete-event-dialog";
import { EventSkeletonGrid } from "@/components/event/event-skeleton";
import { EventEmptyState } from "@/components/event/event-empty-state";
import { EventStats } from "@/components/event/event-stats";
import { EventType } from "@/lib/types/event-type";
import { useEventStore } from "@/stores/event-store";
import { decrypt } from "@/lib/encrypt";
import { useTranslations } from "next-intl";

const EventsPage = () => {
  // Translation hook
  const t = useTranslations("event");

  // State management
  const [decryptedUuid, setDecryptedUuid] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    photo: "" as string | File,
  });

  // Store data
  const eventsList = useEventStore((state) => state.events);

  // Hooks
  const { isFetchingEvents } = events.useGetEventsByCompanyUuid(decryptedUuid);
  const { createEvent, isCreatingEvent } = events.useCreateEvent();
  const { updateEvent, isUpdatingEvent } = events.useUpdateEvent();
  const { deleteEvent, isDeletingEvent } = events.useDeleteEvent();

  // Initialize component
  useEffect(() => {
    const fetchData = async () => {
      setHasMounted(true);
      const uuid = localStorage.getItem("atem");
      if (uuid) {
        const decrypted = await decrypt(uuid);
        setDecryptedUuid(decrypted);
      }
    };
    fetchData();
  }, []);

  if (!hasMounted) {
    return null;
  }

  // Event handlers

  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedEvent(null);
    setForm({ name: "", startDate: "", endDate: "", photo: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (event: EventType) => {
    setDialogMode("edit");
    setSelectedEvent(event);
    setForm({
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      photo: event.photo ?? "",
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (event: EventType) => {
    setSelectedEvent(event);
    setDeleteOpen(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file input for photo
  const handlePhotoChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, photo: file || "" }));
  };

  // Handle date change for DatePicker
  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | undefined
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: safeFormatDate(date),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ensure ISO format for start_date and end_date
    const toISO = (date: string) => {
      if (!date) return "";
      const d = new Date(date);
      return isNaN(d.getTime()) ? date : d.toISOString();
    };

    let photoUrl: string | null = null;
    if (form.photo instanceof File) {
      // Upload file before submit (following update-branch-dialog pattern)
      const formData = new FormData();
      formData.append("file", form.photo);
      formData.append("folder", "event-images");
      try {
        // Await the import and upload before continuing
        const m = await import("@/lib/api/postAPI");
        const res = await m.default(formData, "/upload/");
        if (res.status === 200 && res.data?.url?.file_name) {
          photoUrl = res.data.url.file_name;
        }
      } catch (err) {
        console.error("Photo upload failed:", err);
        // Continue without photo if upload fails
      }
    } else if (typeof form.photo === "string" && form.photo) {
      photoUrl = form.photo;
    }

    const eventData = {
      company_uuid: decryptedUuid,
      name: form.name,
      photo: photoUrl,
      start_date: toISO(form.startDate),
      end_date: toISO(form.endDate),
    };
    try {
      if (dialogMode === "create") {
        await createEvent(eventData);
      } else if (selectedEvent) {
        await updateEvent(selectedEvent.uuid, eventData);
      }
      setDialogOpen(false);
      setForm({ name: "", startDate: "", endDate: "", photo: "" });
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error handling event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await deleteEvent(selectedEvent.uuid);
      setDeleteOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Filter and search logic
  const getEventStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return "upcoming";
    if (today >= start && today <= end) return "ongoing";
    return "completed";
  };

  const filteredEvents = eventsList.filter((event: EventType) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const eventStatus = getEventStatus(event.startDate, event.endDate);
    const matchesStatus =
      statusFilter === "all" || eventStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats for header
  const totalEvents = eventsList.length;
  const upcomingEvents = eventsList.filter(
    (event: EventType) =>
      getEventStatus(event.startDate, event.endDate) === "upcoming"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Enhanced Header */}
      <div className="bg-background">
        <div className="pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-card rounded-xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border dark:border-stone-700">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {t("title")}
                </h1>
                <p className="mt-1 text-gray-600 dark:text-muted-foreground">
                  {t("description")}
                </p>
              </div>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              {t("addEvent")}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {totalEvents > 0 && <EventStats events={eventsList} />}

      {/* Filters and Search */}
      {totalEvents > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-orange-900/20 p-4 rounded-lg border border-gray-100 dark:border-stone-700">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t("filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allEvents")}</SelectItem>
                  <SelectItem value="upcoming">{t("upcoming")}</SelectItem>
                  <SelectItem value="ongoing">{t("ongoing")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("eventsCount", { count: filteredEvents.length, total: totalEvents })}
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="flex-1">
        {isFetchingEvents ? (
          <EventSkeletonGrid />
        ) : totalEvents === 0 ? (
          <EventEmptyState onCreateEvent={openCreateDialog} />
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t("noEventsFound")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("noEventsFoundDesc")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((event: EventType) => (
              <EventCard
                key={event.uuid}
                event={event}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EventDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        mode={dialogMode}
        event={selectedEvent}
        form={form}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
        isLoading={isCreatingEvent || isUpdatingEvent}
        onPhotoChange={handlePhotoChange}
        onDateChange={handleDateChange}
      />

      <DeleteEventDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        event={selectedEvent}
        onConfirm={handleDeleteEvent}
        isLoading={isDeletingEvent}
      />
    </div>
  );
};

export default EventsPage;
