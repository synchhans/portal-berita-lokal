import { NextRequest, NextResponse } from "next/server";
import NewsModel, { News } from "../../../../../utils/model/News";
import { connectToDB } from "../../../../../utils/lib/mongoose";
import { authenticate } from "../../../../../utils/lib/authHelper";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const user = authenticate(req);

    const { title, content, location, category, tags } = await req.json();

    if (!title || !content || !location || !category) {
      return NextResponse.json(
        { error: "Title, Content, Location, and Category are required." },
        { status: 400 }
      );
    }

    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Tags must be an array." },
        { status: 400 }
      );
    }

    const { lat, long, city, province, country } = location;
    if (!lat || !long || !city || !province || !country) {
      return NextResponse.json(
        {
          error:
            "Location must include lat, long, city, province, and country.",
        },
        { status: 400 }
      );
    }

    const existingNews = await NewsModel.findOne({ title });
    if (existingNews) {
      return NextResponse.json(
        { error: "News with this title already exists." },
        { status: 400 }
      );
    }

    const newNews: News = new NewsModel({
      title,
      content,
      author: user.id,
      location: { lat, long, city, province, country },
      category,
      tags: tags,
    });

    await newNews.save();
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    const message =
      (error as { message?: string }).message || "An error occurred";
    return NextResponse.json({ message }, { status: 400 });
  }
}
