import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../utils/lib/mongoose";
import { authenticate } from "../../../../../utils/lib/authHelper";
import UserModel from "../../../../../utils/model/User";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();

    const user = await authenticate(req);

    const { userId, location } = await req.json();

    if (!userId || !location || !location.district || !location.regency) {
      return NextResponse.json(
        { error: "User ID and location (district, regency) are required." },
        { status: 400 }
      );
    }

    const userToUpdate = await UserModel.findById(userId);
    if (!userToUpdate) {
      return NextResponse.json(
        { error: `User with ID ${userId} not found.` },
        { status: 404 }
      );
    }

    userToUpdate.preferences.location.district = location.district;
    userToUpdate.preferences.location.regency = location.regency;

    await userToUpdate.save();

    return NextResponse.json(
      { message: "User location updated successfully.", userToUpdate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user location:", error);
    const message =
      (error as { message?: string }).message || "An error occurred";
    return NextResponse.json({ message }, { status: 400 });
  }
}
