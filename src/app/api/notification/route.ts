import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/lib/mongoose";
import { Types } from "mongoose";
import NotificationModel from "../../../../utils/model/Notification";
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
    const authorId = searchParams.get("authorId");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = parseInt(searchParams.get("skip") ?? "0");

    if (!authorId) {
      return NextResponse.json(
        { error: "authorId is required" },
        { status: 400 }
      );
    }

    const pipeline: any[] = [];

    const matchStage: Record<string, any> = {};
    try {
      matchStage.user_id = toObjectId(authorId);
    } catch (error) {
      console.error("Error processing authorId:", error);
      return NextResponse.json(
        { error: "Invalid authorId format" },
        { status: 400 }
      );
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push({ $sort: { timestamp: -1 } });

    if (skip > 0) pipeline.push({ $skip: skip });
    if (limit > 0) pipeline.push({ $limit: limit });

    pipeline.push({
      $project: {
        _id: 1,
        user_id: 1,
        status: 1,
        message: 1,
        timestamp: 1,
      },
    });

    const notifications = await NotificationModel.aggregate(pipeline);

    if (notifications.length === 0) {
      return NextResponse.json(
        { message: "No notifications found" },
        { status: 404 }
      );
    }

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching notifications" },
      { status: 500 }
    );
  }
}
