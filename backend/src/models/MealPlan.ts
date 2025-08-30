import mongoose, { Schema, Document,Types } from "mongoose";

interface PlannedMeal {
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  templateId?: string | null;
  name: string;
}

interface GroceryItem {
  name: string;
  unit: string;
  qtyNeeded: number;
  have: number;
  purchased?: boolean;
}

export interface IMealPlan extends Document {
  user: string;
  weekStart: string;
  meals: PlannedMeal[];
  grocery: GroceryItem[];
}

const MealPlanSchema = new Schema<IMealPlan>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  weekStart: { type: String, required: true },
  meals: [
    {
      date: String,
      mealType: String,
      templateId: { type: Schema.Types.ObjectId, ref: "MealTemplate" },
      name: String,
    },
  ],
  grocery: [
    {
      name: String,
      unit: String,
      qtyNeeded: Number,
      have: Number,
      purchased: Boolean,
    },
  ],
});

export default mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);