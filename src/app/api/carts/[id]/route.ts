import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib";

// POST - Update guests and carts
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guestId = params.id;
    const body = await request.json();

    const { email, fullname, receiptImage, paymentMethod, isPurchased } = body;

    const result = await prisma.$transaction(async (tx) => {
      const existingGuest = await tx.guest.findUnique({
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
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!existingGuest) {
        throw new Error("Guest not found");
      }

      if (isPurchased === true && !existingGuest.isPurchased) {
        const stockUpdates = [];

        for (const cart of existingGuest.cartItems) {
          const product = cart.product;

          if (!product.isActive) {
            throw new Error(`Product "${product.name}" is no longer available for purchase.`);
          }

          if (!product.sizes || !Array.isArray(product.sizes)) {
            throw new Error(`Size information is not available for product "${product.name}".`);
          }

          const sizes = product.sizes as Array<{ size: string; quantity: number }>;
          const sizeIndex = sizes.findIndex((s) => s.size === cart.selectedSize);

          if (sizeIndex === -1) {
            throw new Error(`Selected size "${cart.selectedSize}" is no longer available for product "${product.name}".`);
          }

          const sizeData = sizes[sizeIndex];
          if (sizeData.quantity === 0) {
            throw new Error(`Product "${product.name}" in size "${cart.selectedSize}" is out of stock.`);
          }

          if (sizeData.quantity < cart.quantity) {
            throw new Error(`Insufficient stock for product "${product.name}" in size "${cart.selectedSize}". Only ${sizeData.quantity} items available, but ${cart.quantity} requested.`);
          }

          const updatedSizes = [...sizes];
          updatedSizes[sizeIndex] = {
            ...sizeData,
            quantity: sizeData.quantity - cart.quantity,
          };

          const newTotalStock = updatedSizes.reduce((total, size) => total + size.quantity, 0);

          await tx.product.update({
            where: { id: product.id },
            data: {
              sizes: updatedSizes,
              stock: newTotalStock,
            },
          });

          stockUpdates.push({
            productId: product.id,
            productName: product.name,
            size: cart.selectedSize,
            quantityPurchased: cart.quantity,
            remainingQuantityForSize: updatedSizes[sizeIndex].quantity,
            remainingTotalStock: newTotalStock,
          });
        }
      }

      const updatedGuest = await tx.guest.update({
        where: { id: guestId },
        data: {
          ...(email && { email }),
          ...(fullname && { fullname }),
          ...(receiptImage && { receiptImage }),
          ...(paymentMethod && { paymentMethod }),
          ...(typeof isPurchased === "boolean" && { isPurchased }),
          updatedAt: new Date(),
        },
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
                },
              },
            },
          },
        },
      });

      return updatedGuest;
    });

    return NextResponse.json(
      {
        success: true,
        message: `Guest updated successfully. ${result.cartItems.length} items in cart.`,
        guest: result,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`🚀${new Date()} - Error updating guest:`, error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error(`🚀${new Date()} - Error updating guest:`, error);
    return NextResponse.json({ success: false, message: "An unknown error occurred" }, { status: 500 });
  }
}

// GET - Get one guest and carts
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
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

    return NextResponse.json(
      {
        success: true,
        guest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`🚀${new Date()} - Error fetching guest:`, error);
    return NextResponse.json({ success: false, message: "Failed to fetch guest" }, { status: 500 });
  }
}
