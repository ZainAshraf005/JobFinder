import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuthMiddleware } from "@/app/middleware";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  const middlewareResponse = AuthMiddleware(request);
  if (middlewareResponse) return middlewareResponse;
  try {
    const { title, description, location, salary, type, employerId } =
      await request.json();

    if (
      !title ||
      !description ||
      !location ||
      !salary ||
      !type ||
      !employerId
    ) {
      // console.log({title, description,location,salary,type,employerId})
      return NextResponse.json(
        { message: "all fields are required", success: false },
        { status: 400 }
      );
    }
    if (
      type.toUpperCase() !== "FULL_TIME" &&
      type.toUpperCase() !== "PART_TIME" &&
      type.toUpperCase() !== "REMOTE" &&
      type.toUpperCase() !== "CONTRACT" &&
      type.toUpperCase() !== "INTERNSHIP"
    ) {
      return NextResponse.json(
        { message: "invalid job type", success: false },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: employerId },
    });

    if (!userExists)
      return NextResponse.json(
        { message: "invalid userId", success: false },
        { status: 404 }
      );
    if (userExists.role.toLowerCase() !== "employer")
      return NextResponse.json(
        { message: "you are not allowed to post a job", success: false },
        { status: 400 }
      );

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary,
        type,
        employerId,
      },
    });
    return NextResponse.json(
      { message: "job created successfully", success: true, job },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
};

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
