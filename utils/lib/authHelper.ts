import { NextRequest } from "next/server";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";

export const authenticate = (req: NextRequest): JwtPayload => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) throw new Error("No token provided");

  const secretKey = process.env.JWT_SECRET;

  try {
    const decoded = verify(token, secretKey!) as JwtPayload;

    if (
      !decoded ||
      typeof decoded !== "object" ||
      !("id" in decoded) ||
      !("role" in decoded)
    ) {
      throw new Error("Invalid token");
    }

    return decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error("Token has expired");
    }
    throw new Error("Invalid token");
  }
};
