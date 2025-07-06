import { NextResponse, NextRequest } from "next/server";

import { authenticate, authorize, calculateDiscountedPrice, prisma } from "@/utils";

import { z } from "zod";

import { UpdateProductSchema } from "@/types";

interface Params {
  params: { id: string };
}

// GET - Fetch single product
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(`🚀${new Date()} - Error get product:`, error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request: NextRequest, { params }: Params) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.error) {
    return NextResponse.json({ success: false, error: authenticationResult.error }, { status: authenticationResult.status });
  }
  if (authorizationResult.error) {
    return NextResponse.json({ success: false, error: authorizationResult.error }, { status: authorizationResult.status });
  }
  try {
    const { id } = params;
    const body = await request.json();

    const discountedPrice = calculateDiscountedPrice(body.price, body.discount);

    const validatedData = UpdateProductSchema.parse({ ...body, discountedPrice });

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Check SKU conflict
    if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
      const skuConflict = await prisma.product.findUnique({ where: { sku: validatedData.sku } });

      if (skuConflict) {
        return NextResponse.json({ success: false, error: "SKU already exists" }, { status: 400 });
      }
    }

    // Update product and return the updated data
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error(`🚀${new Date()} - Error editing product:`, error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest, { params }: Params) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.error) {
    return NextResponse.json({ success: false, error: authenticationResult.error }, { status: authenticationResult.status });
  }
  if (authorizationResult.error) {
    return NextResponse.json({ success: false, error: authorizationResult.error }, { status: authorizationResult.status });
  }

  try {
    const { id } = params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(`🚀${new Date()} - Error deleting product:`, error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}
