import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../utils/lib/mongoose";
// import { authenticate } from "../../../../../utils/lib/authHelper";
import NewsModel from "../../../../../utils/model/News";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();

    // const user = await authenticate(req);
    const { newsId, status } = await req.json();

    // if (!user || user.role === "user") {
    //   return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    // }

    if (!newsId || !status) {
      return NextResponse.json(
        { error: "News ID and status are required." },
        { status: 400 }
      );
    }

    const validStatuses: string[] = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Valid statuses are 'pending', 'approved', 'rejected'.",
        },
        { status: 400 }
      );
    }

    const updatedNews = await NewsModel.updateOne(
      { _id: newsId },
      { $set: { status } }
    );

    if (updatedNews.matchedCount === 0) {
      return NextResponse.json({ error: "News not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "News status updated successfully.", updatedNews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error during news status update:", error);
    const message =
      (error as { message?: string }).message ||
      "An unexpected error occurred during news status update.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
