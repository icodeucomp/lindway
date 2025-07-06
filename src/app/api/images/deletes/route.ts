import { NextRequest, NextResponse } from "next/server";

import { authenticate, authorize } from "@/utils";

import { join } from "path";

import { existsSync } from "fs";

const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    const fullPath = join(process.cwd(), "public", filePath);
    if (existsSync(fullPath)) {
      const { unlink } = await import("fs/promises");
      await unlink(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  const authenticationResult = await authenticate(request);
  const authorizationResult = await authorize(request, "ADMIN");
  if (authenticationResult.error) {
    return NextResponse.json({ success: false, error: authenticationResult.error }, { status: authenticationResult.status });
  }
  if (authorizationResult.error) {
    return NextResponse.json({ success: false, error: authorizationResult.error }, { status: authorizationResult.status });
  }
  try {
    const { subPath } = await request.json();

    if (!subPath) {
      return NextResponse.json({ success: false, error: "subPath is required" }, { status: 400 });
    }

    if (typeof subPath !== "string") {
      return NextResponse.json({ success: false, error: "subPath must be a string" }, { status: 400 });
    }

    if (subPath.trim() === "") {
      return NextResponse.json({ success: false, error: "subPath cannot be empty" }, { status: 400 });
    }

    // Delete files
    const uploadResults = await deleteFile(subPath.trim());

    return NextResponse.json({
      success: true,
      data: uploadResults,
    });
  } catch (error) {
    console.error(`🚀${new Date()} - Error deleting images:`, error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
