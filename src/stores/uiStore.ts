import { create } from "zustand";

interface UIStore {
  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  // Modal states
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Loading states for UI
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Search and filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  activeModal: null,
  openModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null }),

  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  filters: {},
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));
