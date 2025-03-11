import { NextRequest, NextResponse } from "next/server";
import NewsModel from "../../../../../utils/model/News";
import { connectToDB } from "../../../../../utils/lib/mongoose";
import { authenticate } from "../../../../../utils/lib/authHelper";
import { formatForUrl } from "../../../../../utils/format/url.format";
import { News } from "../../../../../types/News";
import NotificationModel from "../../../../../utils/model/Notification";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { title, content, image, location, category, tags, url } =
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

    const existingTitleSeo = await NewsModel.findOne({ title_seo });
    if (existingTitleSeo) {
      return NextResponse.json(
        { error: "Change the title of this news." },
        { status: 400 }
      );
    }

    const moderationResponse = await fetch(
      `${process.env.BASE_URL_WEB}/api/news/moderate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      }
    );

    if (!moderationResponse.ok) {
      const errorBody = await moderationResponse.text();
      console.error("Moderation API Error:", errorBody);
      return NextResponse.json(
        { error: "Failed to moderate content" },
        { status: 500 }
      );
    }

    const moderationData = await moderationResponse.json();
    const isTextSafe = moderationData.isTextSafe;
    const status = isTextSafe ? "approved" : "pending";

    const newNews: News = new NewsModel({
      title,
      title_seo,
      content,
      image,
      author: user.id,
      location: { lat, long, district, regency, country },
      category,
      type: user.role,
      tags: tags,
      url: url,
      status,
    });

    await newNews.save();

    const message =
      status === "approved"
        ? "Berita Anda telah disetujui."
        : "Berita Anda ditolak karena melanggar, harap update konten!.";

    const newNotification = new NotificationModel({
      user_id: user.id,
      status: status,
      message: message,
      timestamp: new Date(),
    });

    await newNotification.save();

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    const message =
      (error as { message?: string }).message || "An error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
