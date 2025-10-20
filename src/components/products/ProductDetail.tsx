// src/components/products/ProductDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import { useAuthStore } from "../../stores/authStore";

// ✅ Define types for Product and Wishlist items
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

interface WishlistItem {
  product: Product;
}

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, fetchProducts, addToCart, addToWishlist, wishlist } =
    useAppStore();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState<number>(1);

  const product = products.find((p: Product) => p.id === id);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.some(
    (item: WishlistItem) => item.product.id === product.id
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      return;
    }
    try {
      await addToCart(product.id, quantity);
      alert("Added to cart successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to wishlist");
      return;
    }
    try {
      await addToWishlist(product.id);
    } catch (error) {
      console.error(error);
      alert("Failed to add to wishlist");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/products"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.imageUrl || "/api/placeholder/600/600"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">
              ${product.price}
            </span>
            <div className="flex items-center mt-2">
              <span
                className={`text-sm ${
                  product.stock > 10
                    ? "text-green-600"
                    : product.stock > 0
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {product.stock > 10
                  ? "In stock"
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleAddToWishlist}
              disabled={isInWishlist}
              className={`px-6 py-3 rounded-md border flex items-center space-x-2 ${
                isInWishlist
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
              />
              <span>{isInWishlist ? "In Wishlist" : "Wishlist"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
