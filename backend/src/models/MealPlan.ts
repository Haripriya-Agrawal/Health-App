import mongoose, { Schema, Document, Types } from "mongoose";

interface PlannedMeal {
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  templateId?: Types.ObjectId | null;
  name: string;
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fibre: number;
  };
}

interface GroceryItem {
  name: string;
  unit: string;
  qtyNeeded: number;
  have: number;
  purchased?: boolean;
}

export interface IMealPlan extends Document {
  user: Types.ObjectId;
  weekStart: string;
  meals: PlannedMeal[];
  grocery: GroceryItem[];
}

const MealPlanSchema = new Schema<IMealPlan>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  weekStart: { type: String, required: true },
  meals: [
    {
      date: { type: String, required: true },
      mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
        required: true,
      },
      templateId: { type: Schema.Types.ObjectId, ref: "MealTemplate", default: null },
      name: { type: String, required: true },
      macros: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fibre: { type: Number, default: 0 },
      },
    },
  ],
  grocery: [
    {
      name: { type: String, required: true },
      unit: { type: String, required: true },
      qtyNeeded: { type: Number, required: true },
      have: { type: Number, required: true },
      purchased: { type: Boolean, default: false },
    },
  ],
});

export default mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);