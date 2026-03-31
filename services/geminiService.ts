
import { RoomAnalysis } from "../types";

export const analyzeRoomImage = async (
  base64Image: string, 
  config?: { climate: string, style: string, preferences: string }
): Promise<RoomAnalysis> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'analyze',
      image: base64Image,
      config
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "The Haven Neural Engine failed to analyze the space.");
  }

  return await response.json();
};

export const generateDesignVisual = async (prompt: string): Promise<string> => {
  // This could also be moved to backend if needed, but for now we'll use the same restyle endpoint or a generic one
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'restyle',
      prompt: `A photorealistic, high-end interior design visualization. Architectural photography, 8k. Theme: ${prompt}. No text.`
    })
  });

  if (!response.ok) return '';
  const data = await response.json();
  return data.image || '';
};

export const restyleRoomImage = async (base64Image: string, stylePrompt: string): Promise<string> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'restyle',
      image: base64Image,
      prompt: `MANDATORY: Preserve the EXACT architectural structure, window placement, furniture silhouette, and camera angle of the provided image. 
               TASK: Re-skin the surfaces using the following style: ${stylePrompt}. 
               Change only the MATERIAL TEXTURES and COLORS. 
               Keep the floor plan identical. Output should look like high-end architectural photography. ABSOLUTELY NO HUMANS OR FACES.`
    })
  });

  if (!response.ok) return '';
  const data = await response.json();
  return data.image || '';
};
