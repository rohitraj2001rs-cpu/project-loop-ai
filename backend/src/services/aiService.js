import { GoogleGenerativeAI } from "@google/generative-ai";

function normalizeAiJson(rawText) {
  if (!rawText) throw new Error("AI returned empty response");

  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw new Error("AI response was not valid JSON");
  }
}

export async function analyzeFeedback(text) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze this customer feedback and return ONLY valid JSON.
Fields:
sentiment: positive | negative | neutral
category: one short category such as product, delivery, support, pricing, usability, billing
priority: low | medium | high | critical
summary: one concise sentence
recommendation: one practical business action

Feedback:
${text}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const parsed = normalizeAiJson(raw);

  const allowedSentiments = ["positive", "negative", "neutral"];
  const allowedPriorities = ["low", "medium", "high", "critical"];

  if (!parsed.sentiment || !allowedSentiments.includes(parsed.sentiment)) {
    parsed.sentiment = "neutral";
  }

  if (!parsed.priority || !allowedPriorities.includes(parsed.priority)) {
    parsed.priority = "medium";
  }

  if (!parsed.category) {
    parsed.category = "general";
  }

  if (!parsed.summary) {
    parsed.summary = "Customer feedback reviewed.";
  }

  if (!parsed.recommendation) {
    parsed.recommendation = "Review the feedback and respond with a clear follow-up action.";
  }

  return parsed;
}
