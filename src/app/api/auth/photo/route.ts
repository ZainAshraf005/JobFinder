import { AuthMiddleware } from "@/app/middleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  const response = AuthMiddleware(request);
  if (response) return response;
  try {
    const { id } = await request.json();
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists)
      return NextResponse.json(
        { message: "user not found", success: false },
        { status: 404 }
      );
    return NextResponse.json(
      {
        message: "data fetched",
        success: true,
        user: userExists,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    NextResponse.json({ error }, { status: 500 });
  }
};

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
