// backend/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  age?: number;
  height?: number;
  currentWeight?: number;
  goalWeight?: number;
  goal?: "loss" | "gain" | "maintenance";
  // goals
  stepsTarget?: number;
  workoutType?: string;
  workoutDuration?: number; // minutes
  macros?: {
    calories?: number;
    carbs?: number;
    protein?: number;
    fiber?: number;
    fat?: number;
  };
  streak?: number;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    age: Number,
    height: Number,
    currentWeight: Number,
    goalWeight: Number,
    goal: { type: String, enum: ["loss", "gain", "maintenance"] },

    // Goals
    stepsTarget: { type: Number, default: 10000 },
    workoutType: { type: String, default: "Leg Day" },
    workoutDuration: { type: Number, default: 45 },
    macros: {
      calories: { type: Number, default: 2000 },
      carbs: { type: Number, default: 250 },
      protein: { type: Number, default: 120 },
      fiber: { type: Number, default: 30 },
      fat: { type: Number, default: 50 },
    },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
