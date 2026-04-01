
import { GoogleGenAI, Type } from "@google/genai";
import { RoomAnalysis } from "../types";

// Initialize Gemini API
// The platform automatically manages the GEMINI_API_KEY for the frontend.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

/**
 * Helper to extract JSON from model response
 */
const extractJson = (text: string, type: 'analyze' | 'chat'): any => {
  try {
    const cleanedText = text.replace(/```json\n?|```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("JSON Extraction Error:", e, "Original Text:", text);
    if (type === 'analyze') {
      return {
        roomType: "Unknown Space",
        dimensionsEstimate: "Undetermined",
        lightingCondition: "Natural",
        detectedFeatures: [],
        wallCondition: "Standard",
        dominantColors: ["#FFFFFF"],
        isRoomOnly: true,
        recommendations: []
      };
    }
    return { text: text };
  }
};

export const analyzeRoomImage = async (
  base64Image: string, 
  config?: { climate: string, style: string, preferences: string }
): Promise<RoomAnalysis> => {
  const model = "gemini-3.1-pro-preview"; 
  const contextPrompt = config 
    ? `The client is in a ${config.climate} climate and prefers a ${config.style} aesthetic. ${config.style === 'Garden Oasis' ? 'Focus on outdoor landscaping, patio integration, and lush greenery.' : ''} Specific preferences: ${config.preferences}.`
    : "";

  try {
    const result = await ai.models.generateContent({
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
            isRoomOnly: { type: Type.BOOLEAN },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["wall", "floor", "ceiling", "furniture"] },
                  finish: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  environment: { type: Type.STRING },
                  imageUrl: { type: Type.STRING }
                },
                required: ["id", "name", "type", "finish", "reason"]
              }
            }
          },
          required: ["roomType", "dimensionsEstimate", "lightingCondition", "detectedFeatures", "wallCondition", "dominantColors", "isRoomOnly", "recommendations"]
        }
      }
    });

    return extractJson(result.text || "{}", 'analyze');
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error);
    throw new Error(error.message || "The Haven Neural Engine failed to analyze the space.");
  }
};

export const generateDesignVisual = async (prompt: string): Promise<string> => {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A photorealistic, high-end interior design visualization. Architectural photography, 8k. Theme: ${prompt}. No text.` }
        ]
      }
    });

    if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return '';
  } catch (error) {
    console.error('Gemini Visual Generation Error:', error);
    return '';
  }
};

export const restyleRoomImage = async (base64Image: string, stylePrompt: string): Promise<string> => {
  try {
    const result = await ai.models.generateContent({
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

    if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return '';
  } catch (error) {
    console.error('Gemini Restyle Error:', error);
    return '';
  }
};
