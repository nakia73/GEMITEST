
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Rely on process.env.API_KEY being available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Motion Planner
 * Analyzes the single source image and the user's text request.
 * Generates a list of specific visual descriptions for each frame to create the animation.
 */
export const planAnimationPrompts = async (
  sourceImageBase64: string,
  mimeType: string,
  userPrompt: string,
  frameCount: number
): Promise<string[]> => {
  if (!process.env.API_KEY) throw new Error("API Key not found");

  const systemInstruction = `
    You are an expert 2D Animation Director.
    Your task is to take a Source Image and a "Motion Prompt" from a user.
    You must create a frame-by-frame plan to animate the static image according to the prompt.
    
    Input:
    - Source Image (Visual context)
    - Motion Prompt (e.g., "Make him smile")
    - Frame Count: ${frameCount}

    Output:
    - A JSON object containing an array of ${frameCount} strings.
    - Each string must be a visual description of what that specific frame looks like.
    
    Rules for Consistency:
    1. The FIRST prompt should be very close to the original image but with the movement just starting (approx 1/${frameCount} progress).
    2. The LAST prompt should be the completed action.
    3. Intermediate prompts must bridge the gap linearly.
    4. CRITICAL: You MUST describe the visual features of the character (hair color, clothes, background) in EVERY prompt to ensure the image generator doesn't hallucinate new details.
    5. Style: Append "game asset style, flat background, consistent character" to every prompt.
  `;

  const requestContent = `
    Motion Request: "${userPrompt}"
    Generate ${frameCount} progressive prompts to animate this image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: sourceImageBase64 } },
          { text: requestContent }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The ordered list of visual prompts for each frame"
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned from Gemini");

    // Clean potential markdown code blocks (```json ... ```)
    const cleanedJson = jsonText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);
    
    return parsed.prompts || [];
  } catch (error) {
    console.error("Error planning animation:", error);
    throw error;
  }
};

/**
 * Step 2: Reference-Anchored Rendering
 * Generates a single frame using the ORIGINAL source image + the specific frame prompt.
 * Using 'gemini-2.5-flash-image' (Nano Banana) with image input acts as an edit/variation.
 */
export const generateFrameFromReference = async (
  sourceImageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType, // Use the correct MIME type (e.g. image/jpeg, image/png)
              data: sourceImageBase64 
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE],
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts || parts.length === 0) {
      const finishReason = response.candidates?.[0]?.finishReason;
      if (finishReason) {
        throw new Error(`Generation failed with reason: ${finishReason}`);
      }
      throw new Error("No image generated (empty response)");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Image data not found in response");
  } catch (error) {
    console.error("Error generating frame:", error);
    throw error;
  }
};
