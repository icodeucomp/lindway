"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { InputForm } from "./slicing";

import { useAuthStore } from "@/hooks";

import { filesApi, productsApi } from "@/utils";

import { EditProduct, Categories, Product, ApiResponse, Helper } from "@/types";

export const EditProductDashboard = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const { isAuthenticated } = useAuthStore();

  const [formData, setFormData] = React.useState<EditProduct>({
    name: "",
    description: "",
    notes: "",
    sizes: [],
    price: 0,
    discount: 0,
    category: Categories.MY_LINDWAY,
    stock: 0,
    sku: "",
    images: [],
    isPreOrder: false,
    productionNotes: "",
  });

  const [helper, setHelper] = React.useState<Helper>({
    sizeInput: "",
    isUploading: false,
    uploadProgress: 0,
    deletingProgress: 0,
    isDeleting: false,
  });

  const {
    data: product,
    isLoading,
    error,
  } = productsApi.useGetProduct<ApiResponse<Product>>({
    key: ["product", id],
    id,
    enabled: !!id && isAuthenticated,
  });

  const updateProduct = productsApi.useUpdateProduct({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      router.push("/admin/dashboard/products");
    },
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.data.name,
        description: product.data.description,
        notes: product.data.notes,
        sizes: product.data.sizes,
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

    updateProduct.mutate({ id, updatedItem: formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    }));
  };

  const addSize = () => {
    if (helper.sizeInput.trim() && !formData.sizes?.find((s) => s.size === helper.sizeInput)) {
      setFormData((prev) => ({ ...prev, sizes: [...prev.sizes!, { quantity: 1, size: helper.sizeInput }] }));
      setHelper((prevValue) => ({ ...prevValue, sizeInput: "" }));
    }
  };

  const removeSize = (index: number) => {
    setFormData((prev) => ({ ...prev, sizes: prev.sizes?.filter((_, i) => index !== i) }));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes?.map((item, i) => (i === index ? { ...item, quantity } : item)),
    }));
  };

  const incrementQuantity = (index: number) => {
    setFormData((prev) => ({ ...prev, sizes: prev.sizes?.map((item, i) => (i === index ? { ...item, quantity: item.quantity + 1 } : item)) }));
  };

  const decrementQuantity = (index: number) => {
    setFormData((prev) => ({ ...prev, sizes: prev.sizes?.map((item, i) => (i === index ? { ...item, quantity: item.quantity - 1 } : item)) }));
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setHelper((prev) => ({ ...prev, isUploading: true }));
    setHelper((prev) => ({ ...prev, uploadProgress: 0 }));

    const respImages = await filesApi.uploadImages(files, formData.category!, (progress: number) => {
      setHelper((prev) => ({ ...prev, uploadProgress: progress }));
    });

    setHelper((prev) => ({ ...prev, isUploading: false }));
    setHelper((prev) => ({ ...prev, uploadProgress: 0 }));

    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ...respImages] }));
  };

  const handleDeleteImages = async (subPath: string) => {
    setHelper((prev) => ({ ...prev, isDeleting: true }));
    setHelper((prev) => ({ ...prev, deletingProgress: 0 }));

    await filesApi.delete(subPath, (progress: number) => {
      setHelper((prev) => ({ ...prev, deletingProgress: progress }));
    });

    setHelper((prev) => ({ ...prev, isDeleting: false }));
    setHelper((prev) => ({ ...prev, deletingProgress: 0 }));

    setFormData((prev) => ({ ...prev, images: prev.images?.filter((image) => image.path !== subPath) }));
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

      <InputForm
        addSize={addSize}
        formData={formData}
        handleChange={handleChange}
        handleDeleteImages={handleDeleteImages}
        handleImagesChange={handleImagesChange}
        handleSubmit={handleSubmit}
        isPending={updateProduct.isPending}
        removeSize={removeSize}
        setHelper={setHelper}
        helper={helper}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        handleQuantityChange={handleQuantityChange}
      />
    </div>
  );
};
