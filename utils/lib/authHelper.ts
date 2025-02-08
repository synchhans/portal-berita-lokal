import { JWTPayload, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export const verifyJwt = async (token: string): Promise<JWTPayload> => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables."
      );
    }
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);

    if (
      !payload ||
      typeof payload.id !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.image !== "string"
    ) {
      console.error("Invalid token payload:", payload);
      throw new Error("Invalid token payload");
    }

    console.log("Token verified successfully for user:", payload.id);
    return payload;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "JWT expired") {
        console.error("Token has expired");
        throw new Error("Token has expired");
      }
      console.error("Invalid token:", error.message);
      throw new Error("Invalid token");
    }
    console.error("Unexpected error during token verification");
    throw new Error("Token verification failed");
  }
};

export const deleteCookie = (response: NextResponse, name: string) => {
  response.cookies.set(name, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });
};

export const authenticate = async (req: NextRequest): Promise<JWTPayload> => {
  try {
    let token = req.cookies.get("secure_token")?.value;

    if (!token) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid token.");
      }
      token = authHeader.split(" ")[1];
    }

    const payload = await verifyJwt(token);

    console.log("User authenticated successfully:", payload.id);
    return payload;
  } catch (error) {
    console.error("Authentication failed:", (error as Error).message);
    throw new Error("Authentication failed: Invalid or expired token.");
  }
};
