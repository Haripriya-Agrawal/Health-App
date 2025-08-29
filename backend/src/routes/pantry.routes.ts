import { Router } from "express";
import { authMiddleware, AuthedRequest } from "../middleware/authMiddleware";
import { PantryItem } from "../models/PantryItem";

const router = Router();
router.use(authMiddleware);

// GET all
router.get("/", async (req: AuthedRequest, res) => {
  const items = await PantryItem.find({ userId: req.userId }).sort({ updatedAt: -1 }).lean();
  res.json(items);
});

// UPSERT by name (and update unit/qty/tags)
router.post("/", async (req: AuthedRequest, res) => {
  const { name, unit = "pcs", qty = 0, tags = [] } = req.body || {};
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "name is required" });
  }

  // normalize unit & qty
  const allowedUnits = new Set(["kg", "g", "l", "ml", "pcs", "dozen", "packet"]);
  const unitNorm = String(unit).toLowerCase();
  if (!allowedUnits.has(unitNorm)) {
    return res.status(400).json({ message: `unit '${unit}' not allowed` });
  }

  const qtyNum = Number(qty);
  const safeQty = Number.isFinite(qtyNum) && qtyNum >= 0 ? qtyNum : 0;

  // upsert by (userId, name)
  const existing = await PantryItem.findOne({ userId: req.userId, name });
  if (existing) {
    existing.unit = unitNorm;
    existing.qty = safeQty;
    existing.tags = Array.isArray(tags) ? tags : existing.tags;
    await existing.save();
    return res.json(existing);
  }
  const created = await PantryItem.create({
    userId: req.userId,
    name,
    unit: unitNorm,
    qty: safeQty,
    tags: Array.isArray(tags) ? tags : [],
  });
  res.json(created);
});

// UPDATE qty
router.put("/:id", async (req: AuthedRequest, res) => {
  const qtyNum = Number(req.body?.qty);
  const safeQty = Number.isFinite(qtyNum) && qtyNum >= 0 ? qtyNum : 0;

  const updated = await PantryItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $set: { qty: safeQty } },
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req: AuthedRequest, res) => {
  await PantryItem.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
});

export default router;
