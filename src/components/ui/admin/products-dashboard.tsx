"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/hooks";

import { Button, ImageSlider } from "@/components";

import { formatIDR, productsApi } from "@/utils";

import { ApiResponse, Categories, Product } from "@/types";
import { categoryBgColors } from "@/static/categories";

export const DashboardProducts = () => {
  const router = useRouter();

  const { isAuthenticated } = useAuthStore();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  const {
    data: products,
    isLoading,
    isError,
  } = productsApi.useGetProducts<ApiResponse<Product[]>>({
    key: ["products"],
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteProduct,
  });

  const filteredProducts = products?.data.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">Error loading products. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading">Products</h1>
        <button onClick={() => router.push("/admin/dashboard/products/create")} className="px-4 py-2 text-sm font-medium transition-colors bg-blue-600 rounded-lg text-light hover:bg-blue-700">
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-lg shadow bg-light">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {Object.values(Categories).map((category) => (
              <option key={category} value={category}>
                {category.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts?.length === 0 ? (
        <div className="py-12 text-center">
          <svg className="w-12 h-12 mx-auto text-darker-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray">No products</h3>
          <p className="mt-1 text-sm text-gray">Get started by creating a new product.</p>
          <div className="mt-6">
            <Button onClick={() => router.push("/admin/dashboard/products/create")} className="font-medium bg-blue-600 rounded-lg text-light hover:bg-blue-700">
              Add New Product
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts?.map((product) => {
            const bgColor = categoryBgColors[product.category];
            return (
              <div key={product.id} className="overflow-hidden rounded-lg shadow bg-light">
                <ImageSlider images={product.images.map((image) => image.url)} alt={product.name} showProgressBar={false} showCounter={false} autoPlay={false}>
                  {product.isPreOrder && <div className="absolute top-0 left-0 py-2 px-4 bg-gray text-light text-sm">Pre Order</div>}
                </ImageSlider>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold truncate text-gray">{product.name}</h3>
                    <span className={`px-2 py-1 text-xs text-light rounded-full ${bgColor}`}>{product.category.replace("_", " ")}</span>
                  </div>

                  <p className="text-sm text-justify text-gray line-clamp-4">{product.description}</p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold text-dark">{formatIDR(product.discountedPrice)}</p>
                      {product.discount > 0 && <p className="text-sm text-green-600">-{product.discount}%</p>}
                    </div>
                    <p className="text-sm text-gray whitespace-nowrap">Stock: {product.stock || 0}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/dashboard/products/${product.id}/edit`)}
                      className="flex-1 px-3 py-2 text-sm font-medium transition-colors bg-blue-600 rounded-lg text-light hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteMutation.isPending}
                      className="flex-1 px-3 py-2 text-sm font-medium transition-colors bg-red-600 rounded-lg text-light hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
