import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
  try {
    const prompt = "Transcribe this audio message. Return only the transcribed text, nothing else. If the audio is unclear, return 'Transcription unavailable'.";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Audio,
              mimeType: mimeType
            }
          }
        ]
      }
    });
    
    return response.text?.trim() || "Transcription unavailable";
  } catch (error) {
    console.error("Transcription error:", error);
    return "Transcription failed";
  }
}
