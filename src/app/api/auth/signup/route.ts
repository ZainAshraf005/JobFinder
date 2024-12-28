import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { addCorsHeaders } from "@/lib/cors";


export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password || !role)
      return NextResponse.json(
        { message: "all fields are required", success: false },
        { status: 400 }
      );
    if (role !== "user" && role !== "employer") {
      return NextResponse.json(
        { message: "invalid role", success: false },
        { status: 400 }
      );
    }
    const userExists = await prisma.user.findUnique({ where: { email } });
    
    if (userExists)
      return NextResponse.json(
        { message: "email already exists", success: false },
        { status: 400 }
      );
    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      { message: "user created successfully..", success: true, data: newUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    // Return error response in case of failure
    return NextResponse.json(
      { message: errorMessage, success: false },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
