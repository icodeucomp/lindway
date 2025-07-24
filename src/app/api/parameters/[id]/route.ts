import { NextRequest, NextResponse } from "next/server";

import { authenticate, authorize, prisma } from "@/lib";

import { UpdateParameterSchema } from "@/types";

import { z } from "zod";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
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

    const parameter = await prisma.parameter.findUnique({ where: { id } });

    if (!parameter) {
      return NextResponse.json({ success: false, message: "Parameter not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: parameter });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when deleting product:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

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
    const updateData = UpdateParameterSchema.parse(body);

    const existingParameter = await prisma.parameter.findUnique({ where: { id } });

    if (!existingParameter) {
      return NextResponse.json({ success: false, message: "Parameter not found" }, { status: 404 });
    }

    await prisma.parameter.update({ where: { id }, data: updateData });

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

    const parameter = await prisma.parameter.findUnique({ where: { id } });

    if (!parameter) {
      return NextResponse.json({ success: false, message: "Parameter not found" }, { status: 404 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when deleting product:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
