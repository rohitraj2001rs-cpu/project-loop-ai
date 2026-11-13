import express from "express";
import Feedback from "../models/Feedback.js";
import { auth } from "../middleware/auth.js";
import { analyzeFeedback } from "../services/aiService.js";

const router = express.Router();
router.use(auth);

router.post("/", async (req, res) => {
  try {
    const feedback = await Feedback.create({ ...req.body, userId: req.user.id });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  const { search, sentiment, category, priority } = req.query;
  const filter = { userId: req.user.id };
  if (sentiment) filter.sentiment = sentiment;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (search) filter.text = { $regex: search, $options: "i" };

  const feedback = await Feedback.find(filter).sort({ createdAt: -1 });
  res.json(feedback);
});

router.get("/:id", async (req, res) => {
  const item = await Feedback.findOne({ _id: req.params.id, userId: req.user.id });
  if (!item) return res.status(404).json({ message: "Feedback not found" });
  res.json(item);
});

router.put("/:id", async (req, res) => {
  const item = await Feedback.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: "Feedback not found" });
  res.json(item);
});

router.delete("/:id", async (req, res) => {
  const item = await Feedback.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!item) return res.status(404).json({ message: "Feedback not found" });
  res.json({ message: "Feedback deleted" });
});

router.post("/:id/analyze", async (req, res) => {
  try {
    const item = await Feedback.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: "Feedback not found" });

    const result = await analyzeFeedback(item.text);
    Object.assign(item, result, { analyzedAt: new Date() });
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
