// backend/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import dailyLogRoutes from "./routes/dailyLog.routes";
import goalsRoutes from "./routes/goals.routes";
import pantryRoutes from "./routes/pantry.routes";
import mealsRoutes from "./routes/meals.routes";
import aiRouter from "./routes/ai.routes";
import nutritionixRouter from "./routes/nutritionix.routes";
import mealPlanRoutes from "./routes/mealPlan.routes";

/* --------------------------- App & Middleware --------------------------- */

const app = express();

// Trust proxy (important on Render/behind proxies if you ever use secure cookies)
app.set("trust proxy", 1);

// Allow only our frontends (Vercel prod + previews + localhost)
const allowedOrigins = new Set<string>([
  "http://localhost:5173", // Vite dev
  process.env.FRONTEND_URL_PROD || "", // e.g. https://yourapp.vercel.app or custom domain
  process.env.FRONTEND_URL_STAGING || "", // optional specific preview domain, if you set one
]);

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // allow server-to-server, curl, Postman
    if (!origin) return cb(null, true);

    const isVercelPreview = /\.vercel\.app$/.test(origin);
    const isAllowed = isVercelPreview || allowedOrigins.has(origin);

    return cb(isAllowed ? null : new Error("CORS blocked"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

/* --------------------------------- Routes -------------------------------- */

app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));
// alias some monitors use:
app.get("/api/healthz", (_req, res) => res.status(200).send("ok"));

app.use("/api/auth", authRoutes);
app.use("/api/daily-log", dailyLogRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/pantries", pantryRoutes); // alias
app.use("/api/ai", aiRouter);
app.use("/api/nutritionix", nutritionixRouter);

/* ------------------------------ Bootstrapping ----------------------------- */

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthapp";

(async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 API ready on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();