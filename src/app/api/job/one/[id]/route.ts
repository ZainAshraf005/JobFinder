import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    if (!id)
      return NextResponse.json(
        { message: "id required", success: false },
        { status: 201 }
      );

    const jobExists = await prisma.job.findUnique({
      where: { id },
      include: { employer: true },
    });
    if (!jobExists)
      return NextResponse.json(
        { message: "invalid id", success: false },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "job fetched", success: true, job: jobExists },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log(error);
  }
};

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
