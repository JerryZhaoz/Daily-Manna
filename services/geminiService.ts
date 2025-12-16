import { GoogleGenAI, Type } from "@google/genai";
import { DailyContent } from "../types";
import { FALLBACK_VERSES } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const fetchDailyVerse = async (): Promise<DailyContent> => {
  const ai = getClient();
  const todayStr = new Date().toISOString().split('T')[0];

  // If no API key, return a random fallback to ensure the app works visually
  if (!ai) {
    console.warn("No API Key found. Using fallback content.");
    const random = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
    return { ...random, date: todayStr };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a short, encouraging Bible verse for daily Christian meditation. Include the text, the reference (book chapter:verse), and a very brief, one-sentence reflective thought suitable for a 2-minute meditation.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scriptureText: { type: Type.STRING },
            reference: { type: Type.STRING },
            thought: { type: Type.STRING },
          },
          required: ["scriptureText", "reference", "thought"],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        date: todayStr,
        scriptureText: data.scriptureText,
        reference: data.reference,
        thought: data.thought,
      };
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Failed to fetch verse:", error);
    const random = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
    return { ...random, date: todayStr };
  }
};
