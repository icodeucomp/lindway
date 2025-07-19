"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/hooks";

import { Button } from "@/components";

import { formatIDR, productsApi } from "@/utils";

import { ApiResponse, Product } from "@/types";

export const MainDashboard = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const { data: products, isLoading } = productsApi.useGetProducts<ApiResponse<Product[]>>({
    key: ["products"],
    enabled: isAuthenticated,
    params: { limit: 999999999 },
  });

  return (
    <div className="space-y-6">
      <div className="overflow-hidden bg-light rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="mb-4 text-2xl font-bold text-darker-gray">Welcome back, {user?.username}!</h1>
          <p className="text-darker-gray">Here&apos;s an overview dashboard of lindway.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="overflow-hidden bg-light rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
                  <svg className="w-5 h-5 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray">{isLoading ? "..." : products?.data.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-light rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg">
                  <svg className="w-5 h-5 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray truncate">Total Items Sold</dt>
                  <dd className="text-lg font-medium text-gray">{formatIDR(products?.data.reduce((sum, product) => sum + Number(product.price), 0) || 0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-light rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-lg">
                  <svg className="w-5 h-5 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray truncate">Total Stock</dt>
                  <dd className="text-lg font-medium text-gray">{products?.data.reduce((sum, product) => sum + (product.stock || 0), 0) || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium leading-6 text-gray">Quick Actions</h3>
          <div className="flex gap-4 text-light">
            <Button onClick={() => router.push("/admin/dashboard/products")} className="font-medium bg-blue-600 rounded-lg hover:bg-blue-700">
              Manage Products
            </Button>
            <Button onClick={() => router.push("/admin/dashboard/products/create")} className="font-medium bg-green-600 rounded-lg hover:bg-green-700">
              Add New Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
