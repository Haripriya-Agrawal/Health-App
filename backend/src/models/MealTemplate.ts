import { Schema, model, Document, Types } from "mongoose";

export interface IMealTemplate extends Document {
  userId?: Types.ObjectId; // optional: user-specific templates
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  ingredients?: { name: string; qty: number; unit: string }[];
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fat?: number;
    fiber?: number; // American spelling
    fibre?: number; // UK spelling
  };
  tags?: string[];
}

const IngredientSchema = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
  },
  { _id: false }
);

const MealTemplateSchema = new Schema<IMealTemplate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true, trim: true },
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
    ingredients: { type: [IngredientSchema], default: [] },
    macros: {
      type: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        fiber: { type: Number, default: 0 },
        fibre: { type: Number, default: 0 },
      },
      default: undefined,
    },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

MealTemplateSchema.index({ userId: 1, name: 1 }, { unique: false });

export const MealTemplate = model<IMealTemplate>("MealTemplate", MealTemplateSchema);