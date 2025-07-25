import { create } from "zustand";

type GeneralStore = {
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
  setSidebarCollapse: (collapsed: boolean) => void;
};

export const useGeneralStore = create<GeneralStore>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebarCollapse: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapse: (collapsed) => set({ isSidebarCollapsed: collapsed }),
}));
