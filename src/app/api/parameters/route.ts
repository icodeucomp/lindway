import { NextRequest, NextResponse } from "next/server";

import { authenticate, authorize, prisma } from "@/lib";

import { CreateParameterSchema, UpdateParameterSchema } from "@/types";

import { z } from "zod";

export async function GET() {
  try {
    const parameters = await prisma.parameter.findFirst();

    if (!parameters) {
      return NextResponse.json({ success: true, message: "Parameters not found" }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: parameters, cached: false }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when get parameters:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

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

    const createData = CreateParameterSchema.parse(body);

    await prisma.parameter.create({ data: createData });

    return NextResponse.json({ success: true, message: "Parameter has been created successfully" }, { status: 201 });
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

export async function PUT(request: NextRequest) {
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
    const updateData = UpdateParameterSchema.parse(body);

    const existingParameter = await prisma.parameter.findFirst();

    if (!existingParameter) {
      return NextResponse.json({ success: false, message: "Parameter not found" }, { status: 404 });
    }

    await prisma.parameter.update({ where: { id: existingParameter.id }, data: updateData });

    return NextResponse.json({ success: true, message: "Parameter has been updated successfully" }, { status: 201 });
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
