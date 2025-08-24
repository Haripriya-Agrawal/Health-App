// backend/models/Activity.ts
import { Schema } from "mongoose";

export const ActivitySchema = new Schema(
  {
    type: { type: String, enum: ["walking", "running", "cycling", "gym"], required: true },
    steps: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // minutes
  },
  { _id: false }
);
