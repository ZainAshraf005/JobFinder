import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const GET = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params; // Access the route parameter correctly
    if (!id) {
      return NextResponse.json(
        { message: "id is required", success: false },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    const jobExists = await prisma.job.findMany({
      where: { employerId: id },
      orderBy: { postedAt: "desc" },
      include: { Application: true },
    });

    if (!userExists || userExists.role.toLowerCase() !== "employer") {
      return NextResponse.json(
        { message: "employer not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "jobs fetched", success: true, jobs: jobExists },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};

export async function OPTIONS() {
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
