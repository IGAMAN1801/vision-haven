
import { GoogleGenAI, Type } from "@google/genai";
import { RoomAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseSafeJson = (text: string) => {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", text);
    throw new Error("The Haven Neural Engine returned an invalid data format.");
  }
};

export const analyzeRoomImage = async (
  base64Image: string, 
  config?: { climate: string, style: string, preferences: string }
): Promise<RoomAnalysis> => {
  const model = "gemini-3-flash-preview";
  const contextPrompt = config 
    ? `The client is in a ${config.climate} climate and prefers a ${config.style} aesthetic. ${config.style === 'Garden Oasis' ? 'Focus on outdoor landscaping, patio integration, and lush greenery.' : ''} Specific preferences: ${config.preferences}.`
    : "";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        {
          text: `Perform a high-luxury spatial analysis of this room. ${contextPrompt}
          CRITICAL SECURITY PROTOCOL: Inspect the image for ANY biological presence (Humans, Faces, Animals, or Pets). 
          If ANY face or person is detected, you MUST set "isRoomOnly" to false. This is a strict safety requirement.
          Analyze: 1. Room Type. 2. Lighting. 3. Structural Features. 4. Recommended textures for surfaces.
          Return a strict JSON object following the RoomAnalysis schema.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roomType: { type: Type.STRING },
          dimensionsEstimate: { type: Type.STRING },
          lightingCondition: { type: Type.STRING },
          detectedFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
          wallCondition: { type: Type.STRING },
          dominantColors: { type: Type.ARRAY, items: { type: Type.STRING } },
          isRoomOnly: { type: Type.BOOLEAN, description: "False if any humans, faces, or animals are present in the scene." },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                finish: { type: Type.STRING },
                reason: { type: Type.STRING },
                environment: { type: Type.STRING },
                imageUrl: { type: Type.STRING }
              },
              required: ["id", "name", "type", "finish", "reason", "environment", "imageUrl"]
            }
          }
        },
        required: ["roomType", "dimensionsEstimate", "lightingCondition", "detectedFeatures", "wallCondition", "dominantColors", "isRoomOnly", "recommendations"]
      }
    }
  });

  return parseSafeJson(response.text || "{}");
};

export const generateDesignVisual = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A photorealistic, high-end interior design visualization. Architectural photography, 8k. Theme: ${prompt}. No text.` }]
    }
  });

  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return '';
};

export const restyleRoomImage = async (base64Image: string, stylePrompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: `MANDATORY: Preserve the EXACT architectural structure, window placement, furniture silhouette, and camera angle of the provided image. 
                 TASK: Re-skin the surfaces using the following style: ${stylePrompt}. 
                 Change only the MATERIAL TEXTURES and COLORS. 
                 Keep the floor plan identical. Output should look like high-end architectural photography. ABSOLUTELY NO HUMANS OR FACES.` }
      ]
    }
  });

  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return '';
};
