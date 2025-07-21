import { NextRequest, NextResponse } from "next/server";

import { authenticate, authorize, prisma } from "@/lib";
import { Prisma } from "@/generated/prisma";

import { z } from "zod";

import { Categories, CreateProductSchema } from "@/types";

import { calculateDiscountedPrice } from "@/utils";

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

    const where: Prisma.ProductWhereInput = {};
    if (category) where.category = category as Categories;
    if (typeof isActive === "string") where.isActive = isActive === "true";
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json(
      {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when get all products:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

// POST - create product
export async function POST(request: NextRequest) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.message) {
    return NextResponse.json({ success: false, message: authenticationResult.message }, { status: authenticationResult.status });
  }
  if (authorizationResult.message) {
    return NextResponse.json({ success: false, message: authorizationResult.message }, { status: authorizationResult.status });
  }

  try {
    const body = await request.json();

    const discountedPrice = calculateDiscountedPrice(body.price, body.discount);

    const createData = CreateProductSchema.parse(body);

    const totalStock = createData.sizes.reduce((sum, sizeObj) => sum + sizeObj.quantity, 0);

    if (totalStock <= 0) {
      return NextResponse.json({ success: false, message: "Total stock must be greater than zero" }, { status: 400 });
    }

    if (createData.sku) {
      const existingProduct = await prisma.product.findUnique({ where: { sku: createData.sku } });

      if (existingProduct) {
        return NextResponse.json({ success: false, message: "Product with this SKU already exists" }, { status: 400 });
      }
    }

    await prisma.product.create({ data: { ...createData, discountedPrice, stock: totalStock } });

    return NextResponse.json({ success: true, message: "Product has been added successfully" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`🚀${new Date()} - Error when creating product:`, error.errors);
      return NextResponse.json({ success: false, message: error.errors }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when creating product:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
