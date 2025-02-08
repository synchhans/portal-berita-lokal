import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/lib/mongoose";
import NewsModel from "../../../../utils/model/News";
import UserModel from "../../../../utils/model/User";
import { News } from "../../../../types/News";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    const title = searchParams.get("title");
    const authorNewsLimit = parseInt(
      searchParams.get("authorNewsLimit") || "5"
    );

    if (!id && !title) {
      return NextResponse.json(
        { message: "Either 'id' or 'title' is required" },
        { status: 400 }
      );
    }

    if (id) {
      const user = await UserModel.findOne(
        { _id: id },
        {
          _id: 1,
          name: 1,
          email: 1,
          image: 1,
          profession: 1,
          role: 1,
          "preferences.location": 1,
        }
      ).lean();
      if (!user) {
        return NextResponse.json(
          { message: "Users not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ user }, { status: 200 });
    }

    const news = (await NewsModel.findOne(
      { title_seo: title },
      {
        _id: 1,
        title: 1,
        content: 1,
        category: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        title_seo: 1,
        author: 1,
        location: 1,
        image: 1,
        ratings: 1,
      }
    ).lean()) as News | null;

    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    const author = await UserModel.findById(news.author, {
      _id: 1,
      name: 1,
      email: 1,
      image: 1,
      profession: 1,
      role: 1,
    }).lean();

    if (!author) {
      return NextResponse.json(
        { message: "Author not found" },
        { status: 404 }
      );
    }

    const moreNews = await NewsModel.find(
      { author: news.author, _id: { $ne: news._id } },
      {
        _id: 1,
        title: 1,
        category: 1,
        createdAt: 1,
        updatedAt: 1,
        image: 1,
      }
    )
      .sort({ createdAt: -1 })
      .limit(authorNewsLimit)
      .lean();

    return NextResponse.json(
      { newsDetail: news, author, moreNewsByAuthor: moreNews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching news with author:", error);
    return NextResponse.json(
      { error: "Error fetching news with author" },
      { status: 500 }
    );
  }
}
