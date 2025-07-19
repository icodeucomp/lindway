import { NextRequest, NextResponse } from "next/server";

import { FileUploader } from "@/lib";

const uploader = new FileUploader();

// POST - Delete images
export async function POST(request: NextRequest) {
  try {
    const { subPath } = await request.json();

    if (!subPath) {
      return NextResponse.json({ success: false, message: "subPath is required" }, { status: 400 });
    }

    if (typeof subPath !== "string") {
      return NextResponse.json({ success: false, message: "subPath must be a string" }, { status: 400 });
    }

    if (subPath.trim() === "") {
      return NextResponse.json({ success: false, message: "subPath cannot be empty" }, { status: 400 });
    }

    const uploadResults = await uploader.deleteFile(subPath.trim());

    return NextResponse.json({
      success: true,
      data: uploadResults,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when deleting images:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
