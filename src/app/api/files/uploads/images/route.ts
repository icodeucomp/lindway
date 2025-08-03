import { NextRequest, NextResponse } from "next/server";

import { FileUploader } from "@/lib";

const uploader = new FileUploader({
  baseUploadPath: "public/uploads",
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
  maxFileSize: 5 * 1024 * 1024,
  useApiUrls: true,
});

// POST - Uploads images
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("files") as File[];
    const subPath = (formData.get("subPath") as string) || "products";

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files provided" }, { status: 400 });
    }

    const uploadResults = await uploader.uploadMultipleFiles(files, subPath);

    return NextResponse.json({
      success: true,
      data: uploadResults,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when uploading images:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
