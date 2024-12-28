import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";

export const GET = async (request, { params }) => {
  try {
    const { id } = params;

    // Check if id is provided
    if (!id) {
      return NextResponse.json(
        { message: "id required", success: false },
        { status: 201 }
      );
    }

    // Fetch the job from the database
    const jobExists = await prisma.job.findUnique({
      where: { id },
      include: { employer: true },
    });

    // If the job doesn't exist, return an error
    if (!jobExists) {
      return NextResponse.json(
        { message: "invalid id", success: false },
        { status: 404 }
      );
    }

    // Return the fetched job details
    return NextResponse.json(
      { message: "job fetched", success: true, job: jobExists },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};

// OPTIONS handler for CORS preflight
export const OPTIONS = async () => {
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
};
