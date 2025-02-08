import { NextRequest, NextResponse } from "next/server";
import NewsModel from "../../../../utils/model/News";
import { connectToDB } from "../../../../utils/lib/mongoose";
import { Types } from "mongoose";
const { ObjectId } = Types;

function toObjectId(str: string) {
  if (!/^[a-fA-F0-9]{24}$/.test(str)) {
    throw new Error("Invalid ObjectId format");
  }
  return new ObjectId(str);
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const title = searchParams.get("title")
      ? decodeURIComponent(searchParams.get("title") as string)
      : null;
    const limit = parseInt(searchParams.get("limit") ?? "0");
    const skip = parseInt(searchParams.get("skip") ?? "0");
    const district = searchParams.get("district");
    const regency = searchParams.get("regency");
    const authorId = searchParams.get("authorId");
    const id = searchParams.get("id");
    const sortBy = searchParams.get("sortBy") || "latest";

    // Build the aggregation pipeline
    const pipeline: any[] = [];

    // Match stage for filtering
    const matchStage: Record<string, any> = {};
    if (status) matchStage.status = status;
    if (category) matchStage.category = { $regex: new RegExp(category, "i") };
    if (title) matchStage.title_seo = title;
    if (type) matchStage.type = type;
    if (authorId || id) {
      try {
        if (authorId) {
          matchStage.author = toObjectId(authorId);
        } else if (id) {
          matchStage._id = toObjectId(id);
        } else {
          throw new Error("Either 'authorId' or 'id' is required");
        }
      } catch (error) {
        console.error("Error processing authorId or id:", error);
        return NextResponse.json(
          { error: "Invalid authorId or id format" },
          { status: 400 }
        );
      }
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Sort stage for ordering
    const sortDirection = sortBy === "oldest" ? 1 : -1; // 1 for ascending, -1 for descending
    pipeline.push({ $sort: { createdAt: sortDirection } });

    // Skip and limit stages for pagination
    if (skip > 0) pipeline.push({ $skip: skip });
    if (limit > 0) pipeline.push({ $limit: limit });

    // Projection stage to include only necessary fields
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        title_seo: 1,
        content: 1,
        category: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        author: 1,
        location: 1,
        image: 1,
      },
    });

    // Execute the aggregation pipeline
    const news = await NewsModel.aggregate(pipeline);

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

    const { searchParams } = req.nextUrl;
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

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();

    const { id, category, title, title_seo, image, content } = await req.json();

    if (!id || !category || !title || !image || !content || !title_seo) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (id, category, title, image, content)",
        },
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

    const updatedNews = await NewsModel.findByIdAndUpdate(
      id,
      {
        title,
        title_seo,
        image,
        content,
        status,
      },
      { new: true }
    );

    if (!updatedNews) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "News updated successfully", news: updatedNews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Error updating news" }, { status: 500 });
  }
}
