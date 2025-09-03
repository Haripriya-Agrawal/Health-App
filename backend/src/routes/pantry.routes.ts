import { Router, Request } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { PantryItem } from "../models/PantryItem";

const router = Router();
router.use(authMiddleware);

interface AuthRequest extends Request {
  user?: { id: string };
}

// GET all pantry items
router.get("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const items = await PantryItem.find({ userId: req.user.id }).sort({ updatedAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error("Fetch pantry error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPSERT by name (and update unit/qty/tags)
router.post("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { name, unit = "pcs", qty = 0, tags = [] } = req.body || {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" });
    }

    const allowedUnits = new Set(["kg", "g", "l", "ml", "pcs", "dozen", "packet"]);
    const unitNorm = String(unit).toLowerCase();
    if (!allowedUnits.has(unitNorm)) {
      return res.status(400).json({ message: `unit '${unit}' not allowed` });
    }

    const qtyNum = Number(qty);
    const safeQty = Number.isFinite(qtyNum) && qtyNum >= 0 ? qtyNum : 0;

    // upsert by (userId, name)
    const existing = await PantryItem.findOne({ userId: req.user.id, name });
    if (existing) {
      existing.unit = unitNorm;
      existing.qty = safeQty;
      existing.tags = Array.isArray(tags) ? tags : existing.tags;
      await existing.save();
      return res.json(existing);
    }

    const created = await PantryItem.create({
      userId: req.user.id,
      name,
      unit: unitNorm,
      qty: safeQty,
      tags: Array.isArray(tags) ? tags : [],
    });
    res.json(created);
  } catch (err) {
    console.error("Upsert pantry error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE qty
router.put("/:id", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const qtyNum = Number(req.body?.qty);
    const safeQty = Number.isFinite(qtyNum) && qtyNum >= 0 ? qtyNum : 0;

    const updated = await PantryItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { qty: safeQty } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Update pantry error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    await PantryItem.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete pantry error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;