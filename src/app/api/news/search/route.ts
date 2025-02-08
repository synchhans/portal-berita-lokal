import { NextRequest, NextResponse } from "next/server";
import NewsModel from "../../../../../utils/model/News";
import { connectToDB } from "../../../../../utils/lib/mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = req.nextUrl;
    const title = searchParams.get("title")
      ? decodeURIComponent(searchParams.get("title") as string)
      : null;

    if (title && title.trim() === "") {
      return NextResponse.json(
        { error: "Title cannot be empty." },
        { status: 400 }
      );
    }

    const query: Record<string, any> = {};
    if (title) {
      query.$and = [
        { title: { $regex: new RegExp(title, "i") } },
        { status: "approved" },
      ];
    } else {
      query.status = "approved";
    }

    console.log("Searching news with query:", query);

    const newsQuery = await NewsModel.find(query).limit(10);

    if (newsQuery.length === 0) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json(newsQuery);
  } catch (error) {
    console.error("Unexpected error during search:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during search." },
      { status: 500 }
    );
  }
}
