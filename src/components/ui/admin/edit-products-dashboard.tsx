"use client";

import * as React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { Button, Img, NumberInput } from "@/components";

import { useAuthStore } from "@/hooks";

import { FaMinus } from "react-icons/fa";

import { imagesApi, productsApi } from "@/utils";

import { EditProduct, Categories, Product, ApiResponse } from "@/types";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const EditProductDashboard = ({ id }: { id: string }) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuthStore();

  const [formData, setFormData] = React.useState<EditProduct>({
    name: "",
    description: "",
    notes: "",
    size: [],
    price: 0,
    discount: 0,
    category: Categories.MY_LINDWAY,
    stock: 0,
    sku: "",
    images: [],
    isPreOrder: false,
    productionNotes: "",
  });

  const [sizeInput, setSizeInput] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const {
    data: product,
    isLoading,
    error,
  } = productsApi.useGetProduct<ApiResponse<Product>>({
    key: ["product", id],
    id,
    enabled: !!id && isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: (data: EditProduct) => productsApi.updateProduct(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      router.push("/admin/dashboard/products");
    },
    onError: (error: any) => {
      setErrors({
        general: error.response?.data?.message || "Failed to update product. Please try again.",
      });
    },
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.data.name,
        description: product.data.description,
        notes: product.data.notes,
        size: product.data.size,
        price: Number(product.data.price),
        discount: Number(product.data.discount),
        category: product.data.category,
        stock: product.data.stock,
        sku: product.data.sku,
        images: product.data.images,
        isPreOrder: product.data.isPreOrder,
        productionNotes: product.data.productionNotes,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name || !formData.description || !formData.images || !formData.sku || !formData.category || !formData.notes || !formData.size || !formData.price || !formData.stock) {
      setErrors({ general: "Please fill in all required fields" });
      return;
    }

    if (formData.price && formData.price <= 0) {
      setErrors({ price: "Price must be greater than 0" });
      return;
    }

    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.size?.includes(sizeInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        size: [...prev.size!, sizeInput.trim()],
      }));
      setSizeInput("");
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      size: prev.size?.filter((size) => size !== sizeToRemove),
    }));
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const respImages = await imagesApi.uploadImages(files, formData.category!);

    setFormData((prevImages) => ({ ...prevImages, images: respImages }));
  };

  const handleDeleteImages = async (subPath: string) => {
    await imagesApi.deleteImage(subPath);
    setFormData((prevImages) => ({ ...prevImages, images: prevImages.images?.filter((image) => image.path !== subPath) }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">Error loading products. Please try again.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="heading">Edit Product</h1>
        <p className="text-gray">Update product and information item.</p>
      </div>

      <div className="rounded-lg shadow bg-light">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && <div className="px-4 py-3 text-red-600 border border-red-200 rounded-lg bg-red-50">{errors.general}</div>}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray">
                Product Name *
              </label>
              <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="input-form" placeholder="Enter product name" />
            </div>

            <div className="space-y-1">
              <label htmlFor="sku" className="block text-sm font-medium text-gray">
                SKU *
              </label>
              <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} className="input-form" placeholder="Enter SKU" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray">
              Description *
            </label>
            <textarea id="description" name="description" required rows={3} value={formData.description} onChange={handleChange} className="input-form" placeholder="Enter product description" />
          </div>

          <div className="space-y-1">
            <label htmlFor="notes" className="block text-sm font-medium text-gray">
              Notes *
            </label>
            <textarea id="notes" name="notes" rows={2} value={formData.notes} onChange={handleChange} className="input-form" placeholder="Additional notes" />
          </div>

          <div className="space-y-1">
            <label htmlFor="productionNotes" className="block text-sm font-medium text-gray">
              Production Days
            </label>
            <input
              type="text"
              id="productionNotes"
              name="productionNotes"
              value={formData.productionNotes}
              onChange={handleChange}
              className="input-form"
              placeholder="Enter notes for production days"
            />
          </div>

          <div className="space-y-1">
            <label className="block mb-2 text-sm font-medium text-gray">Sizes *</label>
            <div className="flex mb-2 space-x-2">
              <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} className="flex-1 input-form" placeholder="Enter size (e.g., S, M, L, XL)" />
              <Button type="button" onClick={addSize} className="btn-blue">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.size?.map((size, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                  {size}
                  <button type="button" onClick={() => removeSize(size)} className="ml-2 text-blue-600 hover:text-blue-800">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray">
                Price * (IDR)
              </label>
              <NumberInput
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="1"
                value={formData.price === 0 ? "" : formData.price}
                onChange={handleChange}
                className="input-form"
                placeholder="0"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="discount" className="block text-sm font-medium text-gray">
                Discount * (%)
              </label>
              <NumberInput
                type="number"
                id="discount"
                name="discount"
                min="0"
                max="100"
                step="1"
                value={formData.discount === 0 ? "" : formData.discount}
                onChange={handleChange}
                className="input-form"
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="stock" className="block text-sm font-medium text-gray">
                Stock *
              </label>
              <NumberInput type="number" id="stock" name="stock" min="0" value={formData.stock === 0 ? "" : formData.stock} onChange={handleChange} className="input-form" placeholder="0" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray">
              Category *
            </label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className="input-form">
              {Object.values(Categories).map((category) => (
                <option key={category} value={category}>
                  {category.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="image" className="block text-sm font-medium text-gray">
              Images *
            </label>
            <div className="relative flex flex-row items-center overflow-hidden border rounded-lg border-gray/50">
              <input type="file" id="images" onChange={handleImagesChange} hidden accept="image/*" multiple />
              <label htmlFor="images" className="file-label">
                Choose file
              </label>
              <label className="text-sm text-slate-500 whitespace-nowrap">{formData.images?.length} Images</label>
              <small className="pr-2 ms-auto text-gray/70">Max 5mb. (aspect ratio of 1:1)</small>
            </div>
          </div>

          {formData.images && formData.images?.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <button onClick={() => handleDeleteImages(image.path)} type="button" className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary">
                    <FaMinus className="fill-light" />
                  </button>
                  <Img src={image.url} alt={`Selected image ${index + 1}`} className="w-full rounded-lg aspect-square" cover />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="isPreOrder"
              name="isPreOrder"
              type="checkbox"
              checked={formData.isPreOrder}
              onChange={(e) => setFormData((prevForm) => ({ ...prevForm, isPreOrder: e.target.checked }))}
              className="rounded accent-gray size-4"
            />
            <label htmlFor="isPreOrder" className="block text-sm text-gray w-max">
              Enable Pre Order for this product
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={() => router.push("/admin/dashboard/products")} className="btn-outline">
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="btn-blue">
              {updateMutation.isPending ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
