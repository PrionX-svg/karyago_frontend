import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";
import { CreateEventPayload } from "../interfaces/event-interface";

const events = {
  useGetEventsByCompanyUuid: (companyUuid: string) => {
    const [isFetchingEvents, setIsFetchingEvents] = useState(false);
    const fetchEvents = useCallback(async () => {
      setIsFetchingEvents(true);
      if (!companyUuid) {
        return;
      }
      try {
        await api.getEventByCompanyUuid(companyUuid);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setIsFetchingEvents(false);
      }
    }, [companyUuid]);
    useEffect(() => {
      fetchEvents().catch((error) => console.error(error));
    }, [fetchEvents]);
    return { fetchEvents, isFetchingEvents };
  },
  useCreateEvent: () => {
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const createEvent = useCallback(async (eventData: CreateEventPayload) => {
      setIsCreatingEvent(true);
      if (!eventData) {
        return;
      }
      try {
        return await api.createEventByCompanyUuid(eventData);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setIsCreatingEvent(false);
      }
    }, []);
    return { createEvent, isCreatingEvent };
  },
  useUpdateEvent: () => {
    const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
    const updateEvent = useCallback(
      async (eventUuid: string, eventData: CreateEventPayload) => {
        setIsUpdatingEvent(true);
        if (!eventUuid || !eventData) {
          return;
        }
        try {
          return await api.updateEventByUuid(eventUuid, eventData);
        } catch (error) {
          return Promise.reject(error);
        } finally {
          setIsUpdatingEvent(false);
        }
      },
      []
    );
    return { updateEvent, isUpdatingEvent };
  },
  useDeleteEvent: () => {
    const [isDeletingEvent, setIsDeletingEvent] = useState(false);
    const deleteEvent = useCallback(async (eventUuid: string) => {
      setIsDeletingEvent(true);
      if (!eventUuid) {
        return;
      }
      try {
        return await api.deleteEventByUuid(eventUuid);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setIsDeletingEvent(false);
      }
    }, []);
    return { deleteEvent, isDeletingEvent };
  },
};

export default events;
