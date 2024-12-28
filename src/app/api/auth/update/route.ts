import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  try {
    const { id, name } = await request.json();
    if (!id || !name)
      return NextResponse.json(
        { message: "all fields are required" },
        { status: 400 }
      );
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists)
      return NextResponse.json({ message: "user not found" }, { status: 404 });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(
      { message: "name updated", success: true, name: updatedUser.name },
      { status: 201 }
    );
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