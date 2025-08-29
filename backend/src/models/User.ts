import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;

  // Profile
  age?: number;
  height?: number;
  currentWeight?: number;
  goalWeight?: number;
  targetDate?: string | null;
  goal?: "loss" | "gain" | "maintenance";

  // Steps (dual range)
  steps?: { min?: number; max?: number };

  // Workout goal
  workout?: {
    type?: string;
    mode?: "time" | "calories";
    target?: number;
  };

  // Macro goal ranges
  macros?: {
    calories?: { min?: number; max?: number };
    carbs?: { min?: number; max?: number };
    protein?: { min?: number; max?: number };
    fiber?: { min?: number; max?: number };
    fat?: { min?: number; max?: number };
  };

  // Non-weight goals
  nonWeight?: {
    sleepHours?: { min?: number; max?: number };
    waterLiters?: { min?: number; max?: number };
  };

  // Streak targets
  streaks?: {
    stepsDaysPerWeekMin?: number;
    caloriesWithinGoalDaysPerWeekMin?: number;
  };

  // legacy fields (kept for compatibility)
  stepsTarget?: number;
  workoutType?: string;
  workoutDuration?: number;
  streak?: number;
}

const RangeSchema = new Schema({ min: Number, max: Number }, { _id: false });

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },

    age: Number,
    height: Number,
    currentWeight: Number,
    goalWeight: Number,
    targetDate: { type: String, default: null },
    goal: { type: String, enum: ["loss", "gain", "maintenance"] },

    steps: { type: RangeSchema, default: undefined },

    workout: {
      type: {
        type: String,
        default: "gym",
      },
      mode: { type: String, enum: ["time", "calories"], default: "time" },
      target: { type: Number, default: 45 },
    },

    macros: {
      calories: { type: RangeSchema, default: undefined },
      carbs: { type: RangeSchema, default: undefined },
      protein: { type: RangeSchema, default: undefined },
      fiber: { type: RangeSchema, default: undefined },
      fat: { type: RangeSchema, default: undefined },
    },

    nonWeight: {
      sleepHours: { type: RangeSchema, default: undefined },
      waterLiters: { type: RangeSchema, default: undefined },
    },

    streaks: {
      stepsDaysPerWeekMin: { type: Number, default: 5 },
      caloriesWithinGoalDaysPerWeekMin: { type: Number, default: 5 },
    },

    // legacy compatibility (kept so existing code doesn't crash)
    stepsTarget: { type: Number, default: 10000 },
    workoutType: { type: String, default: "Leg Day" },
    workoutDuration: { type: Number, default: 45 },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
