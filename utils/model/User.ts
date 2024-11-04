import mongoose, { Schema, models } from "mongoose";
import { User } from "../../types/User";

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "user.png" },
    profession: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "user", "provider"],
      default: "user",
    },
    preferences: {
      topics: { type: [String], default: [] },
      location: {
        lat: { type: Number, default: 0 },
        long: { type: Number, default: 0 },
        district: { type: String, default: "" },
        regency: { type: String, default: "" },
        country: { type: String, default: "indonesia" },
      },
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
