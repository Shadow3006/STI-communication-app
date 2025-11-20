import { GoogleGenAI, GenerateContentResponse, Type, Chat } from "@google/genai";
import { EducationalContent } from '../types';

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchTechAnalysis = async (tech: string): Promise<EducationalContent> => {
  try {
    const ai = getAI();
    const model = 'gemini-2.5-flash';

    const prompt = `
      Analyze the ${tech} technology in the context of a Quantum-Secure Communication App.
      Provide the output in JSON format with the following fields:
      - title: The name of the tech (e.g., QRNG).
      - role: A one-sentence description of its role in the protocol.
      - positive: An array of 3 positive use cases or benefits.
      - negative: An array of 3 negative use cases, limitations, or risks.
      - summary: A short paragraph explaining how it works in simple terms for a presentation.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            role: { type: Type.STRING },
            positive: { type: Type.ARRAY, items: { type: Type.STRING } },
            negative: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    let text = response.text || "";
    // Sanitize: Remove markdown code blocks if the model adds them
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    if (text) {
      const data = JSON.parse(text);
      // Validate and sanitize structure to prevent render crashes
      return {
        title: data.title || tech,
        role: data.role || "Role undefined",
        positive: Array.isArray(data.positive) ? data.positive : ["Standard implementation"],
        negative: Array.isArray(data.negative) ? data.negative : ["Standard risks"],
        summary: data.summary || "Summary unavailable."
      };
    }
    throw new Error("No response text");
  } catch (error) {
    console.error(`Error fetching analysis for ${tech}:`, error);
    // Fallback content if API fails or key is missing
    return {
      title: tech,
      role: "Security Component (Offline Mode)",
      positive: ["Enhances security architecture", "Protects against specific vectors", "Standard industry practice"],
      negative: ["Requires proper implementation", "Computational overhead", "Complexity in management"],
      summary: "Live analysis unavailable. This component is critical for the QuantumShield protocol. Please check your network connection or API configuration."
    };
  }
};

export const generateProtocolSummary = async (): Promise<string> => {
    try {
        const ai = getAI();
        const prompt = `
            Explain the combined system advantages and trade-offs of a communication app using QRNG, Kyber, and Dilithium together.
            Focus on how they reinforce each other against quantum and classical threats.
            Keep it under 200 words.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Summary unavailable.";
    } catch (e) {
        console.error("Summary generation error:", e);
        return "System leverages QRNG for true entropy, Kyber for post-quantum encryption, and Dilithium for authentication. Together they form a defense-in-depth architecture against both classical and future quantum threats, though with higher computational requirements than traditional methods.";
    }
}

let chatSession: Chat | null = null;

export const initializeSecureChat = () => {
  try {
    const ai = getAI();
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are Bob, a secure operative using a Quantum-Secure communication channel. You are talking to Alice. Your responses should be concise, professional, and acknowledge the security of the line. If asked, confirm that Kyber encryption and Dilithium signatures are active.",
      }
    });
  } catch (e) {
    console.error("Failed to initialize chat session", e);
  }
};

export const sendSecureMessage = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
        initializeSecureChat();
    }
    if (!chatSession) {
        // Fallback for purely offline/demo mode if API key is totally missing/invalid
        return "Secure Channel Confirmation: Message received via offline protocol.";
    }
    const response = await chatSession.sendMessage({ message });
    return response.text || "Communication error.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Secure link disrupted. Operating in offline simulation mode.";
  }
};