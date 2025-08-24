// backend/models/Weight.ts
import { Schema } from "mongoose";

export const WeightSchema = new Schema(
  {
    value: { type: Number, required: true },
    measuredAt: { type: String, enum: ["morning", "evening", "night"], required: true },
  },
  { _id: false }
);
