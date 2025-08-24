// backend/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import dailyLogRoutes from "./routes/dailyLog.routes";
import goalsRoutes from "./routes/goals.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/daily-log", dailyLogRoutes);
app.use("/api/goals", goalsRoutes);

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthapp";

(async () => {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})();
