import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesStore {
  theme: "light" | "dark";
  language: string;
  currency: string;
  recentlyViewed: string[]; // product IDs

  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: string) => void;
  setCurrency: (currency: string) => void;
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      language: "en",
      currency: "USD",
      recentlyViewed: [],

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),

      addToRecentlyViewed: (productId: string) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter(
            (id) => id !== productId
          );
          const newRecentlyViewed = [productId, ...filtered].slice(0, 10); // Keep last 10
          return { recentlyViewed: newRecentlyViewed };
        }),

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: "preferences-storage",
    }
  )
);
