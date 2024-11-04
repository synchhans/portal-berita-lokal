import { Schema } from "mongoose";

export interface UserRating {
  userId: Schema.Types.ObjectId;
  stars: number;
}

export interface Ratings {
  totalStars: number;
  totalRatings: number;
  userRatings: UserRating[];
}
