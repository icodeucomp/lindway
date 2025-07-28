"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/hooks";

import { Button } from "@/components";

import { guestsApi, formatIDR, productsApi } from "@/utils";

import { ApiResponse, Guest, Product } from "@/types";

const months = [
  { value: "all", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const years = [
  { value: "all", label: "All Years" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030" },
];

export const MainDashboard = () => {
  const [selectedMonth, setSelectedMonth] = React.useState<string>("all");
  const [selectedYear, setSelectedYear] = React.useState<string>("all");

  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const { data: products, isLoading: loadProducts } = productsApi.useGetProducts<ApiResponse<Product[]>>({
    key: ["products", selectedMonth, selectedYear],
    enabled: isAuthenticated,
    params: { limit: 999999999, month: selectedMonth, year: selectedYear },
  });

  const { data: guests, isLoading: loadGuests } = guestsApi.useGetGuests<ApiResponse<Guest[]>>({
    key: ["guests", selectedMonth, selectedYear],
    enabled: isAuthenticated,
    params: { limit: 999999999, month: selectedMonth, year: selectedYear },
  });

  const totalStock = loadProducts ? "..." : products?.data.reduce((sum, product) => sum + (product.stock || 0), 0) || 0;

  const totalPendingOrders = loadGuests ? "..." : guests?.data.filter((guest) => guest.isPurchased === false).length || 0;

  const totalSuccessOrders = loadGuests ? "..." : guests?.data.filter((guest) => guest.isPurchased === true).length || 0;

  const totalProducts = loadProducts ? "..." : products?.pagination.total || 0;

  const totalGuests = loadGuests ? "..." : guests?.pagination.total || 0;

  const totalPurchased = loadGuests ? "..." : formatIDR(guests?.data.reduce((sum, guest) => sum + guest.totalPurchased, 0) || 0);

  const totalItemsSold = loadGuests ? "..." : guests?.data.reduce((sum, guest) => sum + guest.totalItemsSold, 0) || 0;

  const getDateRangeText = () => {
    if (selectedMonth === "all" && selectedYear === "all") return "All Time";
    if (selectedMonth === "all") return selectedYear;
    if (selectedYear === "all") return months.find((m) => m.value === selectedMonth)?.label;
    return `${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`;
  };

  const cards = [
    {
      title: "Pending Orders",
      value: totalPendingOrders,
      icon: (
        <svg className="size-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-orange-500",
    },
    {
      title: "Success Orders",
      value: totalSuccessOrders,
      icon: (
        <svg className="size-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-green-500",
    },
    {
      title: "Total Guests",
      value: totalGuests,
      icon: (
        <svg className="size-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      bgColor: "bg-pink-500",
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: (
        <svg className="size-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: "bg-blue-500",
    },
    {
      title: "Total Revenue",
      value: totalPurchased,
      icon: (
        <svg className="size-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      bgColor: "bg-green-500",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: (
        <svg className="size-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      bgColor: "bg-purple-500",
    },
    {
      title: "Items Sold",
      value: totalItemsSold,
      icon: (
        <svg className="size-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgColor: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-light rounded-lg shadow flex justify-between items-center px-4 py-5 sm:p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-darker-gray">Welcome back, {user?.username}!</h1>
          <p className="text-darker-gray">Here&apos;s an overview dashboard of lindway.</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray">Month:</label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="input-form">
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray">Year:</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="input-form">
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="py-1.5 text-sm text-gray">
            <span className="font-medium">Current Period:</span> {getDateRangeText()}
            {(selectedMonth !== "all" || selectedYear !== "all") && (
              <button
                onClick={() => {
                  setSelectedMonth("all");
                  setSelectedYear("all");
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <div key={index} className="overflow-hidden bg-light rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`flex items-center justify-center size-12 rounded-lg ${card.bgColor}`}>{card.icon}</div>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="font-semibold text-gray truncate">{card.title}</dt>
                    <dd className="text-xl font-medium text-gray">{card.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-light rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium leading-6 text-gray">Quick Actions</h3>
          <div className="flex gap-4 text-light">
            <Button onClick={() => router.push("/admin/dashboard/products")} className="btn-blue">
              Manage Products
            </Button>
            <Button onClick={() => router.push("/admin/dashboard/products/create")} className="btn-green">
              Add New Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
