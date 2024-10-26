import mongoose, { Document, Schema, models } from "mongoose";
import { Location } from "../../types/Location";

export interface News extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  location: Location;
  category: string;
  tags: string[];
  status: "approved" | "rejected" | "pending";
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const NewsSchema = new Schema<News>(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      country: { type: String, required: true },
    },
    category: { type: String, required: true },
    tags: { type: [String], required: true },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const NewsModel = models.News || mongoose.model<News>("News", NewsSchema);

export default NewsModel;
