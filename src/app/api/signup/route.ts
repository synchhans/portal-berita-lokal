import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/lib/mongoose";
import UserModel from "../../../../utils/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectToDB();

  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, Email and Password are required." },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
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

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
