import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, image, config, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if API key is configured
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel environment variables' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    if (type === 'analyze') {
      const model = "gemini-3-flash-preview";
      const contextPrompt = config 
        ? `The client is in a ${config.climate} climate and prefers a ${config.style} aesthetic. ${config.style === 'Garden Oasis' ? 'Focus on outdoor landscaping, patio integration, and lush greenery.' : ''} Specific preferences: ${config.preferences}.`
        : "";

      const result = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: image } },
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
          responseMimeType: "application/json"
        }
      });

      // Safe JSON parsing to handle potential markdown wrappers
      const text = result.text || "{}";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return res.status(200).json(JSON.parse(cleaned));
    } else if (type === 'restyle') {
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: image } },
            { text: prompt }
          ]
        }
      });

      if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
        for (const part of result.candidates[0].content.parts) {
          if (part.inlineData) {
            return res.status(200).json({ image: `data:image/png;base64,${part.inlineData.data}` });
          }
        }
      }
      return res.status(500).json({ error: 'Failed to generate restyled image: No image data returned' });
    } else {
      // Default chatbot prompt
      const finalPrompt = prompt && prompt.trim() !== "" 
        ? prompt 
        : "Hello! I am your VisionHaven AI Concierge. How can I help you with your interior design needs today?";

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: finalPrompt,
      });

      return res.status(200).json({ text: result.text || "I'm sorry, I couldn't generate a response." });
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message 
    });
  }
}
