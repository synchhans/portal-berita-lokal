import { Document, ObjectId, Schema } from "mongoose";
import { Ratings } from "./Ratings";

export interface News extends Document {
  _id: ObjectId;
  title: string;
  title_seo: string;
  content: string;
  image: string;
  author: ObjectId;
  location: Location;
  category: string;
  type: "user" | "provider";
  tags: string[];
  status: "approved" | "pending";
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  ratings: Ratings;
  url: String;
}
