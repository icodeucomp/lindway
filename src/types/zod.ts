import { z } from "zod";

export const CategoriesEnum = z.enum(["MY_LINDWAY", "LURE_BY_LINDWAY", "SIMPLY_LINDWAY"]);

export const PaymentMethodEnum = z.enum(["BANK_TRANSFER", "QRIS"]);

export const DiscountEnum = z.enum(["PERCENTAGE", "FIXED"]);

export const FileSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  url: z.string().url("Must be a valid URL"),
  path: z.string().min(1, "Path is required"),
  size: z.number().int().positive("Size must be positive").nullable().optional(),
  mimeType: z
    .string()
    .regex(/^(image|video)\//, "Must be a valid image or video mime type")
    .nullable()
    .optional(),
  alt: z.string().min(1, "Alt text is required for accessibility"),
});

export const CartSchema = z.object({
  items: z.array(z.object({ quantity: z.number().int(), selectedSize: z.string(), productId: z.string() })).min(1, "Product images is required, minimal 1 image"),
});

export const SizesSchema = z.object({
  quantity: z.number().min(1, "Quantity is required"),
  size: z.string().min(1, "Size is required"),
});

export const ProductSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  notes: z.string().min(1, "Product notes is required"),
  sizes: z.array(SizesSchema).min(1, "Product sizes is required, minimal 1 size"),
  price: z.number().min(1, "Product price is required").positive("Price must be positive"),
  category: CategoriesEnum.default("MY_LINDWAY"),
  stock: z.number().int().min(1, "Stock must be positive").default(0),
  sku: z.string().min(1, "Product sku is required"),
  images: z.array(FileSchema).min(1, "Product images is required, minimal 1 image"),
  discount: z.number().min(0).positive("Discount must be positive"),
  discountedPrice: z.number().min(1).positive("Discounted Price must be positive").optional(),
  productionNotes: z.string().default("").optional(),
  isPreOrder: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z.date().optional(),
});

export const GuestSchema = z.object({
  id: z.string().cuid().optional(),
  email: z.string().email().min(1, "Email name is required"),
  fullname: z.string().min(1, "Fullname is required"),
  whatsappNumber: z.string().min(1, "Whatsapp number is required"),
  address: z.string().min(1, "Address is required"),
  postalCode: z.number().int().min(1, "Postal code is required"),
  isMember: z.boolean().default(false),
  totalItemsSold: z.number().min(0).positive("Total items sold must be positive"),
  totalPurchased: z.number().min(0).positive("Total purchased must be positive"),
  receiptImage: FileSchema.optional(),
  instagram: z.string().optional(),
  reference: z.string().optional(),
  isPurchased: z.boolean().default(false),
  paymentMethod: PaymentMethodEnum.default("BANK_TRANSFER"),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z.date().optional(),
});

const validateDiscount = (discount: number, discountType: string) => {
  if (discountType === "PERCENTAGE") {
    return discount >= 0 && discount <= 100;
  }
  return discount >= 0;
};

export const ParameterSchema = z.object({
  id: z.string().cuid().optional(),
  shipping: z.number().int("Shipping must be an integer").positive("Shipping must be positive"),
  tax: z.number().min(0, "Tax cannot be negative"),
  taxType: DiscountEnum.default("FIXED"),
  promo: z.number().min(0, "Promo cannot be negative"),
  promoType: DiscountEnum.default("FIXED"),
  member: z.number().min(0, "Member discount cannot be negative"),
  memberType: DiscountEnum.default("FIXED"),
  qrisImage: FileSchema,
  video: z.array(FileSchema).min(1, "Video is required, minimal 1 video"),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z.date().optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = ProductSchema.partial();

export const CreateGuestSchema = GuestSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateGuestSchema = GuestSchema.partial();

export const CreateParameterSchema = ParameterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .refine((data) => validateDiscount(data.tax, data.taxType), {
    message: "Tax percentage cannot exceed 100%",
    path: ["tax"],
  })
  .refine((data) => validateDiscount(data.promo, data.promoType), {
    message: "Promo percentage cannot exceed 100%",
    path: ["promo"],
  })
  .refine((data) => validateDiscount(data.promo, data.promoType), {
    message: "Member discount percentage cannot exceed 100%",
    path: ["member"],
  });

export const UpdateParameterSchema = ParameterSchema.partial()
  .refine((data) => validateDiscount(data.tax || 0, data.taxType || ""), {
    message: "Tax percentage cannot exceed 100%",
    path: ["tax"],
  })
  .refine((data) => validateDiscount(data.promo || 0, data.promoType || ""), {
    message: "Promo percentage cannot exceed 100%",
    path: ["promo"],
  })
  .refine((data) => validateDiscount(data.promo || 0, data.promoType || ""), {
    message: "Member discount percentage cannot exceed 100%",
    path: ["member"],
  });
