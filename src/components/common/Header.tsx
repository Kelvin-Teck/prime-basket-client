import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Package, LogOut, User, Menu } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import { useUIStore } from "../../stores/uiStore";
import { useQuery } from "@tanstack/react-query";
import { cartService } from "../../services/api";

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cartCount, setCartCount } = useCartStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync cart count with server data
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart().then((res) => res.data),
    enabled: isAuthenticated,
    onSuccess: (cartItems) => {
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                PrimeBasket
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link
              to="/"
              className={`${
                isActiveRoute("/")
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              } border-b-2 px-1 py-2 text-sm font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`${
                isActiveRoute("/products")
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              } border-b-2 px-1 py-2 text-sm font-medium transition-colors`}
            >
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/cart"
                  className={`${
                    isActiveRoute("/cart")
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 border-transparent"
                  } border-b-2 px-1 py-2 text-sm font-medium transition-colors flex items-center space-x-1`}
                >
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className={`${
                    isActiveRoute("/orders")
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 border-transparent"
                  } border-b-2 px-1 py-2 text-sm font-medium transition-colors`}
                >
                  Orders
                </Link>
                <Link
                  to="/wishlist"
                  className={`${
                    isActiveRoute("/wishlist")
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 border-transparent"
                  } border-b-2 px-1 py-2 text-sm font-medium transition-colors flex items-center space-x-1`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className={`${
                      isActiveRoute("/admin")
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 hover:text-gray-700 border-transparent"
                    } border-b-2 px-1 py-2 text-sm font-medium transition-colors`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>Hello, {user?.name}</span>
                  {user?.role === "ADMIN" && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-gray-600 hover:text-blue-600"
              onClick={toggleSidebar}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-2 text-gray-600 hover:text-blue-600"
              onClick={toggleSidebar}
            >
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/cart"
                  className="block py-2 text-gray-600 hover:text-blue-600 flex items-center justify-between"
                  onClick={toggleSidebar}
                >
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={toggleSidebar}
                >
                  Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                  onClick={toggleSidebar}
                >
                  Wishlist
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="block py-2 text-gray-600 hover:text-blue-600"
                    onClick={toggleSidebar}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
