import { NextRequest, NextResponse } from "next/server";

import { FileUploader } from "@/lib";

const uploader = new FileUploader({
  baseUploadPath: "public/uploads",
  allowedTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"],
  maxFileSize: 15 * 1024 * 1024,
});

// POST - Uploads videos
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files provided" }, { status: 400 });
    }

    const uploadResults = await uploader.uploadMultipleFiles(files, "/videos");

    return NextResponse.json({ success: true, data: uploadResults });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`🚀${new Date()} - Error when uploading images:`, errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
