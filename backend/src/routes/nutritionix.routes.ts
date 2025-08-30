import { Router } from "express";
import axios from "axios";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.post("/analyze", async (req, res) => {
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ message: "query is required" });

  try {
    const nx = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      { query },
      {
        headers: {
          "x-app-id": process.env.NUTRITIONIX_APP_ID!,
          "x-app-key": process.env.NUTRITIONIX_APP_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const foods = nx.data?.foods || [];
    const macros = foods.reduce(
      (acc: any, f: any) => {
        acc.calories += Number(f.nf_calories || 0);
        acc.protein += Number(f.nf_protein || 0);
        acc.carbs += Number(f.nf_total_carbohydrate || 0);
        acc.fibre += Number(f.nf_dietary_fiber || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fibre: 0 }
    );

    res.json({ name: query, macros });
  } catch (e: any) {
    console.error("Nutritionix error", e?.response?.data || e);
    res.status(500).json({ message: "Nutritionix request failed" });
  }
});

export default router;