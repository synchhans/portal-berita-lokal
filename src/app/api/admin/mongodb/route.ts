import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "../../../../../utils/lib/mongoose";
// import { authenticate } from "../../../../../utils/lib/authHelper";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();
    // const user = await authenticate(req);

    // if (user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    // }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name of the collection is required." },
        { status: 400 }
      );
    }

    const connection: mongoose.Connection = mongoose.connection;

    if (!connection?.db) {
      return NextResponse.json(
        { error: "Database connection is not available." },
        { status: 500 }
      );
    }

    const collections = await connection.db.listCollections({ name }).toArray();
    if (collections.length === 0) {
      return NextResponse.json(
        { error: "Collection not found." },
        { status: 404 }
      );
    }

    await connection.db.dropCollection(name);
    return NextResponse.json(
      { message: "Collection has been successfully deleted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting collection:", error);
    return NextResponse.json(
      { error: "Failed to delete the collection." },
      { status: 500 }
    );
  }
}
