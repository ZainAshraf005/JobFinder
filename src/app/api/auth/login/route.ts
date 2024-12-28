import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken, verifyPassword } from "@/lib/auth";
import { addCorsHeaders } from "@/lib/cors";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json(
        { message: "all fields required", success: false },
        { status: 400 }
      );
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists)
      return NextResponse.json(
        { message: "user not found", success: false },
        { status: 404 }
      );
    const isValidPassword = await verifyPassword(password, userExists.password);
    if (!isValidPassword)
      return NextResponse.json(
        { message: "invalid credentials", success: false },
        { status: 401 }
      );

    const token = generateToken(userExists.id, userExists.role);

    const response = NextResponse.json(
      {
        message: "login success",
        success: true,
        user: {
          id: userExists.id,
          name: userExists.name,
          email: userExists.email,
          role: userExists.role === "user" ? "job seeker" : userExists.role,
          photo: userExists.photo,
          resume:userExists.resume,
          token,
        },
      },
      { status: 200 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60,
      path: "/",
    });

    return response;
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
