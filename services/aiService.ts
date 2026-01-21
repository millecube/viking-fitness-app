import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Assumption: process.env.API_KEY is available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateMotivationalCaption = async (base64Image: string): Promise<string> => {
  try {
    // Strip header if present (e.g., "data:image/png;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: 'image/jpeg', 
              data: cleanBase64 
            } 
          },
          { 
            text: "Analyze this fitness physique photo. Act as a hardcore gym coach. Write a short, intense, 1-sentence motivational caption for social media celebrating the progress seen. Focus on grind, discipline, and gains. Do not mention that you are an AI." 
          }
        ]
      }
    });

    return response.text || "Grind never stops. Keep pushing!";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Error generating caption. But your gains look great!";
  }
};