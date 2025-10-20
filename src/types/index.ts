// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  userId: string;
  productId: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  userId: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  userId: string;
  productId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
