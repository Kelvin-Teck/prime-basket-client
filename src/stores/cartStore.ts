import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  // UI state for cart
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Persisted cart items for offline/quick access
  cartItems: string[]; // product IDs for quick reference
  cartCount: number;

  // Actions
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  syncWithServer: (serverCart: any[]) => void; // Sync with React Query data
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      cartItems: [],
      cartCount: 0,

      addItem: (productId: string) =>
        set((state) => {
          const newItems = [...state.cartItems, productId];
          return {
            cartItems: newItems,
            cartCount: newItems.length,
          };
        }),

      removeItem: (productId: string) =>
        set((state) => {
          const newItems = state.cartItems.filter((id) => id !== productId);
          return {
            cartItems: newItems,
            cartCount: newItems.length,
          };
        }),

      clearCart: () => set({ cartItems: [], cartCount: 0 }),

      syncWithServer: (serverCart: any[]) => {
        const serverItems = serverCart.map((item) => item.product.id);
        const serverCount = serverCart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        set({
          cartItems: serverItems,
          cartCount: serverCount,
        });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartCount: state.cartCount,
      }),
    }
  )
);
