// frontend/services/dailyLogService.ts
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export type MealsPayload = {
  breakfast?: string | MealEntry;
  lunch?: string | MealEntry;
  snacks?: string | MealEntry;
  dinner?: string | MealEntry;
};

export type MealEntry = {
  name: string;
  rawText?: string; // original user input (for Nutritionix)
  macros?: {
    calories: number;
    carbs: number;
    protein: number;
    fibre: number;
  }; // structured macros (for AI/MealPlanner)
};

const auth = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const dailyLogService = {
  logWeight: async (data: { weight: number; measuredAt: string }) => {
    const res = await axios.post(`${API_BASE_URL}/daily-log/weight`, data, {
      headers: auth(),
    });
    return res.data;
  },

  logActivity: async (data: { type: string; steps: number; duration: number }) => {
    const res = await axios.post(`${API_BASE_URL}/daily-log/activity`, data, {
      headers: auth(),
    });
    return res.data;
  },

  calculateMacros: async (meals: MealsPayload) => {
    const res = await axios.post(
      `${API_BASE_URL}/daily-log/calculate-macros`,
      { meals },
      { headers: auth() }
    );
    return res.data; // expect { macros: {...}, log: {...} }
  },

  getLogs: async () => {
    const res = await axios.get(`${API_BASE_URL}/daily-log`, {
      headers: auth(),
    });
    return res.data;
  },

  // ✅ NEW: Add or update a meal entry
  addEntry: async (entry: {
    date: string;
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    name: string;
    rawText?: string;
    macros?: { calories: number; carbs: number; protein: number; fibre: number };
  }) => {
    const res = await axios.post(`${API_BASE_URL}/daily-log`, entry, {
      headers: { ...auth(), "Content-Type": "application/json" },
    });
    return res.data;
  },
};