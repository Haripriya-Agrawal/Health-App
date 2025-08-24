// backend/models/Meal.ts
import { Schema } from "mongoose";

export const MealsSchema = new Schema(
  {
    breakfast: { type: String, default: "" },
    lunch: { type: String, default: "" },
    snacks: { type: String, default: "" },
    dinner: { type: String, default: "" },
  },
  { _id: false }
);
