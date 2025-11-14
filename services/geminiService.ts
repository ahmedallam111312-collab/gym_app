
// Fix: Removed non-exported 'StartChatParams' type.
import { GoogleGenAI, Type, Modality, Chat, GenerateContentResponse } from "@google/genai";
import { Meal, ChatMessage, ActiveWorkoutPlan } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const mealAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        totalCalories: { type: Type.NUMBER, description: 'Total calories for the entire meal.' },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'Name of the food item.' },
                    calories: { type: Type.NUMBER, description: 'Estimated calories for this item.' },
                    grams: { type: Type.NUMBER, description: 'Estimated weight in grams for this item.' }
                },
                required: ['name', 'calories', 'grams']
            }
        }
    },
    required: ['totalCalories', 'items']
};

export const analyzeMealWithImage = async (base64ImageData: string): Promise<Omit<Meal, 'image' | 'date'>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData,
          },
        },
        {
          text: `You are a nutrition expert. Analyze the food items in this image. For each item, identify it, estimate its weight in grams, and its calorie count. Provide a total calorie count for the entire meal. Respond ONLY with a JSON object that matches the provided schema.`,
        },
      ],
    },
    config: {
        responseMimeType: "application/json",
        responseSchema: mealAnalysisSchema,
    },
  });

  try {
    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);
    if (typeof parsedJson.totalCalories !== 'number' || !Array.isArray(parsedJson.items)) {
        throw new Error("Invalid JSON structure received from API.");
    }
    return parsedJson;
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    console.error("Raw response text:", response.text);
    throw new Error("Could not understand the response from the AI. Please try a different image.");
  }
};


export const generateWorkoutPlan = async (prompt: string, base64ImageData?: string, mimeType?: string): Promise<string> => {
    const textPart = { text: `You are an expert personal trainer. Create a detailed and motivating workout plan based on the following request: "${prompt}". Include specific exercises, sets, reps, and rest times. IMPORTANT: Format the response using markdown. Use headings for sections, and bullet points or numbered lists for exercises. Make sure exercise names are wrapped in double asterisks, like **Bench Press**.` };
    
    const parts = [];

    if (base64ImageData && mimeType) {
        parts.push({
            inlineData: {
                mimeType,
                data: base64ImageData,
            }
        });
        textPart.text += " Also consider the gym equipment visible in the provided image when creating the plan."
    }

    parts.push(textPart);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts },
    });

    return response.text;
};

const workoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A catchy title for the workout plan.' },
        days: {
            type: Type.ARRAY,
            description: 'An array of daily workout plans.',
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: 'The day number of the plan (e.g., 1, 2, 3).' },
                    title: { type: Type.STRING, description: 'The focus for the day (e.g., "Chest & Triceps", "Full Body Strength").' },
                    exercises: {
                        type: Type.ARRAY,
                        description: 'A list of exercises for the day.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: 'The name of the exercise (e.g., "Bench Press").' },
                                description: { type: Type.STRING, description: 'A detailed description including sets, reps, and rest time (e.g., "3 sets of 8-12 reps, 60s rest").' }
                            },
                            required: ['name', 'description']
                        }
                    }
                },
                required: ['day', 'title', 'exercises']
            }
        }
    },
    required: ['title', 'days']
};


export const generateStructuredWorkoutPlan = async (prompt: string): Promise<ActiveWorkoutPlan> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              text: `You are an expert personal trainer. Create a comprehensive, multi-day workout plan based on this request: "${prompt}". The plan should be structured logically over several days. Respond ONLY with a JSON object that matches the provided schema.`,
            },
          ],
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: workoutPlanSchema,
        },
    });

    try {
        const jsonString = response.text;
        const parsedJson = JSON.parse(jsonString);
        if (typeof parsedJson.title !== 'string' || !Array.isArray(parsedJson.days)) {
            throw new Error("Invalid JSON structure received for workout plan.");
        }
        return parsedJson;
    } catch (e) {
        console.error("Failed to parse Gemini response for workout plan:", e);
        console.error("Raw response text:", response.text);
        throw new Error("Could not understand the response from the AI for the workout plan.");
    }
}

// Fix: Replaced non-exported 'StartChatParams' with an inline type for the function parameters.
export const startChat = (params: {
  model: string;
  history: ChatMessage[];
  config?: {
    systemInstruction?: string;
  };
}): Chat => {
  return ai.chats.create(params);
};
