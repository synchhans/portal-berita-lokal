import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "../utils/lib/authHelper";

const protectedPaths = [
  "/dashboard",
  "/news/approved",
  "/news/create",
  "/news/update",
  "/profile",
];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("secure_token")?.value;

  if (!protectedPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = await verifyJwt(token);
    const response = NextResponse.next();
    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/login",
    "/register",
    "/news/approved",
    "/news/create",
    "/news/update",
    "/profile",
  ],
};
