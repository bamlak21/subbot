import OpenAI from "openai";
import { config } from "../config";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openRouter,
});

export const analyzeMessageAI = async (message: string) => {
  try {
    const prompt = `
     Analyze the following message and strictly respond with JSON only.
Detect if it is:
1. Spam
2. Toxic/Offensive
3. Scam/Phishing

Respond ONLY as:
{ "flagged": boolean, "reason": string, "severity": "low" | "medium" | "high" }

Message: """${message}"""
    `;

    const response = await openai.chat.completions.create({
      model: "deepseek-v3:free",
      messages: [
        { role: "system", content: "You are a content moderator." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    console.log(response.choices[0].message);

    const content = response.choices[0].message?.content || "{}";

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { flagged: false, reason: "Parsing error", severity: "low" };
    }

    return result;
  } catch (error) {
    console.error("AI analysis error:", error);
    return { flagged: false, reason: "", severity: "low" };
  }
};
