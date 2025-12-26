import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // Pass the key explicitly
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What is the capital of France?",
  });
  console.log(response.text);
}

main();
