import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json();
    if (!id)
      return NextResponse.json(
        { message: "id not found", success: false },
        { status: 400 }
      );
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists)
      return NextResponse.json(
        { message: "user not found", success: false },
        { status: 404 }
      );

    const applications = await prisma.application.findMany({
      where: { userId: id },
      orderBy: { appliedAt: "desc" },
      include:{job:true}
    });

    return NextResponse.json({ success: true, applications });
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message });
  }
};

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
