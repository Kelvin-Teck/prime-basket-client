// src/services/api.ts
import { apiClient } from "../libs/axios";
import type { Product } from "../types";

// 🟢 Helper to unwrap your backend's response structure
// const unwrapResponse = <T>(response: any): T => {
//   // Your backend returns: { message, data: { actual data } }
//   // So we need to access response.data.data
//   return response.data?.data || response.data;
// };

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    console.log("📡 Calling login API...");
    const response = await apiClient.post("/auth/login", { email, password });
    console.log("📦 Raw login response:", response.data);

    // Return the response as-is, let the component handle unwrapping
    return response;
  },

  register: async (name: string, email: string, password: string) => {
    console.log("📡 Calling register API...");
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    });
    console.log("📦 Raw register response:", response.data);
    return response;
  },

  logout: async () => {
    console.log("📡 Calling logout API...");
    return apiClient.post("/auth/logout");
  },
};

// Product services
export const productService = {
  getAll: async () => {
    const response = await apiClient.get("/products");
    // Check if data is wrapped
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  create: (product: Omit<Product, "id">) =>
    apiClient.post<Product>("/products", product),

  update: (id: string, product: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, product),

  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

// Cart services
export const cartService = {
  getCart: async () => {
    const response = await apiClient.get("/cart");
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await apiClient.post("/cart", { productId, quantity });
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  updateCart: async (cartItemId: string, data: { quantity: number }) => {
    const response = await apiClient.put(`/cart/${cartItemId}`, data);
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  removeFromCart: async (cartItemId: string) => {
    const response = await apiClient.delete(`/cart/${cartItemId}`);
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
};

// Order services
export const orderService = {
  getAll: async () => {
    const response = await apiClient.get("/orders");
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  create: async (orderData: {
    shippingName: string;
    shippingEmail: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
    shippingCountry: string;
    paymentMethod: string;
    customerNotes: string;
  }) => {
    const response = await apiClient.post("/orders/checkout", orderData);
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
};

// Wishlist services
export const wishlistService = {
  getAll: async () => {
    const response = await apiClient.get("/wishlist");
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  addToWishlist: async (productId: string) => {
    const response = await apiClient.post("/wishlist", { productId });
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },

  removeFromWishlist: async (wishlistItemId: string) => {
    const response = await apiClient.delete(`/wishlist/${wishlistItemId}`);
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
};

// 🟢 ALTERNATIVE: Create a response interceptor to unwrap ALL responses automatically
// Add this to your axios.ts file instead:

/*
apiClient.interceptors.response.use(
  (response) => {
    // If response has data.data structure, unwrap it
    if (response.data?.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
*/
