import { NextResponse, NextRequest } from "next/server";

import { authenticate, authorize, prisma, redis } from "@/lib";

import { calculateDiscountedPrice } from "@/utils";

import { z } from "zod";

import { UpdateProductSchema } from "@/types";

interface Params {
  params: { id: string };
}

const CACHE_TTL = 600;
const CACHE_PREFIX = "product";

// GET - Fetch single product
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const cacheKey = `${CACHE_PREFIX}:${id}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return NextResponse.json({ ...parsedData, cached: true });
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      const notFoundResponse = { success: false, message: "Product not found", cached: false };
      await redis.setex(cacheKey, 60, JSON.stringify(notFoundResponse));
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const responseData = { success: true, data: product, cached: false };

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(responseData));

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when get product:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request: NextRequest, { params }: Params) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.message) {
    return NextResponse.json({ success: false, message: authenticationResult.message }, { status: authenticationResult.status });
  }
  if (authorizationResult.message) {
    return NextResponse.json({ success: false, message: authorizationResult.message }, { status: authorizationResult.status });
  }

  try {
    const { id } = params;
    const body = await request.json();

    const discountedPrice = calculateDiscountedPrice(body.price, body.discount);

    const updateData = UpdateProductSchema.parse({ ...body, discountedPrice });

    const totalStock = updateData.sizes?.reduce((sum, sizeObj) => sum + sizeObj.quantity, 0) || 0;

    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    if (totalStock <= 0) {
      return NextResponse.json({ success: false, message: "Total stock must be greater than zero" }, { status: 400 });
    }

    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const skuConflict = await prisma.product.findUnique({ where: { sku: updateData.sku } });

      if (skuConflict) {
        return NextResponse.json({ success: false, message: "SKU already exists" }, { status: 400 });
      }
    }

    await prisma.product.update({
      where: { id },
      data: { ...updateData, stock: totalStock },
    });

    return NextResponse.json({ success: true, message: "Product has been updated successfully" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`🚀${new Date()} - Error when updating product:`, error.errors);
      return NextResponse.json({ success: false, message: error.errors }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when updating product:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest, { params }: Params) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.message) {
    return NextResponse.json({ success: false, error: authenticationResult.message }, { status: authenticationResult.status });
  }
  if (authorizationResult.message) {
    return NextResponse.json({ success: false, error: authorizationResult.message }, { status: authorizationResult.status });
  }

  try {
    const { id } = params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when deleting product:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
