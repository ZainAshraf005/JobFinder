import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export function AuthMiddleware(request: NextRequest) {
  console.log("auth middleware running")
  const cookies = request.cookies;
  const token = cookies.get("auth_token")?.value;
  if (!token || !verifyToken(token))
    return NextResponse.json(
      { message: "un-authorized access", success: false },
      { status: 400 }
    );
  
  

}

