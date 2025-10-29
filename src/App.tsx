import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
// import { AppInitializer } from "./components/AppInitializer";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage"
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import ProtectedRoute from "./components/auth/ProtectRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrderDetailPage from "./pages/OrderDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import RegisterPage from "./pages/RegisterPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";

// Layout and Pages
// import MainLayout from "./components/layout/MainLayout";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import AdminRoute from "./components/auth/AdminRoute";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import ProductsPage from "./pages/ProductsPage";
// import ProductDetailPage from "./pages/ProductDetailPage";
// import CartPage from "./pages/CartPage";
// import CheckoutPage from "./pages/CheckoutPage";
// import OrdersPage from "./pages/OrdersPage";
// import OrderDetailPage from "./pages/OrderDetailPage";
// import WishlistPage from "./pages/WishlistPage";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminProductsPage from "./pages/admin/AdminProductsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <AppInitializer> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Public routes */}
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/products" element={<AdminProductsPage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      {/* </AppInitializer> */}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
