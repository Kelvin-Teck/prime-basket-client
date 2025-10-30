// src/components/admin/ProductFormModal.tsx
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { productService } from "../../services/api";
import { X, Upload, Link as LinkIcon } from "lucide-react";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string; // If provided, it's edit mode
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  productId,
}) => {
  const queryClient = useQueryClient();
  const isEditMode = !!productId;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    costPrice: "",
    stock: "",
    sku: "",
    categoryId: "",
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  });

  // Image handling state
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [useMainImageUrl, setUseMainImageUrl] = useState(false);

  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Fetch existing product if in edit mode
  const { data: existingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getById(productId!).then((res) => res.data),
    enabled: isEditMode && isOpen,
  });

  // Populate form when editing
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        description: existingProduct.description || "",
        price: existingProduct.price?.toString() || "",
        comparePrice: existingProduct.comparePrice?.toString() || "",
        costPrice: existingProduct.costPrice?.toString() || "",
        stock: existingProduct.stock?.toString() || "",
        sku: existingProduct.sku || "",
        categoryId: existingProduct.categoryId || "",
        isFeatured: existingProduct.isFeatured || false,
        metaTitle: existingProduct.metaTitle || "",
        metaDescription: existingProduct.metaDescription || "",
      });
      setMainImagePreview(existingProduct.imageUrl || "");
      setAdditionalImagePreviews(existingProduct.images || []);
    }
  }, [existingProduct]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        description: "",
        price: "",
        comparePrice: "",
        costPrice: "",
        stock: "",
        sku: "",
        categoryId: "",
        isFeatured: false,
        metaTitle: "",
        metaDescription: "",
      });
      setMainImageFile(null);
      setMainImageUrl("");
      setMainImagePreview("");
      setUseMainImageUrl(false);
      setAdditionalImageFiles([]);
      setAdditionalImageUrls([]);
      setAdditionalImagePreviews([]);
      setNewImageUrl("");
    }
  }, [isOpen]);

  const createProductMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/products/${isEditMode ? productId : ""}`,
        {
          method: isEditMode ?  "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create product");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageFiles = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    setAdditionalImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagePreviews((prev) => [
          ...prev,
          reader.result as string,
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setAdditionalImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setAdditionalImagePreviews((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });

    // Append main image
    if (useMainImageUrl && mainImageUrl) {
      formDataToSend.append("imageUrl", mainImageUrl);
    } else if (mainImageFile) {
      formDataToSend.append("images", mainImageFile);
    }

    // Append additional image files
    additionalImageFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });

    // Append additional image URLs
    if (additionalImageUrls.length > 0) {
      formDataToSend.append(
        "additionalImageUrls",
        JSON.stringify(additionalImageUrls)
      );
    }

    createProductMutation.mutate(formDataToSend);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditMode ? "Edit Product" : "Create New Product"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compare Price
                    </label>
                    <input
                      type="number"
                      name="comparePrice"
                      step="0.01"
                      value={formData.comparePrice}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost Price
                    </label>
                    <input
                      type="number"
                      name="costPrice"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      required
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SKU-001"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Featured Product (Show on homepage)
                  </label>
                </div>
              </div>

              {/* Main Image */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Images
                </h3>

                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setUseMainImageUrl(false)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      !useMainImageUrl
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <Upload className="inline-block w-4 h-4 mr-2" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseMainImageUrl(true)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      useMainImageUrl
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <LinkIcon className="inline-block w-4 h-4 mr-2" />
                    Use URL
                  </button>
                </div>

                {!useMainImageUrl ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageFileChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={mainImageUrl}
                      onChange={(e) => {
                        setMainImageUrl(e.target.value);
                        setMainImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {mainImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={mainImagePreview}
                      alt="Main preview"
                      className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Additional Images (Optional)
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Additional Files
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImageFiles}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Add Image URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {additionalImagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Additional Images:
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Additional ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex space-x-4 pt-6 border-t  bottom-0 bg-white">
                <button
                  type="submit"
                  disabled={createProductMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  {createProductMutation.isPending
                    ? "Saving..."
                    : isEditMode
                    ? "Update Product"
                    : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={createProductMutation.isPending}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
