// backend/models/DailyLog.ts
import mongoose, { Schema, Document } from "mongoose";
import { ActivitySchema } from "./Activity";
import { MealsSchema } from "./Meal";
import { WeightSchema } from "./Weight";

export interface IMealEntry {
  name: string;
  rawText?: string;
  macros?: {
    calories: number;
    carbs: number;
    protein: number;
    fibre: number;
  };
}

export interface IDailyLog extends Document {
  user: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  weight?: { value: number; measuredAt: "morning" | "evening" | "night" };
  activity?: { type: string; steps?: number; duration?: number };
  meals?: {
    breakfast?: IMealEntry;
    lunch?: IMealEntry;
    snacks?: IMealEntry;
    dinner?: IMealEntry;
  };
  macros?: { calories: number; carbs: number; protein: number; fat: number; fiber: number };
}

const DailyLogSchema = new Schema<IDailyLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    date: { type: String, index: true, required: true }, // YYYY-MM-DD
    weight: { type: WeightSchema, default: undefined },
    activity: { type: ActivitySchema, default: undefined },
    meals: { type: MealsSchema, default: undefined },
    macros: {
      calories: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

DailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

export const DailyLog = mongoose.model<IDailyLog>("DailyLog", DailyLogSchema);