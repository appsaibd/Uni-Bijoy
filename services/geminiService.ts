import { GoogleGenAI } from "@google/genai";
import { ConversionDirection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a highly accurate Bengali text encoding converter. 
Your sole purpose is to convert text between Unicode (standard web Bengali) and Bijoy 52 (ANSI/ASCII legacy encoding used with fonts like SutonnyMJ).

Rules:
1. If the request is 'UnicodeToBijoy', convert the provided standard Bengali text into Bijoy 52 ASCII strings. The output will look like random English characters and symbols (e.g., 'Avwg' for 'আমি').
2. If the request is 'BijoyToUnicode', convert the provided Bijoy ASCII string back to standard Bengali Unicode.
3. Preserve all punctuation and formatting exactly.
4. Do NOT output any explanations, markdown code blocks, or preamble. Return ONLY the converted raw text string.
5. If the input is empty or invalid, return an empty string.
`;

export const convertTextWithGemini = async (
  text: string,
  direction: ConversionDirection
): Promise<string> => {
  if (!text.trim()) return "";

  try {
    const prompt = direction === ConversionDirection.UnicodeToBijoy
      ? `Convert this Unicode Bengali text to Bijoy 52 ANSI: \n\n${text}`
      : `Convert this Bijoy 52 ANSI text to Unicode Bengali: \n\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Low temperature for deterministic, accurate conversion
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed on simple tasks
      },
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Conversion failed:", error);
    throw new Error("Failed to convert text. Please check your connection or try again.");
  }
};