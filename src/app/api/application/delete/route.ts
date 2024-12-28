import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json();
    if (!id)
      return NextResponse.json(
        { message: "all fields required" },
        { status: 400 }
      );
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application)
      return NextResponse.json({ message: "invalid id" }, { status: 400 });

    await prisma.application.delete({ where: { id } });
    return NextResponse.json(
      { message: "application removed", success: true },
      { status: 200 }
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
