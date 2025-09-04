// backend/models/Meal.ts
import { Schema } from "mongoose";

// Each meal entry can be either raw text (for Nutritionix) or structured macros (for AI/MealPlanner)
const MealEntrySchema = new Schema(
  {
    name: { type: String, default: "" }, // display name (Avocado Toast)
    rawText: { type: String, default: "" }, // original user input for Nutritionix ("2 rotis and dal")
    macros: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fibre: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

export const MealsSchema = new Schema(
  {
    breakfast: { type: MealEntrySchema, default: null },
    lunch: { type: MealEntrySchema, default: null },
    snacks: { type: MealEntrySchema, default: null },
    dinner: { type: MealEntrySchema, default: null },
  },
  { _id: false }
);