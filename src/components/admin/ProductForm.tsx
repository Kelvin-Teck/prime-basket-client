// src/pages/admin/ProductForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { productService } from "../../services/api";
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

interface ProductFormProps {
  productId?: string; // If provided, it's edit mode
}

export const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const navigate = useNavigate();
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
    enabled: isEditMode,
  });

  // Populate form when editing
  useState(() => {
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
  });

  const createProductMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create product");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      navigate("/admin/products");
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

  // Handle main image file upload
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

  // Handle additional image files
  const handleAdditionalImageFiles = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    setAdditionalImageFiles((prev) => [...prev, ...files]);

    // Generate previews
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

  // Add image URL to additional images
  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setAdditionalImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setAdditionalImagePreviews((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData for multipart/form-data
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? "Edit Product" : "Create New Product"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

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
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Featured Product
              </label>
            </div>
          </div>

          {/* Main Image Upload */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Main Product Image
            </h2>

            <div className="flex items-center space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUseMainImageUrl(false)}
                className={`px-4 py-2 rounded-md ${
                  !useMainImageUrl
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <Upload className="inline-block w-4 h-4 mr-2" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUseMainImageUrl(true)}
                className={`px-4 py-2 rounded-md ${
                  useMainImageUrl
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <LinkIcon className="inline-block w-4 h-4 mr-2" />
                Use URL
              </button>
            </div>

            {!useMainImageUrl ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageFileChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                  className="w-48 h-48 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Additional Images
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Additional Files
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImageFiles}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            {additionalImagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Additional Images:</p>
                <div className="grid grid-cols-4 gap-4">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProductMutation.isPending
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

