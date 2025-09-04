import { Router, Request } from "express";
import dayjs from "dayjs";
import { authMiddleware } from "../middleware/authMiddleware";
import { DailyLog } from "../models/DailyLog";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
router.use(authMiddleware);

interface AuthRequest extends Request {
  user?: { id: string };
}

/* ---------------- Gemini setup ---------------- */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

function ensureModel() {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

function extractJSON(s: string): string {
  if (!s) return "";
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence) return fence[1].trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a !== -1 && b !== -1 && b > a) return s.slice(a, b + 1);
  return s.trim();
}

async function estimateMealMacrosWithGemini(text: string): Promise<{
  calories: number; protein: number; carbs: number; fat: number; fiber: number;
}> {
  const model = ensureModel();
  const prompt = `
You are a nutrition assistant. Given a natural-language meal description, estimate macros.
Return ONLY strict JSON (no prose, no code fences) in this exact schema:

{
  "name": "string",
  "macros": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  }
}

Meal: ${text}
  `.trim();

  const result = await model.generateContent([{ text: prompt }]);
  const raw = result.response.text();
  const jsonish = extractJSON(raw);
  const parsed = JSON.parse(jsonish);
  const m = parsed?.macros || {};
  return {
    calories: Number(m.calories) || 0,
    protein: Number(m.protein) || 0,
    carbs: Number(m.carbs) || 0,
    fat: Number(m.fat) || 0,
    fiber: Number(m.fiber ?? m.fibre) || 0,
  };
}

/* --------- Helper: normalize meals to strings for UI --------- */
function mealsToStrings(meals: any): { [k: string]: string } {
  const keys = ["breakfast", "lunch", "snacks", "dinner"] as const;
  const out: any = {};
  keys.forEach((k) => {
    const v = meals?.[k];
    if (!v) out[k] = "";
    else if (typeof v === "string") out[k] = v;
    else if (typeof v === "object" && v.name) out[k] = String(v.name);
    else if (typeof v === "object" && v.rawText) out[k] = String(v.rawText);
    else out[k] = "";
  });
  return out;
}

/* ---------------- Routes ---------------- */

// GET /api/daily-log
router.get("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const logs = await DailyLog.find({ user: req.user.id }).sort({ date: 1 }).lean();

    // 🔁 Backward-compatible response: ensure meals are strings
    const mapped = (logs || []).map((doc: any) => ({
      ...doc,
      meals: mealsToStrings(doc.meals),
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Fetch logs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/daily-log/weight
router.post("/weight", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { weight, measuredAt } = req.body as { weight: number; measuredAt: string };
    const date = dayjs().format("YYYY-MM-DD");

    const updated = await DailyLog.findOneAndUpdate(
      { user: req.user.id, date },
      { $set: { weight: { value: weight, measuredAt } } },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Log weight error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/daily-log/activity
router.post("/activity", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { type, steps, duration } = req.body as {
      type: string;
      steps?: number;
      duration?: number;
    };
    const date = dayjs().format("YYYY-MM-DD");

    const updated = await DailyLog.findOneAndUpdate(
      { user: req.user.id, date },
      { $set: { activity: { type, steps: steps || 0, duration: duration || 0 } } },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Log activity error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/daily-log/calculate-macros  (Gemini-only)
router.post("/calculate-macros", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { meals } = (req.body || {}) as {
      meals?: { breakfast?: string; lunch?: string; snacks?: string; dinner?: string };
    };
    if (!meals || typeof meals !== "object") {
      return res.status(400).json({ message: "meals object is required" });
    }

    const fields = ["breakfast", "lunch", "snacks", "dinner"] as const;
    const total = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    for (const meal of fields) {
      const text = (meals as any)[meal];
      if (!text || typeof text !== "string" || text.trim().length === 0) continue;

      const est = await estimateMealMacrosWithGemini(text.trim());
      total.calories += est.calories;
      total.protein += est.protein;
      total.carbs += est.carbs;
      total.fat += est.fat;
      total.fiber += est.fiber;
    }

    const r1 = (n: number) => Math.round((n + Number.EPSILON) * 10) / 10;
    total.calories = r1(total.calories);
    total.protein = r1(total.protein);
    total.carbs = r1(total.carbs);
    total.fat = r1(total.fat);
    total.fiber = r1(total.fiber);

    const date = dayjs().format("YYYY-MM-DD");
    const updated = await DailyLog.findOneAndUpdate(
      { user: req.user.id, date },
      { $set: { macros: total } }, // ✅ only update totals; do NOT touch meals (UI relies on strings)
      { upsert: true, new: true }
    );

    res.json({ macros: total, log: updated });
  } catch (err) {
    console.error("❌ Macro calc error (Gemini):", err);
    res.status(500).json({ message: "Macro calculation failed" });
  }
});

// POST /api/daily-log  (log a meal from anywhere; keep meals as strings for UI)
router.post("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { date, mealType, name } = req.body as {
      date: string;
      mealType: "breakfast" | "lunch" | "dinner" | "snack";
      name: string;
    };

    if (!date || !mealType || !name) {
      return res.status(400).json({ message: "date, mealType, and name are required" });
    }

    const updated = await DailyLog.findOneAndUpdate(
      { user: req.user.id, date },
      { $set: { [`meals.${mealType}`]: name } }, // ✅ store plain string to keep Home inputs happy
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Log meal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;