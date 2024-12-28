import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> => {
  try {
    const { id } = params;

    // Validate the ID
    if (!id) {
      return NextResponse.json(
        { message: "id is required", success: false },
        { status: 400 }
      );
    }

    // Check if the user exists and is an employer
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists || userExists.role.toLowerCase() !== "employer") {
      return NextResponse.json(
        { message: "employer not found", success: false },
        { status: 404 }
      );
    }

    // Fetch the jobs for the employer
    const jobExists = await prisma.job.findMany({
      where: { employerId: id },
      orderBy: { postedAt: "desc" },
      include: { Application: true },
    });

    return NextResponse.json(
      { message: "jobs fetched", success: true, jobs: jobExists },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};

// OPTIONS handler for CORS preflight
export const OPTIONS = async (): Promise<NextResponse> => {
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
};
