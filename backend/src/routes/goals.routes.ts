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

    // Build response matching frontend Goals type
    const goals = {
      steps: user.steps,                                  // {min,max}
      workout: user.workout,                              // {type, mode, target}
      macros: user.macros,                                // {calories:{min,max}, ...}
      currentWeight: user.currentWeight,
      goalWeight: user.goalWeight,
      targetDate: user.targetDate ?? null,
      nonWeight: user.nonWeight,                          // {sleepHours:{min,max}, waterLiters:{min,max}}
      streaks: user.streaks,                              // {stepsDaysPerWeekMin, caloriesWithinGoalDaysPerWeekMin}

      // legacy (optional): keep for old pages that still read them
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
router.put("/", async (req: AuthedRequest, res) => {
  try {
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

    const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true });
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
