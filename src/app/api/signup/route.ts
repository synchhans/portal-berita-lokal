import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/lib/mongoose";
import UserModel from "../../../../utils/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, Email, and Password are required." },
        { status: 400 }
      );
    }

    console.log(`Attempting to create user with email: ${email}`);

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.warn(`User already exists with email: ${email}`);
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserDoc = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const newUser = await newUserDoc.save();
    console.log(`User created successfully with ID: ${newUser._id}`);

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error during user creation:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during user creation." },
      { status: 500 }
    );
  }
}
