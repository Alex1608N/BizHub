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

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // Extensive logging for Vercel
    console.error("--- GEMINI API ERROR START ---");
    console.error("Message:", error.message);
    if (error.status) console.error("Status:", error.status);
    if (error.statusText) console.error("StatusText:", error.statusText);

    // Check if it's a fetch error from Google
    if (error.response) {
      try {
        const details = await error.response.json();
        console.error("Full Error Details:", JSON.stringify(details));
      } catch (e) {
        console.error("Could not parse error response as JSON");
      }
    }

    console.error("Stack:", error.stack);
    console.error("--- GEMINI API ERROR END ---");

    throw error;
  }
}

