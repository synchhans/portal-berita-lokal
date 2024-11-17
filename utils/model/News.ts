import mongoose, { Schema, models } from "mongoose";
import { News } from "../../types/News";

const NewsSchema = new Schema<News>(
  {
    title: { type: String, required: true, unique: true },
    title_seo: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
      district: { type: String, required: true },
      regency: { type: String, required: true },
      country: { type: String, required: true },
    },
    category: { type: String, required: true },
    type: { type: String, default: "user" },
    tags: { type: [String], required: true },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    ratings: {
      totalStars: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      userRatings: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          stars: { type: Number, required: true, min: 1, max: 5 },
        },
      ],
    },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const NewsModel = models.News || mongoose.model<News>("News", NewsSchema);

export default NewsModel;
