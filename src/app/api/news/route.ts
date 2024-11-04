import { NextRequest, NextResponse } from "next/server";
import NewsModel from "../../../../utils/model/News";
import { connectToDB } from "../../../../utils/lib/mongoose";
import { authenticate } from "../../../../utils/lib/authHelper";

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
    const skip = parseInt(searchParams.get("skip") ?? "0");
    const district = searchParams.get("district");
    const regency = searchParams.get("regency");
    const authorId = searchParams.get("authorId");

    const query: Record<string, any> = {};

    if (status) query.status = status;
    if (category) query.category = { $regex: new RegExp(category, "i") };
    if (title) {
      query.title_seo = title;
    }
    if (authorId) query.author = authorId;

    if (district) {
      query["location.district"] = district;
    }

    if (regency) {
      query["location.regency"] = regency;
    }

    let newsQuery = NewsModel.find(query);

    if (limit > 0) newsQuery.limit(limit);
    if (skip > 0) newsQuery.skip(skip);

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

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const user = await authenticate(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      await NewsModel.deleteMany({});
      return NextResponse.json(
        { message: "All news deleted" },
        { status: 200 }
      );
    }

    const news = await NewsModel.findByIdAndDelete(id);
    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "News deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "Error deleting news" }, { status: 500 });
  }
}
