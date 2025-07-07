import { NextRequest, NextResponse } from "next/server";

import { authenticate, authorize, prisma } from "@/utils";

import { z } from "zod";

import { Categories, CreateProductSchema } from "@/types";

import { calculateDiscountedPrice } from "@/utils";

import { Prisma } from "@/generated/prisma";

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};
    if (category) where.category = category as Categories;
    if (typeof isActive === "string") where.isActive = isActive === "true";
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }, { sku: { contains: search, mode: "insensitive" } }];
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(`🚀${new Date()} - Error get all products:`, error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.error) {
    return NextResponse.json({ success: false, error: authenticationResult.error }, { status: authenticationResult.status });
  }
  if (authorizationResult.error) {
    return NextResponse.json({ success: false, error: authorizationResult.error }, { status: authorizationResult.status });
  }

  try {
    const body = await request.json();

    const discountedPrice = calculateDiscountedPrice(body.price, body.discount);

    const createData = CreateProductSchema.parse(body);

    // Validation
    if (!createData.name || !createData.price || !createData.description || !createData.category || !createData.images || !createData.notes) {
      return NextResponse.json({ success: false, error: "Name, price, category, description, notes and image are required" }, { status: 400 });
    }

    // Check if SKU already exists
    if (createData.sku) {
      const existingProduct = await prisma.product.findUnique({ where: { sku: createData.sku } });

      if (existingProduct) {
        return NextResponse.json({ success: false, error: "Product with this SKU already exists" }, { status: 400 });
      }
    }

    const product = await prisma.product.create({ data: { ...createData, discountedPrice } });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error(`🚀${new Date()} - Error posting product:`, error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
