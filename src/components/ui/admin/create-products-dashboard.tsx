"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { InputForm } from "./slicing";

import { filesApi, productsApi } from "@/utils";

import { CreateProduct, Categories, Helper } from "@/types";

export const CreateProductDashboard = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const imageInputRef = React.useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = React.useState<CreateProduct>({
    name: "",
    description: "",
    notes: "",
    sizes: [],
    price: 0,
    discount: 0,
    category: Categories.MY_LINDWAY,
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

  const createProduct = productsApi.useCreateProducts({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/admin/dashboard/products");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    }));
  };

  const addSize = () => {
    if (helper.sizeInput.trim() && !formData.sizes.find((s) => s.size === helper.sizeInput)) {
      setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, { quantity: 1, size: helper.sizeInput }] }));
      setHelper((prevValue) => ({ ...prevValue, sizeInput: "" }));
    }
  };

  const removeSize = (index: number) => {
    setFormData((prev) => ({ ...prev, sizes: prev.sizes.filter((_, i) => index !== i) }));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((item, i) => (i === index ? { ...item, quantity } : item)),
    }));
  };

  const incrementQuantity = (index: number) => {
    setFormData((prev) => ({ ...prev, sizes: prev.sizes.map((item, i) => (i === index ? { ...item, quantity: item.quantity + 1 } : item)) }));
  };

  const decrementQuantity = (index: number) => {
    setFormData((prev) => ({ ...prev, sizes: prev.sizes.map((item, i) => (i === index ? { ...item, quantity: item.quantity - 1 } : item)) }));
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

    setFormData((prev) => ({ ...prev, images: prev.images.filter((image) => image.path !== subPath) }));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="heading">Add New Product</h1>
        <p className="text-gray">Create a new product for your product item.</p>
      </div>

      <InputForm
        imagesInputRef={imageInputRef}
        addSize={addSize}
        formData={formData}
        handleChange={handleChange}
        handleDeleteImages={handleDeleteImages}
        handleImagesChange={handleImagesChange}
        handleSubmit={handleSubmit}
        isPending={createProduct.isPending}
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
