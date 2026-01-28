import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

    // 👇 IMPORTANT FIX
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const question = body?.question;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(question);

    return res.status(200).json({
      answer: result.response.text(),
    });

  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
}
