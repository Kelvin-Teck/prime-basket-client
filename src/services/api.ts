import axios from "axios";
import type { Product, CartItem, Order, WishlistItem, User } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Enhanced request interceptor with localStorage fallback
api.interceptors.request.use((config) => {
  // Try to get token from multiple sources
  let token = localStorage.getItem("token");

  if (!token) {
    // Fallback: try to get from Zustand store (for edge cases)
    const authState = localStorage.getItem("auth-storage");
    if (authState) {
      try {
        const parsed = JSON.parse(authState);
        token = parsed.state?.token;
        if (token) {
          localStorage.setItem("token", token); // Sync back to direct storage
        }
      } catch (error) {
        console.warn("Failed to parse auth state from localStorage"+ error);
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Also clear Zustand persisted state
      const authState = localStorage.getItem("auth-storage");
      if (authState) {
        try {
          const parsed = JSON.parse(authState);
          localStorage.setItem(
            "auth-storage",
            JSON.stringify({
              ...parsed,
              state: {
                ...parsed.state,
                user: null,
                token: null,
                isAuthenticated: false,
              },
            })
          );
        } catch {
          localStorage.removeItem("auth-storage");
        }
      }

      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<{ user: User; token: string }>("/auth/register", {
      name,
      email,
      password,
    }),
};

// Product services
export const productService = {
  getAll: () => api.get<Product[]>("/products"),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (product: Omit<Product, "id">) =>
    api.post<Product>("/products", product),
  update: (id: string, product: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Cart services
export const cartService = {
  getCart: () => api.get<CartItem[]>("/cart"),
  addToCart: (productId: string, quantity: number = 1) =>
    api.post<CartItem>("/cart", { productId, quantity }),
  updateCart: (cartItemId: string, data: { quantity: number }) =>
    api.put<CartItem>(`/cart/${cartItemId}`, data),
  removeFromCart: (cartItemId: string) => api.delete(`/cart/${cartItemId}`),
};

// Order services
export const orderService = {
  getAll: () => api.get<Order[]>("/orders"),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  create: (cartItems: CartItem[]) =>
    api.post<Order>("/orders", { items: cartItems }),
};

// Wishlist services
export const wishlistService = {
  getAll: () => api.get<WishlistItem[]>("/wishlist"),
  addToWishlist: (productId: string) =>
    api.post<WishlistItem>("/wishlist", { productId }),
  removeFromWishlist: (wishlistItemId: string) =>
    api.delete(`/wishlist/${wishlistItemId}`),
};

export default api;
