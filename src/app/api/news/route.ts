import { NextRequest, NextResponse } from "next/server";
import NewsModel from "../../../../utils/model/News";
import { connectToDB } from "../../../../utils/lib/mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const title = searchParams.get("title")
      ? decodeURIComponent(searchParams.get("title") as string)
      : null;
    const limit = parseInt(searchParams.get("limit") ?? "0");
    const authorId = searchParams.get("authorId");

    const query: Record<string, any> = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (title) {
      query.title = title;
    }
    if (authorId) query.author = authorId;

    let newsQuery = NewsModel.find(query);
    if (limit > 0) newsQuery.limit(limit);

    const news = await newsQuery.exec();

    if (news.length === 0) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error("Error get news:", error);
    return NextResponse.json({ error: "Error get news" }, { status: 500 });
  }
}
