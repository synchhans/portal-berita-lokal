import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/lib/mongoose";
// import { authenticate } from "../../../../utils/lib/authHelper";
import UserModel from "../../../../utils/model/User";

export async function GET(req: NextRequest) {
  try {
    // const user = await authenticate(req);

    // if (user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    // }

    const data = await UserModel.find({}, { password: 0 });
    return NextResponse.json(
      { message: "Get data account successfully.", users: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get data Account error:", error);
    const message = (error as { message?: string }).message || "Unauthorized.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();
    // const user = await authenticate(req);

    // if (user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    // }

    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required." },
        { status: 400 }
      );
    }

    const validRoles = ["admin", "provider", "user"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const targetUser = await UserModel.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    targetUser.role = role;
    await targetUser.save();

    return NextResponse.json(
      { message: "User role updated successfully.", user: targetUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    const message =
      (error as { message?: string }).message || "An error occurred.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
