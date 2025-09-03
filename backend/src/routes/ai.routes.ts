import { Router, Request } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
router.use(authMiddleware);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface MealSuggestBody {
  mealType: string;
  pantry: { name: string; unit: string }[];
}

router.post(
  "/meal-suggest",
  async (req: Request<{}, {}, MealSuggestBody>, res) => {
    try {
      const { mealType, pantry } = req.body;

      if (!mealType || !Array.isArray(pantry)) {
        return res
          .status(400)
          .json({ message: "mealType and pantry[] are required" });
      }

      const prompt = `
        You are a nutritionist. Suggest a ${mealType} using only these pantry items:
        ${pantry.map((p) => p.name).join(", ")}.

        Respond strictly in JSON with this format:
        {
          "name": "Meal Name",
          "macros": {
            "calories": number,
            "protein": number,
            "carbs": number,
            "fibre": number
          }
        }
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);

      const text = result.response.text();

      // ✅ Clean Gemini output (remove markdown fences if present)
      const cleaned = text.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("❌ Gemini returned invalid JSON:", text);
        return res.status(500).json({ message: "Gemini returned invalid JSON" });
      }

      res.json(parsed);
    } catch (err: any) {
      console.error(
        "AI meal suggest error:",
        err.response?.data || err.message || err
      );
      res.status(500).json({ message: "Meal suggestion failed" });
    }
  }
);

export default router;