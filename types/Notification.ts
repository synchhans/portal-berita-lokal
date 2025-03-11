import { Document, Types } from "mongoose";

export interface Notification extends Document {
  user_id: Types.ObjectId;
  status: "approved" | "pending";
  message: string;
  timestamp: Date;
}
