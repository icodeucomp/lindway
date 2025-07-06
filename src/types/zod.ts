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

export const ProductSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Product name is required"),
  description: z.string(),
  notes: z.string(),
  size: z.array(z.string()).default([]),
  price: z.number().positive("Price must be positive").multipleOf(0.01),
  discount: z.number().min(0),
  discountedPrice: z.number().positive("Price must be positive").multipleOf(0.01).optional(),
  category: CategoriesEnum.default("MY_LINDWAY"),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
  productionNotes: z.string().default("").optional(),
  isPreOrder: z.boolean().default(false),
  sku: z.string(),
  isActive: z.boolean().default(true),
  images: z.array(ImageSchema).optional().default([]),
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
