import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { wishlistService } from "../services/api";
import { cartService } from "../services/api";
import { formatCurrency } from "../libs/utils";


const WishlistPage: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: wishlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.getAll().then((res) => res.data),
  });

  const removeMutation = useMutation({
    mutationFn: (wishlistItemId: string) =>
      wishlistService.removeFromWishlist(wishlistItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) =>
      cartService.addToCart(productId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const handleRemove = (wishlistItemId: string) => {
    removeMutation.mutate(wishlistItemId);
  };

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate(productId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-80 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load wishlist</p>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Heart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">Save items you love for later</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <Link to={`/products/${item.product.id}`}>
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full h-48 object-cover"
              />
            </Link>

            <div className="p-4">
              <Link to={`/products/${item.product.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 mb-2">
                  {item.product.name}
                </h3>
              </Link>

              <p className="text-2xl font-bold text-gray-900 mb-4">
                {formatCurrency(item.product.price)}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(item.product.id)}
                  disabled={
                    item.product.stock === 0 || addToCartMutation.isPending
                  }
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removeMutation.isPending}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
