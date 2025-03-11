import mongoose, { Schema } from "mongoose";
import { Notification } from "../../types/Notification";

const notificationSchema = new Schema<Notification>({
  user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    required: true,
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<Notification>("Notification", notificationSchema);

export default NotificationModel;
