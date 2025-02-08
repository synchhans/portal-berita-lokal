import mongoose, { Connection } from "mongoose";

let cachedConnection: Connection | null = null;

export async function connectToDB(): Promise<Connection> {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables."
      );
    }
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: false,
    };

    const conn = await mongoose.connect(MONGODB_URI, options);
    cachedConnection = conn.connection;

    cachedConnection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    cachedConnection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
      setTimeout(() => connectToDB(), 5000);
    });

    cachedConnection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    console.log("New MongoDB connection established");
    return cachedConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
