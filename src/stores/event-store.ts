import { EventType } from "@/lib/types/event-type";
import { create } from "zustand";

type EventStore = {
  events: EventType[];
  setEvents: (events: EventType[]) => void;
};

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
}));
