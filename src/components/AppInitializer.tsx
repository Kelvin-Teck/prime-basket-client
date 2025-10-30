// src/components/AppInitializer.tsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    console.log("🚀 Starting app initialization...");

    // Give Zustand persist a moment to rehydrate from localStorage
    const initTimer = setTimeout(() => {
      // Now call initialize to check and restore auth if needed
      initializeAuth();

      // Log final auth state
      console.log("📊 Final Auth State:", {
        isAuthenticated,
        hasToken: !!localStorage.getItem("token"),
        hasUser: !!localStorage.getItem("user"),
      });

      // Handle theme preference
      try {
        const preferences = localStorage.getItem("preferences-storage");
        if (preferences) {
          const parsed = JSON.parse(preferences);
          if (parsed.state?.theme === "dark") {
            document.documentElement.classList.add("dark");
          }
        }
      } catch (error) {
        console.warn("⚠️ Failed to load preferences:", error);
      }

      setIsReady(true);
      console.log("✅ App initialization complete!");
    }, 100); // 100ms delay for persist to finish

    return () => clearTimeout(initTimer);
  }, [initializeAuth, isAuthenticated]);

  // Show loading screen while initializing
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
