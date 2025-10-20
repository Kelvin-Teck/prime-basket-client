import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { productService } from "../services/api";
import { cartService } from "../services/api";
import { wishlistService } from "../services/api";
import { useAuthStore } from "../stores/authStore";
import { formatCurrency } from "../libs/utils";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id!).then((res) => res.data),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: (quantity: number) =>
      cartService.addToCart(id!, quantity).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: () =>
      wishlistService.addToWishlist(id!).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist!");
    },
    onError: () => {
      toast.error("Failed to add to wishlist");
    },
  });

  const handleAddToCart = (quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCartMutation.mutate(quantity);
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }
    addToWishlistMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>
          <Link to="/products" className="text-blue-600 hover:text-blue-700">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/products"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.imageUrl}
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
              {formatCurrency(product.price)}
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

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleAddToCart(1)}
              disabled={product.stock === 0 || addToCartMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </span>
            </button>

            <button
              onClick={handleAddToWishlist}
              disabled={addToWishlistMutation.isPending}
              className="px-6 py-3 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <Heart className="h-5 w-5" />
              <span>Wishlist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
