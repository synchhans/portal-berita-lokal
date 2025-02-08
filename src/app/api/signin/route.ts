import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/lib/mongoose";
import UserModel from "../../../../utils/model/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    console.log(`Attempting login for email: ${email}`);

    const user = await UserModel.findOne({ email });
    if (!user) {
      console.warn(`User not found for email: ${email}`);
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`Password mismatch for email: ${email}`);
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      id: user._id,
      role: user.role,
      name: user.name,
      image: user.image,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secretKey);

    console.log(`Login successful for user ID: ${user._id}`);
    const response = NextResponse.json(
      { message: "Login successful", token, user: { id: user._id } },
      { status: 200 }
    );

    response.cookies.set("secure_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
