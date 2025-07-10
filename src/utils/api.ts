import axios from "axios";
import { LoginRequest, RegisterRequest, AuthResponse, Product, CreateProduct, EditProduct, ProductImage, ProductsQueryParams } from "@/types";
import { QueryKey, useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";
const GC_TIME = 6 * 60 * 60 * 1000;
const STALE_TIME = 6 * 60 * 60 * 1000;

interface FetchOptions {
  key: QueryKey;
  id?: string;
  params?: ProductsQueryParams;
  gcTime?: number;
  staleTime?: number;
  enabled?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },
};

// Products API
export const productsApi = {
  useGetProducts: <T>({ key, params = {}, gcTime = GC_TIME, staleTime = STALE_TIME, enabled = true }: FetchOptions) => {
    return useQuery<T, Error>({
      queryKey: key,
      queryFn: async () => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.category) searchParams.append("category", params.category);
        if (params.search) searchParams.append("search", params.search);
        if (params.isActive !== undefined) searchParams.append("isActive", params.isActive.toString());
        const { data } = await api.get(`/products?${searchParams.toString()}`);
        return data;
      },
      gcTime,
      staleTime,
      enabled,
    });
  },

  useGetProduct: <T>({ key, id, gcTime = GC_TIME, staleTime = STALE_TIME, enabled = true }: FetchOptions) => {
    return useQuery<T, Error>({
      queryKey: key,
      queryFn: async () => {
        const { data } = await api.get(`/products/${id}`);
        return data;
      },
      gcTime,
      staleTime,
      enabled,
    });
  },

  createProduct: async (data: CreateProduct): Promise<Product> => {
    const response = await api.post("/products", data);
    return response.data.data;
  },

  updateProduct: async (id: string, data: Partial<EditProduct>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const imagesApi = {
  getImages: async (): Promise<ProductImage[]> => {
    const response = await api.get("/images");
    return response.data.data;
  },
  uploadImages: async (files: File | File[], subPath: string): Promise<Omit<ProductImage, "id" | "isActive">[]> => {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", files);
    }
    formData.append("subPath", subPath);
    const response = await api.post("/images/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
  deleteImage: async (subPath: string): Promise<boolean> => {
    const response = await api.post("/images/deletes", { subPath });
    return response.data.data;
  },
};
