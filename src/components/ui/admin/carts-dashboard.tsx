"use client";

import * as React from "react";

import { useAuthStore, useSearchPagination } from "@/hooks";

import { Button, Img, Modal, Pagination } from "@/components";

import { cartsApi } from "@/utils";

import { FaEye, FaShoppingCart } from "react-icons/fa";

import { paymentMethodColors, paymentMethodLabels } from "@/static/categories";

import { ApiResponse, Guest } from "@/types";

interface CartsListsProps {
  guests: Guest[];
  isLoading: boolean;
  isError: boolean;
  updatePurchase: (guestId: string) => void;
}

const GuestsLists = ({ guests, isLoading, isError, updatePurchase }: CartsListsProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const [selectedGuest, setSelectedGuest] = React.useState<Guest | null>(null);

  const openModal = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loader"></div>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg className="w-12 h-12 mx-auto text-darker-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray">No guests and carts</h3>
      </div>
    );
  }

  if (isError) {
    return <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">Error loading products. Please try again.</div>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg mb-6">
        <table className="w-full">
          <thead className="bg-light border-b border-gray/30 text-gray text-sm font-medium uppercase">
            <tr>
              <th className="px-6 py-4 text-left tracking-wider">Full Name</th>
              <th className="px-6 py-4 text-left tracking-wider">Email</th>
              <th className="px-6 py-4 text-left tracking-wider">Payment Method</th>
              <th className="px-6 py-4 text-left tracking-wider">Purchase Status</th>
              <th className="px-6 py-4 text-left tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-light divide-y divide-gray/30">
            {guests.map((guest) => (
              <tr key={guest.id} className="odd:bg-gray/5">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium">{guest.fullname}</div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="text-sm">{guest.email}</div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentMethodColors[guest.paymentMethod]}`}>{paymentMethodLabels[guest.paymentMethod]}</span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updatePurchase(guest.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${guest.isPurchased ? "bg-green-500" : "bg-red-500"}`}
                      disabled={guest.isPurchased}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${guest.isPurchased ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span className={`text-xs font-medium ${guest.isPurchased ? "text-green-700" : "text-red-700"}`}>{guest.isPurchased ? "Purchased" : "Pending"}</span>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <Button onClick={() => openModal(guest)} className="inline-flex items-center gap-1 btn-outline">
                    <FaEye className="size-4" />
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen((prev) => !prev)}>
        <h3 className="text-2xl font-bold text-gray">Guest Details</h3>

        <div className="mt-4 flex gap-8">
          <div className="space-y-4 w-full max-w-64">
            <div className="text-gray">
              <label className="block text-sm font-medium">Full Name</label>
              <p className="mt-1 text-sm">{selectedGuest?.fullname}</p>
            </div>
            <div className="text-gray">
              <label className="block text-sm font-medium">Email</label>
              <p className="mt-1 text-sm">{selectedGuest?.email}</p>
            </div>
            <div className="text-gray">
              <label className="block text-sm font-medium">Payment Method</label>
              <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentMethodColors[selectedGuest?.paymentMethod as keyof typeof paymentMethodColors]}`}>
                {paymentMethodLabels[selectedGuest?.paymentMethod as keyof typeof paymentMethodLabels]}
              </span>
            </div>
            <div className="text-gray">
              <label className="block text-sm font-medium">Purchase Status</label>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${selectedGuest?.isPurchased ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {selectedGuest?.isPurchased ? "Purchased" : "Not Purchased"}
                </span>
              </div>
            </div>
            <div className="text-gray">
              <label className="block text-sm font-medium mb-2">Receipt Image</label>
              <Img src={selectedGuest?.receiptImage.url || ""} alt={selectedGuest?.receiptImage.alt || ""} className="w-full aspect-square rounded-lg" cover />
            </div>
          </div>
          <div className="flex-1">
            {selectedGuest?.cartItems && selectedGuest?.cartItems.length > 0 && (
              <div className="text-gray">
                <label className="block text-sm font-medium mb-2">
                  <FaShoppingCart className="w-4 h-4 inline mr-1" />
                  Items ({selectedGuest.cartItems.length})
                </label>
                <div className="space-y-2">
                  {selectedGuest.cartItems.map((item, index) => (
                    <div key={index} className="bg-gray/5 p-3 rounded-lg text-gray">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-medium">Product ID:</span>
                          <p className="line-clamp-1">{item.productId}</p>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <p className="line-clamp-1">{item.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium">Size:</span>
                          <p className="line-clamp-1">{item.selectedSize}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export const GuestsDashboard = () => {
  const { isAuthenticated } = useAuthStore();

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: guests,
    isLoading,
    isError,
  } = cartsApi.useGetCarts<ApiResponse<Guest[]>>({
    key: ["carts", searchQuery, currentPage],
    enabled: isAuthenticated,
    params: { search: searchQuery, limit: 9, page: currentPage },
  });

  const updateCarts = cartsApi.useUpdateCarts({
    invalidateKey: ["products", "carts"],
    onSuccess: () => {
      window.location.reload();
    },
  });

  const updatePurchase = (id: string) => {
    if (window.confirm("Are you sure you want to update the purchase status?")) {
      updateCarts.mutate({ id, carts: { isPurchased: true } });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading">Carts and payment request</h1>
      </div>

      <div className="p-4 rounded-lg shadow bg-light mb-6">
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
        </div>
      </div>

      {updateCarts.isPending ? (
        <div className="flex items-center justify-center py-8">
          <div className="loader"></div>
        </div>
      ) : (
        <GuestsLists guests={guests?.data || []} isError={isError} isLoading={isLoading} updatePurchase={updatePurchase} />
      )}

      <Pagination page={currentPage} setPage={handlePageChange} totalPage={guests?.pagination.totalPages || 0} isNumber />
    </>
  );
};
