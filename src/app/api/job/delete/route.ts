import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json();
    if (!id)
      return NextResponse.json(
        { message: "all fields are required" },
        { status: 400 }
      );
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job)
      return NextResponse.json({ message: "invalid id" }, { status: 404 });

    await prisma.application.deleteMany({ where: { jobId: id } });
    await prisma.job.delete({ where: { id } });

    return NextResponse.json(
      { message: "job removed", success: true },
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