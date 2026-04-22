import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable");
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateContent(prompt: string) {
  try {
    const ai = getGenAI();
    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }

    // Forțăm versiunea v1 a API-ului pentru stabilitate în 2026
    const model = ai.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview"
    }, { apiVersion: 'v1beta' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("=== GEMINI ERROR ===");
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    throw error;
  }
}
