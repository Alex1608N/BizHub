import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable");
  throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable");
}
console.log("Gemini API key present, length:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content from AI");
  }
}
