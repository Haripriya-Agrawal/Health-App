import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import OpenAI from "openai";

const router = Router();
router.use(authMiddleware);

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

router.post("/meal-suggest", async (req, res) => {
  try {
    const { mealType, pantry, targets } = req.body || {};

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a meal planner assistant. Respond ONLY in valid JSON with keys {name, ingredients, macros}. Ingredients should use available pantry items.",
        },
        {
          role: "user",
          content: JSON.stringify({ mealType, pantry, targets }),
        },
      ],
      response_format: { type: "json_object" }, // ✅ simpler & safe
    });

    const raw = completion.choices[0].message.content;
    if (!raw) {
      return res.status(500).json({ message: "No response from AI" });
    }

    const suggestion = JSON.parse(raw); // ✅ standard JSON parse
    res.json(suggestion);
  } catch (err: any) {
    console.error("AI meal suggest failed:", err.response?.data || err.message || err);
    res.status(500).json({ message: "Meal suggestion failed" });
  }
});

export default router;