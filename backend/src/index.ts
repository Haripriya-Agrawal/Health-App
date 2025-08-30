// backend/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();
import authRoutes from "./routes/auth.routes";
import dailyLogRoutes from "./routes/dailyLog.routes";
import goalsRoutes from "./routes/goals.routes";
import pantryRoutes from "./routes/pantry.routes"
import mealsRoutes from "./routes/meals.routes"
import aiRouter from "./routes/ai.routes"
import nutritionixRouter from "./routes/nutritionix.routes"



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/daily-log", dailyLogRoutes);
app.use("/api/goals", goalsRoutes);

app.use("/api/meals", mealsRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/pantries", pantryRoutes); // alias
app.use("/api/ai", aiRouter);
app.use("/api/nutritionix", nutritionixRouter);



const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthapp";

(async () => {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})();
