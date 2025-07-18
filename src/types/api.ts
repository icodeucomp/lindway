export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export enum Categories {
  MY_LINDWAY = "MY_LINDWAY",
  SIMPLY_LINDWAY = "SIMPLY_LINDWAY",
  LURE_BY_LINDWAY = "LURE_BY_LINDWAY",
}

export interface Sizes {
  quantity: number;
  size: string;
}

export interface Helper {
  sizeInput: string;
  isUploading: boolean;
  uploadProgress: number;
  isDeleting: boolean;
  deletingProgress: number;
}

export interface ProductImage {
  filename: string;
  originalName: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  notes: string;
  sizes: Sizes[];
  price: number;
  discount: number;
  discountedPrice: number;
  category: Categories;
  stock: number;
  sku: string;
  images: ProductImage[];
  productionNotes: string;
  isPreOrder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProduct {
  name: string;
  description: string;
  notes: string;
  sizes: Sizes[];
  price: number;
  discount: number;
  category: Categories;
  stock: number;
  sku: string;
  images: Omit<ProductImage, "id" | "isActive">[];
  productionNotes: string;
  isPreOrder: boolean;
}

export interface EditProduct {
  name?: string;
  description?: string;
  notes?: string;
  sizes?: Sizes[];
  price?: number;
  discount?: number;
  category?: Categories;
  stock?: number;
  sku?: string;
  images?: Omit<ProductImage, "id" | "isActive">[];
  productionNotes?: string;
  isPreOrder?: boolean;
}

export interface CartItem extends Product {
  productId: string;
  quantity: number;
  selectedSize: string;
  isSelected?: boolean;
}

export interface AddCartItem {
  productId: string;
  quantity: number;
  selectedSize: string;
}

export interface Guest {
  email: string;
  fullname: string;
  receiptImage: ProductImage;
  items: AddCartItem[];
}
