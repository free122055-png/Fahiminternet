import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
}

export const getGeminiResponse = async (prompt: string, systemInstruction?: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    const ai = getAiClient();
    const model = "gemini-flash-latest"; 
    
    const processedHistory: { role: 'user' | 'model', parts: [{ text: string }] }[] = [];
    history.forEach((h) => {
      const text = h.parts?.[0]?.text || "";
      if (!text) return;

      if (processedHistory.length > 0 && processedHistory[processedHistory.length - 1].role === h.role) {
        processedHistory[processedHistory.length - 1].parts[0].text += "\n" + text;
      } else {
        processedHistory.push({ role: h.role, parts: [{ text }] });
      }
    });

    while (processedHistory.length > 0 && processedHistory[0].role === 'model') {
      processedHistory.shift();
    }

    const contents = [...processedHistory];
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemInstruction || "আপনি একজন দক্ষ এআই সহকারী।",
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        return response.text;
      }
      throw new Error("AI response was empty.");
    } catch (innerError: any) {
      console.warn("AI Primary Attempt Failed:", innerError);
      
      // Secondary attempt with no history and minimal config
      const simpleResponse = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "সহজ বাংলা উত্তর দিন।"
        }
      });
      
      return simpleResponse.text || "বটটি বর্তমানে কিছুটা ব্যস্ত। দয়া করে আবার চেষ্টা করুন।";
    }
  } catch (error: any) {
    console.error("Critical Gemini API Error:", error);
    const msg = error?.message || String(error);
    
    if (msg.includes('429') || msg.includes('resource_exhausted') || msg.includes('quota') || msg.includes('Quota')) {
      return "এআই সার্ভার কোটা বা লিমিট সাময়িকভাবে শেষ হয়ে গেছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
    }
    if (msg.includes('API_KEY')) return "সার্ভার কনফিগারেশন ত্রুটি। এডমিনকে জানান।";
    
    return "এআই প্রোটোকল ত্রুটি। আপনার অনুরোধ আবার করার জন্য অনুরোধ করছি। (Error: " + msg.substring(0, 50) + ")";
  }
};
