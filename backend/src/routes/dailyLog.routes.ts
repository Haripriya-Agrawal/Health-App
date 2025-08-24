// backend/routes/dailyLog.routes.ts
import { Router } from "express";
import axios from "axios";
import dayjs from "dayjs";
import { authMiddleware, AuthedRequest } from "../middleware/authMiddleware";
import { DailyLog } from "../models/DailyLog";

const router = Router();
router.use(authMiddleware);

// GET /api/daily-log
router.get("/", async (req: AuthedRequest, res) => {
  try {
    const logs = await DailyLog.find({ user: req.userId }).sort({ date: 1 }).lean();
    res.json(logs);
  } catch (err) {
    console.error("Fetch logs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/daily-log/weight
router.post("/weight", async (req: AuthedRequest, res) => {
  try {
    const { weight, measuredAt } = req.body as { weight: number; measuredAt: string };
    const date = dayjs().format("YYYY-MM-DD");

    const updated = await DailyLog.findOneAndUpdate(
      { user: req.userId, date },
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
router.post("/activity", async (req: AuthedRequest, res) => {
  try {
    const { type, steps, duration } = req.body as {
      type: string;
      steps?: number;
      duration?: number;
    };
    const date = dayjs().format("YYYY-MM-DD");

    const updated = await DailyLog.findOneAndUpdate(
      { user: req.userId, date },
      { $set: { activity: { type, steps: steps || 0, duration: duration || 0 } } },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Log activity error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/daily-log/calculate-macros
 * Restored to your original working logic:
 * - Uses Nutritionix "natural language" endpoint to parse each provided meal string.
 * - Sums nf_calories, nf_protein, nf_total_carbohydrate, nf_total_fat, nf_dietary_fiber.
 * - Updates ONLY the macros for today's DailyLog (no meal merging/wiping).
 * 
 * Required env:
 *   NUTRITIONIX_APP_ID
 *   NUTRITIONIX_APP_KEY
 */
router.post("/calculate-macros", async (req: AuthedRequest, res) => {
  try {
    const { meals } = (req.body || {}) as {
      meals?: { breakfast?: string; lunch?: string; snacks?: string; dinner?: string };
    };

    if (!meals || typeof meals !== "object") {
      return res.status(400).json({ message: "meals object is required" });
    }

    const appId = process.env.NUTRITIONIX_APP_ID || "";
    const appKey = process.env.NUTRITIONIX_APP_KEY || "";
    if (!appId || !appKey) {
      return res.status(500).json({ message: "Nutritionix credentials missing" });
    }

    const fields = ["breakfast", "lunch", "snacks", "dinner"] as const;

    // Accumulator
    const total = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    // For each non-empty meal string, call Nutritionix
    for (const meal of fields) {
      const text = (meals as any)[meal];
      if (!text || typeof text !== "string" || text.trim().length === 0) continue;

      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: text },
        {
          headers: {
            "x-app-id": appId,
            "x-app-key": appKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.foods?.length) {
        for (const food of response.data.foods) {
          total.calories += food.nf_calories || 0;
          total.protein += food.nf_protein || 0;
          total.carbs += food.nf_total_carbohydrate || 0;
          total.fat += food.nf_total_fat || 0;
          total.fiber += food.nf_dietary_fiber || 0;
        }
      }
    }

    // Optional: round to 1 decimal to keep UI neat
    const round1 = (n: number) => Math.round(n * 10) / 10;
    total.calories = round1(total.calories);
    total.protein = round1(total.protein);
    total.carbs = round1(total.carbs);
    total.fat = round1(total.fat);
    total.fiber = round1(total.fiber);

    // Save macros for TODAY (do not overwrite meals here — match original behavior)
    const date = dayjs().format("YYYY-MM-DD");
    const updated = await DailyLog.findOneAndUpdate(
      { user: req.userId, date },
      { $set: { macros: total } },
      { upsert: true, new: true }
    );

    res.json({ macros: total, log: updated });
  } catch (err) {
    console.error("❌ Macro calc error:", err);
    res.status(500).json({ message: "Macro calculation failed" });
  }
});

export default router;
