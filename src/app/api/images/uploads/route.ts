import { NextRequest, NextResponse } from "next/server";

import { writeFile, mkdir } from "fs/promises";

import { authenticate, authorize } from "@/utils";

import { join } from "path";

import { existsSync } from "fs";

/* eslint-disable  @typescript-eslint/no-explicit-any */
// Define configuration type for the uploader
interface FileUploaderConfig {
  baseUploadPath?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  baseUrl?: string;
}

interface UploadedFileInfo {
  filename: string;
  originalName: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
  alt: string;
}

class FileUploader {
  private baseUploadPath: string;
  private allowedTypes: string[];
  private maxFileSize: number;
  private baseUrl: string;

  constructor(config: FileUploaderConfig = {}) {
    this.baseUploadPath = config.baseUploadPath || "public/uploads";
    this.allowedTypes = config.allowedTypes || ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    this.maxFileSize = config.maxFileSize || 5 * 1024 * 1024; // 5MB
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split(".").pop()?.toLowerCase() || "";
    return `${timestamp}_${random}.${extension}`;
  }

  private async ensureUploadDirectory(subPath = ""): Promise<string> {
    const fullPath = join(process.cwd(), this.baseUploadPath, subPath);
    if (!existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true });
    }
    return fullPath;
  }

  private async validateFile(file: File, buffer: Buffer): Promise<boolean> {
    if (buffer.length > this.maxFileSize) {
      throw new Error(`File size exceeds limit of ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${this.allowedTypes.join(", ")}`);
    }

    return true;
  }

  async uploadFile(file: File, subPath = "products"): Promise<UploadedFileInfo> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      await this.validateFile(file, buffer);

      const fileName = this.generateFileName(file.name);
      const uploadDir = await this.ensureUploadDirectory(subPath);
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      return {
        filename: fileName,
        originalName: file.name,
        url: `${this.baseUrl}/uploads/${subPath}/${fileName}`,
        path: `/uploads/${subPath}/${fileName}`,
        size: buffer.length,
        mimeType: file.type,
        alt: fileName,
      };
    } catch (error: any) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async uploadMultipleFiles(files: File[], subPath = "products"): Promise<UploadedFileInfo[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, subPath));
    return Promise.all(uploadPromises);
  }
}

// Initialize the file uploader
const uploader = new FileUploader({
  baseUploadPath: "public/uploads",
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
  maxFileSize: 5 * 1024 * 1024, // 5MB
});

// POST handler
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
    const formData = await request.formData();

    // Extract files and subPath
    const files = formData.getAll("files") as File[];
    const subPath = (formData.get("subPath") as string) || "products";

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 });
    }

    // Upload files
    const uploadResults = await uploader.uploadMultipleFiles(files, subPath);

    return NextResponse.json({
      success: true,
      data: uploadResults,
    });
  } catch (error) {
    console.error(`🚀${new Date()} - Error uploads images:`, error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
