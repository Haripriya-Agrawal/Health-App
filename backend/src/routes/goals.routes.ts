// backend/routes/goals.routes.ts
import { Router } from "express";
import { authMiddleware, AuthedRequest } from "../middleware/authMiddleware";
import { User } from "../models/User";

const router = Router();
router.use(authMiddleware);

// GET /api/goals
router.get("/", async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const goals = {
      stepsTarget: user.stepsTarget,
      workoutType: user.workoutType,
      workoutDuration: user.workoutDuration,
      macros: user.macros,
      streak: user.streak,
      currentWeight: user.currentWeight,
      goalWeight: user.goalWeight,
    };

    res.json(goals);
  } catch (err) {
    console.error("Get goals error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/goals
router.put("/", async (req: AuthedRequest, res) => {
  try {
    const {
      stepsTarget,
      workoutType,
      workoutDuration,
      caloriesTarget,
      carbsTarget,
      proteinTarget,
      fibreTarget,
      fatTarget,
      weightTarget,
    } = req.body;

    const update: any = {};
    if (typeof stepsTarget === "number") update.stepsTarget = stepsTarget;
    if (typeof workoutType === "string") update.workoutType = workoutType;
    if (typeof workoutDuration === "number") update.workoutDuration = workoutDuration;
    if (typeof weightTarget === "number") update.goalWeight = weightTarget;

    // macros target mapping; note: "fibre" (frontend) -> "fiber" (backend)
    const macrosUpdate: any = {};
    if (typeof caloriesTarget === "number") macrosUpdate.calories = caloriesTarget;
    if (typeof carbsTarget === "number") macrosUpdate.carbs = carbsTarget;
    if (typeof proteinTarget === "number") macrosUpdate.protein = proteinTarget;
    if (typeof fibreTarget === "number") macrosUpdate.fiber = fibreTarget;
    if (typeof fatTarget === "number") macrosUpdate.fat = fatTarget;
    if (Object.keys(macrosUpdate).length) update.macros = macrosUpdate;

    const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      stepsTarget: user.stepsTarget,
      workoutType: user.workoutType,
      workoutDuration: user.workoutDuration,
      macros: user.macros,
      streak: user.streak,
      currentWeight: user.currentWeight,
      goalWeight: user.goalWeight,
    });
  } catch (err) {
    console.error("Update goals error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
