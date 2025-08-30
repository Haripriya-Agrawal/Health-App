import axios from "axios";
// import { resolveApiBase } from "./_apiBase";
import { resolveApiBase } from "./_apibase";
const API_BASE = resolveApiBase();

const aiMealService = {
  async suggest(payload: { mealType: "breakfast" | "lunch" | "dinner" | "snack"; pantry: { name: string; unit?: string }[]; targets?: any }) {
    const res = await axios.post(`${API_BASE}/ai/meal-suggest`, payload, {
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
    });
    return res.data;
  },
};

export default aiMealService;