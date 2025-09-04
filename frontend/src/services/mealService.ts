import axios from "axios";
import { API_BASE_URL } from "./apiConfig"; // <-- use your shared config

// ------- utils -------
const base = API_BASE_URL.replace(/\/$/, ""); // trim trailing slash once
const MEALS_URL = `${base}/meals`;
const TEMPLATES_URL = `${base}/meal-templates`;

const authHeaders = () => {
  try {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch {
    return {};
  }
};

// ------- types -------
export type Macros = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  // sometimes incoming data uses UK spelling:
  fibre?: number;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface TrackedMeal {
  id?: string;
  date: string;      // ISO: YYYY-MM-DD
  type: MealType;
  name: string;
  // either granular macros or flat fields — both supported
  macros?: Macros;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  // allow any additional fields the backend may return
  [k: string]: any;
}

export interface MealTemplate {
  id?: string;
  name: string;
  description?: string;
  type?: MealType;
  macros?: Macros;
  [k: string]: any;
}

// Normalize outgoing meal payload (support both macros{} or flat fields)
function toPayload(meal: Partial<TrackedMeal>) {
  const m = meal.macros || {};
  return {
    ...meal,
    macros: {
      calories:
        meal.calories ??
        m.calories,
      protein:
        meal.protein ??
        m.protein,
      carbs:
        meal.carbs ??
        m.carbs,
      fat:
        meal.fat ??
        m.fat,
      fiber:
        meal.fiber ?? (m.fiber ?? (m as any).fibre),
    },
    calories: undefined,
    protein: undefined,
    carbs: undefined,
    fat: undefined,
    fiber: undefined,
  };
}

// ------- API -------
export const mealService = {
  // Meals CRUD
  async list(date?: string): Promise<TrackedMeal[]> {
    const url = date ? `${MEALS_URL}?date=${encodeURIComponent(date)}` : MEALS_URL;
    const res = await axios.get(url, { headers: { ...authHeaders() } });
    return res.data;
  },

  async get(id: string): Promise<TrackedMeal> {
    const res = await axios.get(`${MEALS_URL}/${id}`, { headers: { ...authHeaders() } });
    return res.data;
  },

  async create(meal: Partial<TrackedMeal>): Promise<TrackedMeal> {
    const res = await axios.post(MEALS_URL, toPayload(meal), {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    return res.data;
  },

  async update(id: string, meal: Partial<TrackedMeal>): Promise<TrackedMeal> {
    const res = await axios.put(`${MEALS_URL}/${id}`, toPayload(meal), {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    return res.data;
  },

  async remove(id: string): Promise<{ ok: true } | any> {
    const res = await axios.delete(`${MEALS_URL}/${id}`, { headers: { ...authHeaders() } });
    return res.data;
  },

  // Meal Templates (optional, keep if your API exposes these)
  async listTemplates(): Promise<MealTemplate[]> {
    const res = await axios.get(TEMPLATES_URL, { headers: { ...authHeaders() } });
    return res.data;
  },

  async getTemplate(id: string): Promise<MealTemplate> {
    const res = await axios.get(`${TEMPLATES_URL}/${id}`, { headers: { ...authHeaders() } });
    return res.data;
  },

  async createTemplate(tpl: Partial<MealTemplate>): Promise<MealTemplate> {
    const res = await axios.post(TEMPLATES_URL, tpl, {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    return res.data;
  },

  async updateTemplate(id: string, tpl: Partial<MealTemplate>): Promise<MealTemplate> {
    const res = await axios.put(`${TEMPLATES_URL}/${id}`, tpl, {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    return res.data;
  },

  async removeTemplate(id: string): Promise<{ ok: true } | any> {
    const res = await axios.delete(`${TEMPLATES_URL}/${id}`, { headers: { ...authHeaders() } });
    return res.data;
  },
};

export default mealService;