import { Router, Request } from "express";
import axios from "axios";
import dayjs from "dayjs";
import { authMiddleware } from "../middleware/authMiddleware";
import { DailyLog } from "../models/DailyLog";

const router = Router();
router.use(authMiddleware);

interface AuthRequest extends Request {
  user?: { id: string };
}

// GET /api/daily-log
router.get("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const logs = await DailyLog.find({ user: req.user.id }).sort({ date: 1 }).lean();
    res.json(logs);
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

// POST /api/daily-log/calculate-macros
router.post("/calculate-macros", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

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

    const total = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

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

    const round1 = (n: number) => Math.round(n * 10) / 10;
    total.calories = round1(total.calories);
    total.protein = round1(total.protein);
    total.carbs = round1(total.carbs);
    total.fat = round1(total.fat);
    total.fiber = round1(total.fiber);

    const date = dayjs().format("YYYY-MM-DD");
    const updated = await DailyLog.findOneAndUpdate(
      { user: req.user.id, date },
      { $set: { macros: total } },
      { upsert: true, new: true }
    );

    res.json({ macros: total, log: updated });
  } catch (err) {
    console.error("❌ Macro calc error:", err);
    res.status(500).json({ message: "Macro calculation failed" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { date, mealType, name, macros } = req.body as {
      date: string;
      mealType: "breakfast" | "lunch" | "dinner" | "snack";
      name: string;
      macros: { calories: number; protein: number; carbs: number; fibre: number };
    };

    if (!date || !mealType || !name) {
      return res.status(400).json({ message: "date, mealType, and name are required" });
    }

    // Build meal entry
    const mealEntry = {
      name,
      macros,
    };

    // Upsert into DailyLog
    const updated = await DailyLog.findOneAndUpdate(
      { user: req.user.id, date },
      { $set: { [`meals.${mealType}`]: mealEntry } }, // ✅ store under meals.{mealType}
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Log meal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;