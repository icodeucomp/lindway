import { NextRequest, NextResponse } from "next/server";

import { authenticate, authorize, prisma, redis } from "@/lib";
import { Prisma } from "@/generated/prisma";

import { z } from "zod";

import { Categories, CreateProductSchema } from "@/types";

import { calculateDiscountedPrice } from "@/utils";

import { createHash } from "crypto";

const CACHE_TTL = 300;
const CACHE_PREFIX = "products:all";

function generateCacheKey(searchParams: URLSearchParams): string {
  const params = {
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
    category: searchParams.get("category"),
    search: searchParams.get("search"),
    isActive: searchParams.get("isActive"),
    year: searchParams.get("year"),
    month: searchParams.get("month"),
    dateFrom: searchParams.get("dateFrom"),
    dateTo: searchParams.get("dateTo"),
  };

  const paramString = JSON.stringify(params);
  const hash = createHash("md5").update(paramString).digest("hex");

  return `${CACHE_PREFIX}:${hash}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cacheKey = generateCacheKey(searchParams);

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      console.log("🚀 ~ GET ~ parsedData:", parsedData);
      return NextResponse.json({ ...parsedData, cached: true }, { status: 200 });
    }

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

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

    const [products, total] = await Promise.all([prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: "asc" } }), prisma.product.count({ where })]);

    const responseData = {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      cached: false,
    };

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(responseData));

    return NextResponse.json(responseData, { status: 200 });
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
