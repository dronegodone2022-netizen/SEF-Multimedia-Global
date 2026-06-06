
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getCreativeIdeas(serviceType: string, goal: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am a client looking for ${serviceType} services. My goal is: ${goal}. As a creative expert at SEF Multimedia Global, suggest 3 unique and creative project ideas or directions we could take to achieve this goal. Keep it concise and professional.`,
        config: {
          systemInstruction: "You are a senior creative consultant at SEF Multimedia Global, a top-tier multimedia agency. Your tone is inspiring, professional, and innovative.",
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm sorry, I'm having trouble coming up with ideas right now. Please contact our team directly for a personalized consultation!";
    }
  }
}

export const geminiService = new GeminiService();
