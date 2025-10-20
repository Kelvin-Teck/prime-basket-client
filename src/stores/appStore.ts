// src/stores/appStore.ts
import { create } from "zustand";
// import { Product, CartItem, Order, WishlistItem } from "../types";
// import { productsAPI, cartAPI, ordersAPI, wishlistAPI } from "../services/api";
import type { CartItem, Order, Product, WishlistItem } from "../types";

interface AppStore {
  // Products
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;

  // Cart
  cart: CartItem[];
  cartCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;

  // Orders
  orders: Order[];
  fetchOrders: () => Promise<void>;
  createOrder: () => Promise<void>;

  // Wishlist
  wishlist: WishlistItem[];
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (wishlistItemId: string) => Promise<void>;

  // Admin
  createProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  products: [],
  loading: false,
  cart: [],
  cartCount: 0,
  orders: [],
  wishlist: [],

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await productsAPI.getAll();
      set({ products: response.data });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchCart: async () => {
    try {
      const response = await cartAPI.get();
      const cart = response.data;
      const cartCount = cart.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      set({ cart, cartCount });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    try {
      await cartAPI.add(productId, quantity);
      get().fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  },

  updateCartItem: async (cartItemId: string, quantity: number) => {
    try {
      await cartAPI.update(cartItemId, quantity);
      get().fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to update cart:", error);
      throw error;
    }
  },

  removeFromCart: async (cartItemId: string) => {
    try {
      await cartAPI.remove(cartItemId);
      get().fetchCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  },

  fetchOrders: async () => {
    try {
      const response = await ordersAPI.getAll();
      set({ orders: response.data });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  },

  createOrder: async () => {
    const { cart } = get();
    try {
      await ordersAPI.create(cart);
      set({ cart: [], cartCount: 0 });
      get().fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  },

  fetchWishlist: async () => {
    try {
      const response = await wishlistAPI.getAll();
      set({ wishlist: response.data });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  },

  addToWishlist: async (productId: string) => {
    try {
      await wishlistAPI.add(productId);
      get().fetchWishlist(); // Refresh wishlist
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      throw error;
    }
  },

  removeFromWishlist: async (wishlistItemId: string) => {
    try {
      await wishlistAPI.remove(wishlistItemId);
      get().fetchWishlist(); // Refresh wishlist
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      throw error;
    }
  },

  createProduct: async (product: Omit<Product, "id">) => {
    try {
      await productsAPI.create(product);
      get().fetchProducts(); // Refresh products
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  },

  updateProduct: async (id: string, product: Partial<Product>) => {
    try {
      await productsAPI.update(id, product);
      get().fetchProducts(); // Refresh products
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await productsAPI.delete(id);
      get().fetchProducts(); // Refresh products
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  },
}));
