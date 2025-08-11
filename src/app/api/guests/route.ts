import { NextRequest, NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma";
import { z } from "zod";

import { authenticate, authorize, prisma, sendMembershipInvitation } from "@/lib";

import { API_BASE_URL, calculateTotalPrice } from "@/utils";

import { CartSchema, CreateGuestSchema, DiscountType } from "@/types";

// GET - Fetch all guests and carts
export async function GET(request: NextRequest) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.message) {
    return NextResponse.json({ success: false, message: authenticationResult.message }, { status: authenticationResult.status });
  }
  if (authorizationResult.message) {
    return NextResponse.json({ success: false, message: authorizationResult.message }, { status: authorizationResult.status });
  }
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const order = (searchParams.get("order") || "asc") as Prisma.SortOrder;
    const isPurchased = searchParams.get("isPurchased");

    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const skip = (page - 1) * limit;

    const where: Prisma.GuestWhereInput = {};

    if (search) {
      where.OR = [{ id: { contains: search } }, { fullname: { contains: search } }, { email: { contains: search } }];
    }

    if (isPurchased === "true" || isPurchased === "false") {
      const isPurchasedBool = isPurchased === "true";
      where.OR = [{ isPurchased: isPurchasedBool }];
    }

    if (year || month || dateFrom || dateTo) {
      const dateFilter: Prisma.DateTimeFilter = {};

      if (year && month) {
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (yearNum && monthNum >= 1 && monthNum <= 12) {
          const startDate = new Date(yearNum, monthNum - 1, 1);
          const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

          dateFilter.gte = startDate;
          dateFilter.lte = endDate;
        }
      } else if (year) {
        const yearNum = parseInt(year);
        if (yearNum) {
          const startDate = new Date(yearNum, 0, 1);
          const endDate = new Date(yearNum, 11, 31, 23, 59, 59, 999);

          dateFilter.gte = startDate;
          dateFilter.lte = endDate;
        }
      } else if (month) {
        const monthNum = parseInt(month);
        const currentYear = new Date().getFullYear();

        if (monthNum >= 1 && monthNum <= 12) {
          const startDate = new Date(currentYear, monthNum - 1, 1);
          const endDate = new Date(currentYear, monthNum, 0, 23, 59, 59, 999);

          dateFilter.gte = startDate;
          dateFilter.lte = endDate;
        }
      }

      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        if (!isNaN(fromDate.getTime())) {
          dateFilter.gte = fromDate;
        }
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        if (!isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          dateFilter.lte = toDate;
        }
      }

      if (Object.keys(dateFilter).length > 0) {
        where.createdAt = dateFilter;
      }
    }

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        include: { cartItems: { include: { product: { select: { id: true, name: true, price: true, stock: true, sizes: true, images: true } } } } },
        orderBy: { updatedAt: order },
        skip,
        take: limit,
      }),
      prisma.guest.count({ where }),
    ]);

    const responseData = {
      success: true,
      data: guests,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };

    return NextResponse.json(responseData, { status: 200 });
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

    const existingParameter = await prisma.parameter.findFirst();

    if (!existingParameter) {
      return NextResponse.json({ success: false, message: "Parameter not found" }, { status: 404 });
    }

    const totalPurchased = calculateTotalPrice({
      basePrice: body.totalPurchased,
      member: existingParameter.member.toNumber(),
      memberType: existingParameter.memberType as DiscountType,
      promo: existingParameter.promo.toNumber(),
      promoType: existingParameter.promoType as DiscountType,
      tax: existingParameter.tax.toNumber(),
      taxType: existingParameter.taxType as DiscountType,
      shipping: existingParameter.shipping.toNumber(),
    });

    const createData = CreateGuestSchema.parse({ ...body, totalPurchased });

    const { items } = CartSchema.parse(body);

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

      const guest = await tx.guest.create({ data: createData });

      const cartItems = [];
      for (const item of items) {
        const cartItem = await tx.cart.create({
          data: { quantity: item.quantity, selectedSize: item.selectedSize, productId: item.productId, guestId: guest.id },
          include: { product: { select: { id: true, name: true, price: true, sizes: true } } },
        });
        cartItems.push(cartItem);
      }

      return { guest, cartItems };
    });

    await sendMembershipInvitation(result.guest.email, {
      guestId: result.guest.id,
      email: result.guest.email,
      address: result.guest.address,
      whatsappNumber: result.guest.whatsappNumber,
      postalCode: result.guest.postalCode,
      totalPurchased: result.guest.totalPurchased.toNumber(),
      totalItemsSold: result.guest.totalItemsSold,
      isMember: result.guest.isMember,
      fullname: result.guest.fullname,
      paymentMethod: result.guest.paymentMethod,
      items: result.cartItems,
      baseUrl: API_BASE_URL!,
      createdAt: result.guest.createdAt,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Guest created successfully with ${result.cartItems.reduce((sum, sizeObj) => sum + sizeObj.quantity, 0)} items in cart.`,
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
