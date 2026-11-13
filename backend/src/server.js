import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import feedbackRoutes from "./routes/feedback.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_, res) => res.json({ status: "ok", service: "project-loop-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch(err => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });
