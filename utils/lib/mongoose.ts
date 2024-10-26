import mongoose, { Connection } from "mongoose";

let cachedConnection: Connection | null = null;

export async function connectToDB(): Promise<Connection> {
  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);

    cachedConnection = conn.connection;

    console.log("New MongoDB connection established");

    return cachedConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
