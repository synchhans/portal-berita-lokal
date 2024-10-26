import mongoose, { Document, Schema, models } from "mongoose";
import { Preferences } from "../../types/Preferences";

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "provider";
  preferences: Preferences;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user", "provider"],
      default: "user",
    },
    preferences: {
      topics: { type: [String], default: [] },
      location: {
        lat: { type: Number, required: true },
        long: { type: Number, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        country: { type: String, required: true },
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
