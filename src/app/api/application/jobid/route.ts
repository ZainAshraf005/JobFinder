import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json();
    if (!id)
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    const jobExists = await prisma.job.findUnique({ where: { id } });
    const applicationExists = await prisma.application.findMany({
      where: { jobId: id },
      include:{user:true},
      orderBy: { appliedAt: "desc" },
    });
    if (!jobExists)
      return NextResponse.json({ message: "job not found" }, { status: 404 });

    return NextResponse.json(
      { success: true, applications: applicationExists },
      { status: 201 }
    );
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