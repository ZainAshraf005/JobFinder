import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json();
    if (!id)
      return NextResponse.json(
        { message: "all fields are required" },
        { status: 400 }
      );
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists)
      return NextResponse.json({ message: "user not found" }, { status: 404 });

    if (userExists.role.toLowerCase() === "user")
      await prisma.application.deleteMany({ where: { userId: id } });
    else if (userExists.role.toLowerCase() === "employer")
      await prisma.job.deleteMany({ where: { employerId: id } });
    else
      return NextResponse.json(
        { message: "Invalid user role" },
        { status: 400 }
      );

    await prisma.user.delete({ where: { id } });

    const userDirectory = path.join(
      process.cwd(),
      "public/uploads",
      userExists.email
    );
    if (fs.existsSync(userDirectory)) {
      fs.rmSync(userDirectory, { recursive: true, force: true });
    }

    const response = NextResponse.json(
      { message: "user removed", success: true },
      { status: 200 }
    );

    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: -1,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
