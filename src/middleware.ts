import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const needsAuthPaths = [
  "/dashboard",
  "/news/approved",
  "/news/create",
  "/news/update",
  "/profile",
];

const redirectTo = (url: string, req: NextRequest) => {
  return NextResponse.redirect(new URL(url, req.url));
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("secure_token")?.value;
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    if (token) {
      const { payload } = await jwtVerify(token, secretKey);

      if (
        !payload ||
        typeof payload !== "object" ||
        !("id" in payload) ||
        !("role" in payload) ||
        !("name" in payload) ||
        !("image" in payload)
      ) {
        throw new Error("Invalid token payload");
      }

      const user_data = {
        id: payload.id,
        name: payload.name,
        role: payload.role,
        image: payload.image,
      };

      if (
        req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/register"
      ) {
        return redirectTo("/dashboard", req);
      }

      const response = NextResponse.next();
      response.cookies.set("user_data", JSON.stringify(user_data), {
        path: "/",
        secure: true,
      });
      return response;
    }

    if (needsAuthPaths.includes(req.nextUrl.pathname)) {
      return redirectTo("/login", req);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (needsAuthPaths.includes(req.nextUrl.pathname)) {
      return redirectTo("/login", req);
    }

    return NextResponse.next();
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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
