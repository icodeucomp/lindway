export enum Categories {
  MY_LINDWAY = "MY_LINDWAY",
  SIMPLY_LINDWAY = "SIMPLY_LINDWAY",
  LURE_BY_LINDWAY = "LURE_BY_LINDWAY",
}

export enum PaymentMethods {
  BANK_TRANSFER = "BANK_TRANSFER",
  QRIS = "QRIS",
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  isActive?: boolean;
  isPurchased?: string;
  year?: string;
  month?: string;
  dateFrom?: string;
  dateTo?: string;
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

export interface Files {
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
  stock: number;
  price: number;
  discount: number;
  discountedPrice: number;
  category: Categories;
  sku: string;
  images: Files[];
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
  sku: string;
  images: Files[];
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
  sku?: string;
  images?: Files[];
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
  id: string;
  email: string;
  fullname: string;
  receiptImage: Files;
  whatsappNumber: string;
  address: string;
  totalPurchased: number;
  totalItemsSold: number;
  postalCode: number;
  isMember: boolean;
  instagram: string;
  reference: string;
  isPurchased: boolean;
  paymentMethod: PaymentMethods;
  cartItems: AddCartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuest {
  email: string;
  fullname: string;
  receiptImage?: Files;
  whatsappNumber: string;
  address: string;
  postalCode: number;
  totalPurchased: number;
  totalItemsSold: number;
  isMember: boolean;
  instagram?: string;
  reference?: string;
  isPurchased: boolean;
  paymentMethod: PaymentMethods;
  items: AddCartItem[];
}

export interface EditGuest {
  email?: string;
  fullname?: string;
  receiptImage?: Files;
  whatsappNumber?: string;
  totalPurchased?: number;
  totalItemsSold?: number;
  address?: string;
  postalCode?: number;
  isMember?: boolean;
  instagram?: string;
  reference?: string;
  isPurchased?: boolean;
  paymentMethod?: PaymentMethods;
  items?: AddCartItem[];
}

export interface Parameter {
  id: string;
  shipping: number;
  tax: number;
  taxType: DiscountType;
  promo: number;
  promoType: DiscountType;
  member: number;
  memberType: DiscountType;
  qrisImage: Files;
  video: Files[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateParameter {
  shipping: number;
  tax: number;
  taxType: DiscountType;
  promo: number;
  promoType: DiscountType;
  member: number;
  memberType: DiscountType;
  qrisImage: Files;
  video: Files[];
}

export interface EditParameter {
  shipping?: number;
  tax?: number;
  taxType?: DiscountType;
  promo?: number;
  promoType?: DiscountType;
  member?: number;
  memberType?: DiscountType;
  qrisImage?: Files;
  video?: Files[];
}
