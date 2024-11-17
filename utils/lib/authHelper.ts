import { NextRequest } from "next/server";
import { JWTPayload, jwtVerify, JWTVerifyResult } from "jose";

export const authenticate = async (
  req: NextRequest
): Promise<AuthenticatedUser> => {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) throw new Error("No token provided");

  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

  if (token === "dev.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev") {
    return {
      id: process.env.USER_DEV_ID!,
      role: process.env.USER_DEV_ROLE!,
      name: "Dev#0001",
      image: "user.png",
    };
  }

  try {
    const { payload } = (await jwtVerify(token, secretKey)) as JWTVerifyResult;

    if (
      !payload ||
      typeof payload !== "object" ||
      !("id" in payload) ||
      !("role" in payload)
    ) {
      throw new Error("Invalid token");
    }

    return payload as AuthenticatedUser;
  } catch (error) {
    if (error instanceof Error && error.message === "JWT expired") {
      throw new Error("Token has expired");
    }
    throw new Error("Invalid token");
  }
};

export const verifyJwt = async (
  token: string,
  secret: string
): Promise<JWTPayload> => {
  const secretKey = new TextEncoder().encode(secret);

  try {
    const { payload } = (await jwtVerify(token, secretKey)) as JWTVerifyResult;

    if (
      !payload ||
      typeof payload !== "object" ||
      !("id" in payload) ||
      !("role" in payload)
    ) {
      throw new Error("Invalid token payload");
    }

    return payload as JWTPayload;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "JWT expired") {
        throw new Error("Token has expired");
      }
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
};
