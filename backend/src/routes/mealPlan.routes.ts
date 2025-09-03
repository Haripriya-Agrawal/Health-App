// backend/routes/mealPlan.routes.ts
import { Router, Request } from "express";
import { authMiddleware, AuthedRequest } from "../middleware/authMiddleware";
import MealPlan from "../models/MealPlan";

const router = Router();
router.use(authMiddleware);

interface AuthRequest extends Request {
  user?: { id: string };
}

// GET meal plan for a week
router.get("/:weekStart", async (req: AuthRequest, res) => {
  try {
    const { weekStart } = req.params;
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const plan = await MealPlan.findOne({ weekStart, user: req.user.id });
    if (!plan) return res.json(null);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to get meal plan" });
  }
});

// POST generate a new plan
router.post("/generate", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { weekStart } = req.body;
    let plan = new MealPlan({
      weekStart,
      user: req.user.id,
      meals: [],
      grocery: [],
    });
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate plan" });
  }
});

// POST save or update a meal plan
router.post("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { weekStart, meals, grocery } = req.body;
    let plan = await MealPlan.findOneAndUpdate(
      { weekStart, user: req.user.id },
      { meals, grocery },
      { new: true, upsert: true }
    );
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to save meal plan" });
  }
});

export default router;