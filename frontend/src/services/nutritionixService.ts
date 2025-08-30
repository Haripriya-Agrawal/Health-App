import axios from "axios";
// import { resolveApiBase } from "./_apiBase";
import { resolveApiBase } from "./_apibase";
const API_BASE = resolveApiBase();

const nutritionixService = {
  async analyze(payload: { query: string }) {
    const res = await axios.post(`${API_BASE}/nutritionix/analyze`, payload, {
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
    });
    return res.data;
  },
};

export default nutritionixService;