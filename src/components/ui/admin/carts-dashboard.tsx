"use client";

import * as React from "react";

import { useAuthStore, useSearchPagination } from "@/hooks";

import { GuestsLists } from "./slicing";

import { Button, Pagination } from "@/components";

import { cartsApi } from "@/utils";

import { ApiResponse, Guest } from "@/types";

export const GuestsDashboard = () => {
  const { isAuthenticated } = useAuthStore();

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: guests,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = cartsApi.useGetCarts<ApiResponse<Guest[]>>({
    key: ["carts", searchQuery, currentPage],
    enabled: isAuthenticated,
    params: { search: searchQuery, limit: 9, page: currentPage },
  });

  const updateCarts = cartsApi.useUpdateCarts({});

  const updatePurchase = (id: string) => {
    if (window.confirm("Are you sure you want to update the purchase status?")) {
      updateCarts.mutate({ id, carts: { isPurchased: true } });
    }
  };

  return (
    <>
      <div className="bg-light rounded-lg border border-gray/30 mb-6 px-6 py-4">
        <div className="text-gray space-y-1">
          <h1 className="heading">Guests and Carts Management</h1>
          <p>Manage transactions, track the number of carts per guest, and view guests who have completed their transactions.</p>
        </div>
      </div>

      <div className="p-4 mb-6 rounded-lg shadow bg-light">
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
          {/* <select
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
          </select> */}
          <Button onClick={() => refetch()} className={`btn-blue ${isRefetching && "animate-pulse"}`}>
            Refresh
          </Button>
        </div>
      </div>

      <GuestsLists guests={guests?.data || []} isError={isError} isPending={updateCarts.isPending} isLoading={isLoading} updatePurchase={updatePurchase} />

      <Pagination page={currentPage} setPage={handlePageChange} totalPage={guests?.pagination.totalPages || 0} isNumber />
    </>
  );
};
