import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let gemini = null;

export default function getGemini() {
  if (!gemini) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error(
        "GOOGLE_API_KEY not set in environment variables. Please add GOOGLE_API_KEY to your .env file."
      );
    }
    gemini = new ChatGoogleGenerativeAI({
      model: "gemini-3.5-flash-lite",
      temperature: 0.3,
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }
  return gemini;
}