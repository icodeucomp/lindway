import axios from "axios";

import { LoginRequest, RegisterRequest, AuthResponse, Product, CreateProduct, EditProduct, ProductImage, ProductsQueryParams, CreateGuest, EditGuest, Guest } from "@/types";

import { QueryKey, useMutation, UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

const API_BASE_URL = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000";
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
  baseURL: `${API_BASE_URL}/api`,
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

  useCreateProducts: ({ invalidateKey, ...mutationOptions }: { invalidateKey: QueryKey } & UseMutationOptions<Product, Error, CreateProduct>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (newItem: CreateProduct) => {
        try {
          const { data } = await api.post("/products", newItem);
          toast.success(data.message || "Success adding data");
          return data.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const responseData = error.response?.data.message;
            if (Array.isArray(responseData)) {
              const errorMessages = responseData.map((err, index) => `${index + 1}. ${err.message}`).join("\n");
              throw new Error(errorMessages);
            } else {
              throw new Error(responseData || "An error occurred");
            }
          }
          throw new Error("An unexpected error occurred");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      },
      ...mutationOptions,
    });
  },

  useUpdateProduct: ({ invalidateKey, ...mutationOptions }: { invalidateKey: QueryKey } & UseMutationOptions<Product, Error, { id: string; updatedItem: EditProduct }>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, updatedItem }: { id: string; updatedItem: EditProduct }) => {
        try {
          const { data } = await api.put(`/products/${id}`, updatedItem);
          toast.success(data.message || "Success updating data");
          return data.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const responseData = error.response?.data.message;
            if (Array.isArray(responseData)) {
              const errorMessages = responseData.map((err, index) => `${index + 1}. ${err.message}`).join("\n");
              throw new Error(errorMessages);
            } else {
              throw new Error(responseData || "An error occurred");
            }
          }
          throw new Error("An unexpected error occurred");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      },
      ...mutationOptions,
    });
  },

  useDeleteProduct: ({ invalidateKey, ...mutationOptions }: { invalidateKey: QueryKey } & UseMutationOptions<Product, Error, string>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        try {
          const { data } = await api.delete(`/products/${id}`);
          toast.success(data.message || "Success deleting data");
          return data.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const responseMessage = error.response?.data.message;
            throw new Error(responseMessage || "An error occurred");
          }
          throw new Error("An unexpected error occurred");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      },
      ...mutationOptions,
    });
  },
};

// Images Api
export const imagesApi = {
  uploadImages: async (files: File | File[], subPath: string, onProgress?: (progress: number) => void): Promise<Omit<ProductImage, "id" | "isActive">[]> => {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", files);
    }
    formData.append("subPath", subPath);

    try {
      const response = await api.post("/images/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            onProgress(progress);
          }
        },
        timeout: 300000,
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        throw new Error(`Upload failed: ${errorMessage}`);
      }
      throw error;
    }
  },
  deleteImage: async (subPath: string, onProgress?: (progress: number) => void): Promise<boolean> => {
    try {
      const response = await api.post(
        "/images/deletes",
        { subPath },
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              onProgress(progress);
            }
          },
          timeout: 300000,
        }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        throw new Error(`Delete failed: ${errorMessage}`);
      }
      throw error;
    }
  },
};

// Carts Api
export const cartsApi = {
  useGetCarts: <T>({ key, params = {}, gcTime = GC_TIME, staleTime = STALE_TIME, enabled = true }: FetchOptions) => {
    return useQuery<T, Error>({
      queryKey: key,
      queryFn: async () => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.search) searchParams.append("search", params.search);
        const { data } = await api.get(`/guests?${searchParams.toString()}`);
        return data;
      },
      gcTime,
      staleTime,
      enabled,
    });
  },

  useGetCart: <T>({ key, id, gcTime = GC_TIME, staleTime = STALE_TIME, enabled = true }: FetchOptions) => {
    return useQuery<T, Error>({
      queryKey: key,
      queryFn: async () => {
        const { data } = await api.get(`/guests/${id}`);
        return data;
      },
      gcTime,
      staleTime,
      enabled,
    });
  },

  useCreateCarts: ({ ...mutationOptions }: UseMutationOptions<Guest, Error, CreateGuest>) => {
    return useMutation({
      mutationFn: async (carts: CreateGuest) => {
        try {
          const { data } = await api.post("/guests", carts);
          toast.success(data.message || "Thank you for your purchase!");
          return data.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const responseData = error.response?.data.message;
            if (Array.isArray(responseData)) {
              const errorMessages = responseData.map((err, index) => `${index + 1}. ${err.message}`).join("\n");
              throw new Error(errorMessages);
            } else {
              throw new Error(responseData || "An error occurred");
            }
          }
          throw new Error("An unexpected error occurred");
        }
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      },
      ...mutationOptions,
    });
  },

  useUpdateCarts: ({ ...mutationOptions }: UseMutationOptions<Guest, Error, { id: string; carts: EditGuest }>) => {
    return useMutation({
      mutationFn: async ({ id, carts }: { id: string; carts: EditGuest }) => {
        try {
          const { data } = await api.put(`/guests/${id}`, carts);
          toast.success(data.message || "Success updating transaction");
          return data.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const responseData = error.response?.data.message;
            if (Array.isArray(responseData)) {
              const errorMessages = responseData.map((err, index) => `${index + 1}. ${err.message}`).join("\n");
              throw new Error(errorMessages);
            } else {
              throw new Error(responseData || "An error occurred");
            }
          }
          throw new Error("An unexpected error occurred");
        }
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      },
      ...mutationOptions,
    });
  },

  useDeleteCarts: ({ invalidateKey, ...mutationOptions }: { invalidateKey: QueryKey } & UseMutationOptions<Guest, Error, string>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        try {
          const { data } = await api.delete(`/guests/${id}`);
          toast.success(data.message || "Success deleting transaction");
          return data.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const responseMessage = error.response?.data.message;
            throw new Error(responseMessage || "An error occurred");
          }
          throw new Error("An unexpected error occurred");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast.error(errorMessage);
      },
      ...mutationOptions,
    });
  },
};
