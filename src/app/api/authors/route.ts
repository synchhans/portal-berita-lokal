import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/lib/mongoose";
import UserModel from "../../../../utils/model/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Author ID is required" },
        { status: 400 }
      );
    }

    const author = await UserModel.findById(id);

    if (!author) {
      return NextResponse.json(
        { message: "Author not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(author, { status: 200 });
  } catch (error) {
    console.error("Error get authors:", error);
    return NextResponse.json({ error: "Error get authors" }, { status: 500 });
  }
}
