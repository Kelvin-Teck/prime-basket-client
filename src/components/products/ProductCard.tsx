import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { cartService } from "../../services/api";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import { formatCurrency } from "../../libs/utils";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(product.id, 1),
    onMutate: () => {
      // Optimistic update - add to Zustand immediately
      addItem(product.id);
      console.log("🛒 Optimistically added to cart:", product.name);
    },
    onSuccess: () => {
      // Invalidate and refetch cart from server
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`${product.name} added to cart!`);
      console.log("✅ Cart updated on server");
    },
    onError: (error) => {
      console.error("❌ Failed to add to cart:", error);
      toast.error("Failed to add to cart");
      // Note: Zustand state will be synced when cart refetches
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if button is inside Link

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    console.log("🛒 Adding to cart:", product.name);
    addToCartMutation.mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback image if imageUrl fails
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=Product+Image";
          }}
        />
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 10
                ? "bg-green-100 text-green-800"
                : product.stock > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock > 10
              ? "In Stock"
              : product.stock > 0
              ? `${product.stock} left`
              : "Out of Stock"}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addToCartMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
