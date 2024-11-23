import { NextRequest, NextResponse } from "next/server";
import NewsModel from "../../../../../utils/model/News";
import { connectToDB } from "../../../../../utils/lib/mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = req.nextUrl;
    const title = searchParams.get("title")
      ? decodeURIComponent(searchParams.get("title") as string)
      : null;

    const query: Record<string, any> = {};

    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
      query.status = "approved";
    }

    const newsQuery = await NewsModel.find(query).limit(10);

    if (newsQuery.length === 0) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json(newsQuery);
  } catch (error) {
    console.error("Error search news:", error);
    return NextResponse.json({ error: "Error search news" }, { status: 500 });
  }
}
