import { addCorsHeaders } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const jobs = await prisma.job.findMany({ orderBy: { postedAt: "desc" } });
    return NextResponse.json(
      { message: "jobs fetched", success: true, jobs },
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
