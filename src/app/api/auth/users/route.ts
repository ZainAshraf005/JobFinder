import { addCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export const GET = async () => {
  const users = await prisma?.user.findMany({ include: { Job: true } });
  return NextResponse.json({ message: "users fetched", users });
};

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}
