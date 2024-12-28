import { AuthMiddleware } from "@/app/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = AuthMiddleware(req);
  if (authResponse) return authResponse;

  return NextResponse.json({ message: "access granted" });
}
