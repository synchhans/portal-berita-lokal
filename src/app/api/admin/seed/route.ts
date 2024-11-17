import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../utils/lib/mongoose";
import UserModel from "../../../../../utils/model/User";
import NewsModel from "../../../../../utils/model/News";
import bcrypt from "bcryptjs";
import { authenticate } from "../../../../../utils/lib/authHelper";

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    await connectToDB();

    const url = new URL(req.url);
    const add = url.searchParams.get("add");

    const createUser = async () => {
      const { name, email, password, role } = await req.json();

      if (!name || !email || !password || !role) {
        return NextResponse.json(
          { error: "Name, Email, Password, and Role are required." },
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
        role,
      });

      const newUser = await newUserDoc.save();

      return NextResponse.json(
        { message: "User created successfully", user: newUser },
        { status: 201 }
      );
    };

    const createNews = async () => {
      const { title, content, category, author } = await req.json();

      if (!title || !content || !category || !author) {
        return NextResponse.json(
          { error: "Title, Content, Category, and Author are required." },
          { status: 400 }
        );
      }

      const newNewsDoc = new NewsModel({
        title,
        content,
        category,
        author,
      });

      const newNews = await newNewsDoc.save();

      return NextResponse.json(
        { message: "News added successfully", news: newNews },
        { status: 201 }
      );
    };

    if (add === "users") {
      return await createUser();
    } else if (add === "news") {
      return await createNews();
    } else {
      return NextResponse.json(
        { error: "Invalid add parameter. Use 'users' or 'news'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json({ error: "Error seeding data" }, { status: 500 });
  }
}
