import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  customer: { type: String, default: "Anonymous" },
  source: { type: String, enum: ["web", "email", "survey", "support"], default: "web" },
  sentiment: { type: String, enum: ["positive", "negative", "neutral", null], default: null },
  category: { type: String, default: null },
  priority: { type: String, enum: ["low", "medium", "high", "critical", null], default: null },
  summary: { type: String, default: null },
  recommendation: { type: String, default: null },
  analyzedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Feedback", schema);
