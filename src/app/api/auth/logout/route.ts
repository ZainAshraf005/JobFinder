import { addCorsHeaders } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  
  const response = NextResponse.json(
    { message: "logged out successfully", success: true },
    { status: 200 }
  );
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1,
    path: "/",
  });

  return response;
}

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json(
    { message: "CORS preflight successful" },
    { status: 204, headers: addCorsHeaders() }
  );
}