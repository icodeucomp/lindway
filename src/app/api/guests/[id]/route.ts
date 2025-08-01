import { NextRequest, NextResponse } from "next/server";

import { authenticate, authorize, prisma } from "@/lib";

import { z } from "zod";

import { UpdateGuestSchema } from "@/types";

// POST - Update guests and carts
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.message) {
    return NextResponse.json({ success: false, message: authenticationResult.message }, { status: authenticationResult.status });
  }
  if (authorizationResult.message) {
    return NextResponse.json({ success: false, message: authorizationResult.message }, { status: authorizationResult.status });
  }

  try {
    const guestId = params.id;
    const body = await request.json();

    const updateData = UpdateGuestSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const existingGuest = await tx.guest.findUnique({
        where: { id: guestId },
        include: { cartItems: { include: { product: { select: { id: true, name: true, price: true, stock: true, sizes: true, isActive: true } } } } },
      });

      if (!existingGuest) {
        throw new Error("Guest not found");
      }

      if (updateData.isPurchased === true && !existingGuest.isPurchased) {
        const productIds = [...Array.from(existingGuest.cartItems.map((item) => item.product.id))];

        await Promise.all(
          productIds.map(async (productId) => {
            const productCartItems = existingGuest.cartItems.filter((item) => item.product.id === productId);
            const product = productCartItems[0].product;

            if (!product.isActive) {
              throw new Error(`Product "${product.name}" is no longer available for purchase.`);
            }

            if (!product.sizes || !Array.isArray(product.sizes)) {
              throw new Error(`Size information is not available for product "${product.name}".`);
            }

            const freshProduct = await tx.product.findUnique({ where: { id: productId }, select: { sizes: true, name: true } });

            if (!freshProduct) {
              throw new Error(`Product "${product.name}" not found.`);
            }

            const updatedSizes = [...(freshProduct.sizes as Array<{ size: string; quantity: number }>)];

            productCartItems.forEach((cartItem) => {
              const sizeIndex = updatedSizes.findIndex((s) => s.size === cartItem.selectedSize);

              if (sizeIndex === -1) {
                throw new Error(`Selected size "${cartItem.selectedSize}" is no longer available for product "${product.name}".`);
              }

              const currentQuantity = updatedSizes[sizeIndex].quantity;

              if (currentQuantity < cartItem.quantity) {
                throw new Error(
                  `Insufficient stock for product "${product.name}" in size "${cartItem.selectedSize}". ` + `Only ${currentQuantity} items available, but ${cartItem.quantity} requested.`
                );
              }

              updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], quantity: currentQuantity - cartItem.quantity };
            });

            const newTotalStock = updatedSizes.reduce((total, size) => total + size.quantity, 0);

            await tx.product.update({ where: { id: productId }, data: { sizes: updatedSizes, stock: newTotalStock } });
          })
        );
      }

      const updatedGuest = await tx.guest.update({
        where: { id: guestId },
        data: { ...updateData, updatedAt: new Date() },
        include: { cartItems: { include: { product: { select: { id: true, name: true, price: true, stock: true, sizes: true } } } } },
      });

      return updatedGuest;
    });

    return NextResponse.json(
      {
        success: true,
        message: `Guest updated successfully. ${result.cartItems.reduce((sum, cart) => sum + cart.quantity, 0)} items in cart.`,
      },
      { status: 201 }
    );
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

// GET - Get one guest and carts
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.message) {
    return NextResponse.json({ success: false, message: authenticationResult.message }, { status: authenticationResult.status });
  }
  if (authorizationResult.message) {
    return NextResponse.json({ success: false, message: authorizationResult.message }, { status: authorizationResult.status });
  }

  try {
    const guestId = params.id;

    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                sizes: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!guest) {
      return NextResponse.json({ success: false, message: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: guest }, { status: 200 });
  } catch (error) {
    console.error(`🚀${new Date()} - Error fetching guest:`, error);
    return NextResponse.json({ success: false, message: "Failed to fetch guest" }, { status: 500 });
  }
}
