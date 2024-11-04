import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../utils/lib/mongoose";
import { authenticate } from "../../../../../utils/lib/authHelper";
import NewsModel from "../../../../../utils/model/News";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();

    const user = await authenticate(req);
    const { newsId, status } = await req.json();

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    if (!newsId || !status) {
      return NextResponse.json(
        { error: "News ID and status are required." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status.",
        },
        { status: 400 }
      );
    }

    const newsIds = Array.isArray(newsId) ? newsId : [newsId];

    // Fetch and update each news item
    const updatedNews = [];
    for (const id of newsIds) {
      const news = await NewsModel.findById(id);
      if (!news) {
        return NextResponse.json(
          { error: `News with ID ${id} not found.` },
          { status: 404 }
        );
      }

      news.status = status;
      await news.save();
      updatedNews.push(news);
    }

    return NextResponse.json(
      { message: "News status updated successfully.", updatedNews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating news status:", error);
    const message =
      (error as { message?: string }).message || "An error occurred";
    return NextResponse.json({ message }, { status: 400 });
  }
}
