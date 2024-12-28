import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addCorsHeaders } from "@/lib/cors";


export const POST = async (request: NextRequest) => {
  try {
    const { jobId, userId, resumeUrl, coverLetter } = await request.json();
    if (!jobId || !userId || !resumeUrl || !coverLetter)
      return NextResponse.json(
        { message: "all fields are required", success: false },
        { status: 400 }
      );

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    const jobExists = await prisma.job.findUnique({ where: { id: jobId } });
    if (!userExists || !jobExists)
      return NextResponse.json(
        { message: "invalid data", success: false },
        { status: 404 }
      );

    const application = await prisma.application.create({
      data: { jobId, userId, resumeUrl, coverLetter },
    });

    return NextResponse.json(
      { message: "application submitted", success: true, application },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error)  return NextResponse.json({ message: error.message });
  }
};

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
