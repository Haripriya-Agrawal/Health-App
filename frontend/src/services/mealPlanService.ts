import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export type PlannedMeal = {
  date: string; // YYYY-MM-DD
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  templateId?: string | null;
  name: string;
};

export type MealPlan = {
  _id: string;
  weekStart: string;
  meals: PlannedMeal[];
  grocery: {
    name: string;
    unit: string;
    qtyNeeded: number;
    have: number;
    purchased?: boolean;
  }[];
};

const auth = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const mealPlanService = {
  async get(weekStart: string): Promise<MealPlan | null> {
    const res = await axios.get(`${API_BASE_URL}/meal-plans/${weekStart}`, { headers: auth() });
    return res.data;
  },

  async generate(weekStart: string): Promise<MealPlan> {
    const res = await axios.post(
      `${API_BASE_URL}/meal-plans/generate`,
      { weekStart },
      { headers: { "Content-Type": "application/json", ...auth() } }
    );
    return res.data;
  },

  async update(plan: Partial<MealPlan> & { _id: string }): Promise<MealPlan> {
    const res = await axios.put(`${API_BASE_URL}/meal-plans/${plan._id}`, plan, {
      headers: { "Content-Type": "application/json", ...auth() },
    });
    return res.data;
  },

  async togglePurchased(weekStart: string, name: string, purchased: boolean): Promise<MealPlan> {
    const res = await axios.put(
      `${API_BASE_URL}/meal-plans/${weekStart}/grocery`,
      { name, purchased },
      { headers: { "Content-Type": "application/json", ...auth() } }
    );
    return res.data;
  },
};

export default mealPlanService;