import { Router, Request } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { User } from "../models/User";

const router = Router();
router.use(authMiddleware);

interface AuthRequest extends Request {
  user?: { id: string };
}

// GET /api/goals
router.get("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const goals = {
      steps: user.steps,
      workout: user.workout,
      macros: user.macros,
      currentWeight: user.currentWeight,
      goalWeight: user.goalWeight,
      targetDate: user.targetDate ?? null,
      nonWeight: user.nonWeight,
      streaks: user.streaks,

      // legacy
      stepsTarget: user.stepsTarget,
      workoutType: user.workoutType,
      workoutDuration: user.workoutDuration,
      streak: user.streak,
    };

    res.json(goals);
  } catch (err) {
    console.error("Get goals error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/goals
router.put("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const {
      steps,
      workout,
      macros,
      currentWeight,
      goalWeight,
      targetDate,
      nonWeight,
      streaks,
    } = req.body || {};

    const update: any = {};

    if (steps && typeof steps === "object") update.steps = steps;
    if (workout && typeof workout === "object") update.workout = workout;
    if (macros && typeof macros === "object") update.macros = macros;
    if (typeof currentWeight === "number") update.currentWeight = currentWeight;
    if (typeof goalWeight === "number") update.goalWeight = goalWeight;
    if (targetDate === null || typeof targetDate === "string") update.targetDate = targetDate;
    if (nonWeight && typeof nonWeight === "object") update.nonWeight = nonWeight;
    if (streaks && typeof streaks === "object") update.streaks = streaks;

    const user = await User.findByIdAndUpdate(req.user.id, { $set: update }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      steps: user.steps,
      workout: user.workout,
      macros: user.macros,
      currentWeight: user.currentWeight,
      goalWeight: user.goalWeight,
      targetDate: user.targetDate ?? null,
      nonWeight: user.nonWeight,
      streaks: user.streaks,

      stepsTarget: user.stepsTarget,
      workoutType: user.workoutType,
      workoutDuration: user.workoutDuration,
      streak: user.streak,
    });
  } catch (err) {
    console.error("Update goals error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;