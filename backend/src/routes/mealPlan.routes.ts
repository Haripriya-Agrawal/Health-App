import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import MealPlan from "../models/MealPlan";
import { startOfISOWeek } from "date-fns";



const router = Router();
router.use(authMiddleware);

// GET meal plan for a week
router.get("/:weekStart", async (req, res) => {
  try {
    const { weekStart } = req.params;
    const plan = await MealPlan.findOne({ weekStart, user: req.user.id });
    if (!plan) return res.json(null);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to get meal plan" });
  }
});

// POST generate a new plan
router.post("/generate", async (req, res) => {
  try {
    const { weekStart } = req.body;
    let plan = await MealPlan.findOne({ weekStart, user: req.user.id });
    if (!plan) {
      plan = new MealPlan({ weekStart, user: req.user.id, meals: [], grocery: [] });
      await plan.save();
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate plan" });
  }
});

// PUT update entire plan
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await MealPlan.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update plan" });
  }
});

// PUT toggle grocery purchased
router.put("/:weekStart/grocery", async (req, res) => {
  try {
    const { weekStart } = req.params;
    const { name, purchased } = req.body;
    const plan = await MealPlan.findOne({ weekStart, user: req.user.id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const g = plan.grocery.find((x: any) => x.name === name);
    if (g) g.purchased = purchased;

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle grocery item" });
  }
});

export default router;