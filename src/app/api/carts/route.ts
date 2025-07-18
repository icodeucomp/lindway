import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib";

// GET - Fetch all guests and carts
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const isPurchased = url.searchParams.get("isPurchased");

    const skip = (page - 1) * limit;

    const where = isPurchased !== null ? { isPurchased: isPurchased === "true" } : {};

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.guest.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: guests,
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
    console.error(`🚀${new Date()} - Error when get all guests:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

// POST - Create guests and carts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullname, receiptImage, paymentMethod, items } = body;

    if (!email || !fullname || !paymentMethod || !receiptImage) {
      return NextResponse.json({ success: false, message: "Email, fullname, payment method and receiptImage are required." }, { status: 400 });
    }

    if (!receiptImage || typeof receiptImage !== "object") {
      return NextResponse.json({ success: false, message: "receiptImage must be a valid object with required fields." }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Items array is required and must contain at least one item." }, { status: 400 });
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.productId || !item.selectedSize || !item.quantity) {
        return NextResponse.json({ success: false, message: `Item ${i + 1}: Missing required fields (productId, quantity, selectedSize).` }, { status: 400 });
      }

      if (item.quantity <= 0) {
        return NextResponse.json({ success: false, message: `Item ${i + 1}: Quantity must be greater than 0.` }, { status: 400 });
      }

      if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity)) {
        return NextResponse.json({ success: false, message: `Item ${i + 1}: Quantity must be a valid integer.` }, { status: 400 });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const { productId, selectedSize } = item;

        const product = await tx.product.findUnique({
          where: { id: productId },
          select: {
            id: true,
            name: true,
            isActive: true,
            sizes: true,
          },
        });

        if (!product) {
          throw new Error(`Product with ID "${productId}" not found.`);
        }

        if (!product.isActive) {
          throw new Error(`Product "${product.name}" is not available for purchase.`);
        }

        if (!product.sizes || !Array.isArray(product.sizes)) {
          throw new Error(`Size information is not available for product "${product.name}".`);
        }

        const sizes = product.sizes as Array<{ size: string; quantity: number }>;
        const sizeData = sizes.find((s) => s.size === selectedSize);

        if (!sizeData) {
          throw new Error(`Selected size "${selectedSize}" is not available for product "${product.name}".`);
        }
      }

      const guest = await tx.guest.create({
        data: {
          email,
          fullname,
          paymentMethod,
          receiptImage,
          isPurchased: false,
        },
      });

      const cartItems = [];
      for (const item of items) {
        const cartItem = await tx.cart.create({
          data: {
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            productId: item.productId,
            guestId: guest.id,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                sizes: true,
              },
            },
          },
        });
        cartItems.push(cartItem);
      }

      return {
        guest,
        cartItems,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: `Guest created successfully with ${result.cartItems.reduce((sum, sizeObj) => sum + sizeObj.quantity, 0)} items in cart.`,
        guest: result.guest,
        cartItems: result.cartItems,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`🚀${new Date()} - Error creating guest:`, error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error(`🚀${new Date()} - Error creating guest:`, error);
    return NextResponse.json({ success: false, message: "An unknown error occurred" }, { status: 500 });
  }
}
