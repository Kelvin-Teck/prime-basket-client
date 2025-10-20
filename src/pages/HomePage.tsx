import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ShoppingBag,
  Star,
  Shield,
  Truck,
  Headphones,
} from "lucide-react";
import { productService } from "../services/api";
import { ProductCard } from "../components/products/ProductCard";
import type { Product } from "../types";

const HomePage: React.FC = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productService.getAll().then((res) => res.data.slice(0, 8)), // Get first 8 products
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to PrimeBasket</h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Discover amazing products at great prices. Quality guaranteed with
            fast delivery and exceptional customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose PrimeBasket
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of products across multiple categories
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Quality</h3>
              <p className="text-gray-600">
                Premium quality products with satisfaction guarantee
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">
                Your data is protected with advanced security
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick shipping with real-time order tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked items just for you
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                >
                  <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredProducts?.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {featuredProducts && featuredProducts.length > 0 && (
                <div className="text-center">
                  <Link
                    to="/products"
                    className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View All Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              )}
            </>
          )}

          {!isLoading &&
            (!featuredProducts || featuredProducts.length === 0) && (
              <div className="text-center py-12">
                <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Products Available
                </h3>
                <p className="text-gray-600">
                  Check back later for amazing products!
                </p>
              </div>
            )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Headphones className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Need Help Shopping?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our customer support team is here to help you with any questions
            about products, orders, or delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
