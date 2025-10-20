import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ShoppingCart} from "lucide-react";
import { cartService } from "../../services/api";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuthStore();
  const { addTempItem, cartCount } = useCartStore();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(product.id),
    onMutate: () => {
      // Optimistic update - add to temp items immediately
      addTempItem(product.id);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
    },
    onError: () => {
      // Rollback optimistic update
      // removeTempItem(product.id); // You'd implement this
      toast.error("Failed to add to cart");
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCartMutation.mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
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
            ${product.price}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addToCartMutation.isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>
              {addToCartMutation.isLoading ? "Adding..." : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
