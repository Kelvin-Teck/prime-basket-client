import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthState, User } from "../types";

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  register: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
  clearAuthData: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      initialize: () => {
        // This runs automatically thanks to persist middleware
        console.log("Auth store initialized from localStorage");
      },

      login: (user: User, token: string) => {
        // Store in state AND localStorage (via persist)
        set({ user, token, isAuthenticated: true });

        // Also store token in localStorage for API service interceptors
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("User logged in, data persisted to localStorage");
      },

      register: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      },

      logout: () => {
        // Clear both state and localStorage
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("User logged out, localStorage cleared");
      },

      clearAuthData: () => {
        // Manual cleanup for corrupted data
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      },
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
