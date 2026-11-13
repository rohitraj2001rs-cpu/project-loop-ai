import express from "express";
import Feedback from "../models/Feedback.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

router.get("/overview", async (req, res) => {
  const rows = await Feedback.find({ userId: req.user.id });
  const total = rows.length;

  const count = (key, value) => rows.filter(x => x[key] === value).length;

  res.json({
    total,
    analyzed: rows.filter(x => x.analyzedAt).length,
    positive: count("sentiment", "positive"),
    negative: count("sentiment", "negative"),
    neutral: count("sentiment", "neutral"),
    highPriority: rows.filter(x => ["high", "critical"].includes(x.priority)).length
  });
});

export default router;
