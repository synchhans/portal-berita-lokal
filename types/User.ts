import { Document, ObjectId } from "mongoose";
import { Preferences } from "./Preferences";

export interface User extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  image: string;
  profession: string;
  role: "admin" | "user" | "provider";
  preferences: Preferences;
  createdAt: Date;
  updatedAt: Date;
}
