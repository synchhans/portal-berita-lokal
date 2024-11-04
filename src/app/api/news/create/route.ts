import { NextRequest, NextResponse } from "next/server";
import NewsModel from "../../../../../utils/model/News";
import { connectToDB } from "../../../../../utils/lib/mongoose";
import { authenticate } from "../../../../../utils/lib/authHelper";
import { formatForUrl } from "../../../../../utils/format/url.format";
import { News } from "../../../../../types/News";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const user = await authenticate(req);

    const { title, content, image, location, category, tags } =
      await req.json();

    if (!title || !content || !image || !location || !category) {
      return NextResponse.json(
        {
          error: "Title, Content, Image, Location, and Category are required.",
        },
        { status: 400 }
      );
    }

    const title_seo = formatForUrl(title);

    console.log(title_seo);

    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Tags must be an array." },
        { status: 400 }
      );
    }

    const { lat, long, district, regency, country } = location;
    if (!lat || !long || !district || !regency || !country) {
      return NextResponse.json(
        {
          error:
            "Location must include lat, long, district, regency, and country.",
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

    const existingTitleCeo = await NewsModel.findOne({ title_seo });
    if (existingTitleCeo) {
      return NextResponse.json(
        { error: "Change the title of this news." },
        { status: 400 }
      );
    }

    const newNews: News = new NewsModel({
      title,
      title_seo,
      content,
      image,
      author: user.id,
      location: { lat, long, district, regency, country },
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
