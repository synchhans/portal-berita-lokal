import { ObjectId } from "mongoose";

export interface UserRating {
  userId: ObjectId;
  stars: number;
}

export interface Ratings {
  totalStars: number;
  totalRatings: number;
  userRatings: UserRating[];
}
