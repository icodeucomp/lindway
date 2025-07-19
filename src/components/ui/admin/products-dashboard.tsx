"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useAuthStore, useSearchPagination } from "@/hooks";

import { Button, ImageSlider, Pagination } from "@/components";

import { formatIDR, productsApi } from "@/utils";

import { ApiResponse, Categories, Product } from "@/types";

interface ProductsCardProps {
  products: Product[];
  handleDelete: (id: string) => void;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
}

const ProductsCard = ({ products, handleDelete, isPending, isLoading, isError }: ProductsCardProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loader"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
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
    );
  }

  if (isError) {
    return <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">Error loading products. Please try again.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        return (
          <div key={product.id} className="overflow-hidden rounded-lg shadow bg-light">
            <ImageSlider images={product.images.map((image) => image.url)} alt={product.name} showProgressBar={false} showCounter={false} autoPlay={false}>
              {product.isPreOrder && <div className="absolute top-2 left-2 px-2 py-1.5 text-xs text-light rounded-full bg-gray">Pre Order</div>}
              {product.category && <div className={`absolute top-2 right-2 px-2 py-1.5 text-xs text-light rounded-full bg-gray`}>{product.category.replace(/_/g, " ")}</div>}
            </ImageSlider>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold truncate text-gray">{product.name}</h3>
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
                <Button onClick={() => router.push(`/admin/dashboard/products/${product.id}/edit`)} className="flex-1 btn-blue disabled:opacity-50">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(product.id)} disabled={isPending} className={`flex-1 btn-red disabled:opacity-50 ${isPending && "animate-pulse"}`}>
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DashboardProducts = () => {
  const router = useRouter();

  const { isAuthenticated } = useAuthStore();

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange, handleCategoryChange, selectedCategory } = useSearchPagination();

  const {
    data: products,
    isLoading,
    isError,
  } = productsApi.useGetProducts<ApiResponse<Product[]>>({
    key: ["products", searchQuery, selectedCategory, currentPage],
    enabled: isAuthenticated,
    params: { search: searchQuery, limit: 9, category: selectedCategory, page: currentPage },
  });

  const deleteMutation = productsApi.useDeleteProduct({
    invalidateKey: ["products"],
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading">Products</h1>
        <button onClick={() => router.push("/admin/dashboard/products/create")} className="px-4 py-2 text-sm font-medium transition-colors bg-blue-600 rounded-lg text-light hover:bg-blue-700">
          Add New Product
        </button>
      </div>

      <div className="p-4 rounded-lg shadow bg-light">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full px-3 py-2 border rounded-lg border-gray/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border rounded-lg border-gray/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {Object.values(Categories).map((category) => (
              <option key={category} value={category}>
                {category.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProductsCard handleDelete={handleDelete} isLoading={isLoading} isPending={deleteMutation.isPending} products={products?.data || []} isError={isError} />

      <Pagination page={currentPage} setPage={handlePageChange} totalPage={products?.pagination.totalPages || 0} isNumber />
    </div>
  );
};
