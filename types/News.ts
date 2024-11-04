import { Document, Schema } from "mongoose";
import { Ratings } from "./Ratings";

export interface News extends Document {
  title: string;
  title_seo: string;
  content: string;
  image: string;
  author: Schema.Types.ObjectId;
  location: Location;
  category: string;
  tags: string[];
  status: "approved" | "rejected" | "pending";
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  ratings: Ratings;
}