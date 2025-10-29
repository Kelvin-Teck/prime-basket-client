// src/libs/axios.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Added token to request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - unwrap data and handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log("📥 Response from:", response.config.url, response.data);

    // 🟢 CRITICAL FIX: Unwrap nested data structure
    // Your backend returns: { message: "...", data: { actual data } }
    // This unwraps it to: { actual data }
    if (response.data?.data !== undefined) {
      console.log("📦 Unwrapping nested data structure");
      response.data = response.data.data;
    }

    return response;
  },
  (error) => {
    console.error("❌ Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle 401 Unauthorized - auto logout
    if (error.response?.status === 401) {
      console.log("🚪 401 detected, logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("auth-storage");

      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("🌐 Network error - is the backend running?");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
