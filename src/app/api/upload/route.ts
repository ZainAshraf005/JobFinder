import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AuthMiddleware } from "@/app/middleware";
import prisma from "@/lib/prisma";
import { deleteDirectory } from "@/helpers/backendHelpers";
import sharp from "sharp"; // Import sharp for image conversion (if needed)
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  const authResponse = AuthMiddleware(request);
  if (authResponse) return authResponse;

  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as File;
    const id: string | null = data.get("id") as string;

    if (!file || !id) {
      return NextResponse.json(
        { message: "file or id not found", success: false },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists)
      return NextResponse.json(
        { message: "user not found", success: false },
        { status: 404 }
      );

    const email = userExists.email;
    // Determine the folder where the file will go
    const fileExt = path.extname(file.name).toLowerCase();
    const isImage = [".jpg", ".jpeg", ".png"].includes(fileExt);
    const isPdf = fileExt === ".pdf";

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { message: "Only images and PDFs are allowed", success: false },
        { status: 400 }
      );
    }

    if (userExists.role.toLowerCase() === "employer" && isPdf)
      return NextResponse.json(
        {
          message: "invalid type, only jpg, jpeg and png are allowed",
          success: false,
        },
        { status: 400 }
      );

    // Set the upload directory for the user
    const userUploadDir = path.join(process.cwd(), "public", "uploads", email);
    const subDir = isImage ? "profile" : "resume";
    const targetDir = path.join(userUploadDir, subDir);

    // Delete the existing directory if it exists
    if (fs.existsSync(targetDir)) {
      await deleteDirectory(targetDir);
    }

    // Recreate the directory structure
    await fs.promises.mkdir(targetDir, { recursive: true });

    // Rename the file to 'profile' for images and 'resume' for PDFs
    const newFileName = isImage
      ? `profile.png` // Save images as PNG
      : "resume" + path.extname(file.name);

    // Convert image to PNG if it's an image
    let buffer;
    if (isImage) {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      // Convert image to PNG using sharp
      buffer = await sharp(buffer).png().toBuffer(); // Convert to PNG format
    } else {
      // For PDF or other file types, just save the file as is
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    }

    const filePath = path.join(targetDir, newFileName);
    await writeFile(filePath, buffer);

    // Update user profile if image is uploaded
    if (isImage) {
      await prisma.user.update({ where: { id }, data: { photo: newFileName } });
    } else if (isPdf) {
      await prisma.user.update({ where: { id }, data: { resume: true } });
    }

    return NextResponse.json(
      { message: "file uploaded", success: true, user: userExists },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json(
      { message: "File upload failed", success: false },
      { status: 500 }
    );
  }
};

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}