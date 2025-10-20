import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
// import { usePreferencesStore } from "../stores/preferenceStore";

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const syncCart = useCartStore((state) => state.syncWithServer);

  useEffect(() => {
    console.log("Initializing app from localStorage...");

    // Initialize all stores (they auto-load from localStorage via persist)
    initializeAuth();

    // Check for theme preference
    const preferences = localStorage.getItem("preferences-storage");
    if (preferences) {
      try {
        const parsed = JSON.parse(preferences);
        if (parsed.state?.theme === "dark") {
          document.documentElement.classList.add("dark");
        }
      } catch (error) {
        console.warn("Failed to parse preferences from localStorage" + error);
      }
    }

    console.log("App initialization complete");
  }, [initializeAuth]);

  return <>{children}</>;
};
