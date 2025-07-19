import { z } from "zod";

export const CategoriesEnum = z.enum(["MY_LINDWAY", "LURE_BY_LINDWAY", "SIMPLY_LINDWAY"]);

// Image Zod Schema
export const ImageSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  url: z.string().url("Must be a valid URL"),
  path: z.string().min(1, "Path is required"),
  size: z.number().int().positive("Size must be positive").nullable().optional(),
  mimeType: z
    .string()
    .regex(/^image\//, "Must be a valid image mime type")
    .nullable()
    .optional(),
  alt: z.string().min(1, "Alt text is required for accessibility"),
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
  price: z.number().min(1, "Product price is required").positive("Price must be positive").multipleOf(0.01),
  category: CategoriesEnum.default("MY_LINDWAY"),
  stock: z.number().int().min(1, "Stock must be positive").default(0),
  sku: z.string().min(1, "Product sku is required"),
  images: z.array(ImageSchema).min(1, "Product images is required, minimal 1 image"),
  discount: z.number().min(0).positive("Discount must be positive"),
  discountedPrice: z.number().min(1).positive("Discounted Price must be positive").multipleOf(0.01).optional(),
  productionNotes: z.string().default("").optional(),
  isPreOrder: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z.date().optional(),
});

// Product creation schema (without auto-generated fields)
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Product update schema (all fields optional except id)
export const UpdateProductSchema = ProductSchema.partial();
