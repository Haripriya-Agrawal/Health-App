// backend/src/index.ts
import express from "express";
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

// Behind proxies (Render, etc.)
app.set("trust proxy", 1);

// ======= HARDENED CORS (manual; Express 5–safe) =======
const ALLOWED = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL_PROD || "",     // e.g. https://ai-health-analytics.vercel.app
  process.env.FRONTEND_URL_STAGING || "",  // optional specific preview
];
const DEBUG_CORS = process.env.DEBUG_CORS === "1";

app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;

  // allow Postman/curl/no-origin, allow *.vercel.app previews, and allow explicit list
  const isVercelPreview = origin ? /\.vercel\.app$/.test(origin) : false;
  const isAllowed =
    !origin || isVercelPreview || (origin ? ALLOWED.includes(origin) : false);

  if (DEBUG_CORS) {
    // eslint-disable-next-line no-console
    console.log("[CORS]", {
      origin,
      isVercelPreview,
      isAllowed,
      method: req.method,
      path: req.path,
    });
  }

  // Always vary by Origin so caches behave
  res.setHeader("Vary", "Origin");

  if (isAllowed) {
    // Reflect the exact Origin (not *)
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
    else res.setHeader("Access-Control-Allow-Origin", "*"); // for non-browser clients

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Short-circuit preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(isAllowed ? 204 : 403);
  }

  return next();
});

// Body parser AFTER CORS
app.use(express.json({ limit: "1mb" }));

/* --------------------------------- Routes -------------------------------- */

app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));
app.get("/api/healthz", (_req, res) => res.status(200).send("ok")); // alias

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