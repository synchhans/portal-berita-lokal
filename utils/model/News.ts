import mongoose, { Schema, models } from "mongoose";
import { News } from "../../types/News";

const NewsSchema = new Schema<News>(
  {
    title: { type: String, required: true, unique: true },
    title_seo: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String },
    location: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
      district: { type: String, required: true, index: true },
      regency: { type: String, required: true, index: true },
      country: { type: String, required: true },
    },
    category: { type: String, required: true, index: true },
    type: { type: String, default: "user" },
    tags: { type: [String], required: true },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
      index: true,
    },
    ratings: {
      totalStars: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      userRatings: [
        {
          userId: {
            type: Schema.Types.ObjectId,
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

NewsSchema.index({
  status: 1,
  category: 1,
  "location.district": 1,
  createdAt: -1,
});

const NewsModel = models.News || mongoose.model<News>("News", NewsSchema);

export default NewsModel;
