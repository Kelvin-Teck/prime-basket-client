// src/components/common/EmptyProductsScreen.tsx
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";

interface EmptyProductsScreenProps {
  variant?: "customer" | "admin";
  onCreateProduct?: () => void;
}

export const EmptyProductsScreen: React.FC<EmptyProductsScreenProps> = ({
  variant = "customer",
  onCreateProduct,
}) => {
  if (variant === "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          {/* Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-full p-8">
              <Package className="w-24 h-24 text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            No Products Yet
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start building your inventory by adding your first product. Showcase
            your amazing items to customers!
          </p>

          {/* CTA Button */}
          <button
            onClick={onCreateProduct}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 inline-flex items-center space-x-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create Your First Product</span>
          </button>

          {/* Help Text */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-full p-3 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <p>Add product details</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 rounded-full p-3 mb-2">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <p>Set pricing & stock</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 rounded-full p-3 mb-2">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <p>Start selling!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer variant
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Animated Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gray-100 rounded-full blur-3xl opacity-50"></div>
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-12 inline-block">
              <ShoppingBag className="w-32 h-32 text-gray-400" />
            </div>
            {/* Floating decorative elements */}
            <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-purple-500 rounded-full w-6 h-6 animate-pulse"></div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          No Products Available Yet
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          We're currently setting up our amazing collection. Check back soon for
          incredible products and unbeatable deals!
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Quality Products
            </h3>
            <p className="text-sm text-gray-600">
              Hand-picked items just for you
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Great Prices</h3>
            <p className="text-sm text-gray-600">
              Affordable pricing for everyone
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
            <p className="text-sm text-gray-600">Quick shipping to your door</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            <span>Go to Homepage</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
          >
            Contact Support
          </Link>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Get Notified When We Launch
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to know when products become available!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alternative: Minimal Empty State
export const MinimalEmptyProducts: React.FC = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Products Found
      </h3>
      <p className="text-gray-600 mb-6">
        We couldn't find any products. Try adjusting your filters or check back
        later.
      </p>
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
      >
        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
        Back to Home
      </Link>
    </div>
  );
};

// For filtered/search results with no matches
export const NoSearchResults: React.FC<{ searchQuery?: string }> = ({
  searchQuery,
}) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Package className="w-12 h-12 text-yellow-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Results Found
      </h3>
      <p className="text-gray-600 mb-6">
        {searchQuery ? (
          <>
            We couldn't find any products matching "
            <span className="font-semibold">{searchQuery}</span>"
          </>
        ) : (
          "No products match your current filters."
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
          Clear Filters
        </button>
        <Link
          to="/products"
          className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};
