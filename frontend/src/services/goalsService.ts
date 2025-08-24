import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Types are optional but helpful for IDEs.
// Adjust if your backend returns different shapes.
export type Goals = {
  stepsTarget?: number;
  workoutType?: string;
  workoutDuration?: number; // minutes
  macros?: {
    calories?: number;
    carbs?: number;
    protein?: number;
    fat?: number;
    fiber?: number;
  };
  streak?: number;
  currentWeight?: number;
  goalWeight?: number;
};

export type UpdateGoalsPayload = {
  // Keep keys optional so you can send partial updates
  stepsTarget?: number;
  workoutType?: string;
  workoutDuration?: number;
  // frontend often uses "fibre" — map it to "fiber" on backend if needed there
  caloriesTarget?: number;
  carbsTarget?: number;
  proteinTarget?: number;
  fibreTarget?: number;
  fatTarget?: number;
  weightTarget?: number;
};

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const goalsService = {
  async getGoals(): Promise<Goals> {
    const res = await axios.get(`${API_BASE_URL}/goals`, {
      headers: { ...authHeader() },
    });
    return res.data;
  },

  async updateGoals(data: UpdateGoalsPayload): Promise<Goals> {
    const res = await axios.put(`${API_BASE_URL}/goals`, data, {
      headers: { "Content-Type": "application/json", ...authHeader() },
    });
    return res.data;
  },
};

export default goalsService;
