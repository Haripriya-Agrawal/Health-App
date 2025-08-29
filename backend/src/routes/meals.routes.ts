import { Router } from "express";
import type { Request, Response } from "express";
import { Types } from "mongoose";
import { MealTemplate } from "../models/MealTemplate";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

// GET all templates: global (no userId) + user-owned
router.get("/", async (req: any, res: Response) => {
  const userId = req.userId ? new Types.ObjectId(req.userId) : undefined;
  const query = userId ? { $or: [{ userId }, { userId: { $exists: false } }] } : {};
  const items = await MealTemplate.find(query).sort({ updatedAt: -1 }).lean();
  res.json(items);
});

// POST create a template (optional; handy for testing)
router.post("/", async (req: any, res: Response) => {
  const { name, mealType, ingredients = [], macros, tags = [] } = req.body || {};
  if (!name || !mealType) {
    return res.status(400).json({ message: "name and mealType are required" });
  }
  const doc = await MealTemplate.create({
    userId: new Types.ObjectId(req.userId),
    name,
    mealType,
    ingredients,
    macros,
    tags,
  });
  res.json(doc.toObject());
});

export default router;