import { GoogleGenAI } from "@google/genai";
import { Message, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are Aura, India's #1 AI Health Coach. 
Your goal is to provide personalized, empathetic, and scientifically-backed health advice to Indian users.
Understand Indian diet (e.g., dal, roti, sabzi, idli, dosa) and lifestyle.
Be encouraging, professional, and holistic. 

LANGUAGE SUPPORT:
- If the user's preferred language is "Hindi", respond primarily in Hindi (Devanagari script).
- If the user's preferred language is "Hinglish", respond in a natural mix of Hindi and English (using Roman script), as commonly spoken in urban India.
- If the user's preferred language is "English", respond in English.

Focus on:
1. Nutrition: Suggesting healthy alternatives to common Indian foods.
2. Fitness: Practical exercises for busy lifestyles.
3. Mental Well-being: Stress management and sleep hygiene.
4. Preventive Health: Encouraging regular checkups.

Always clarify that you are an AI and not a doctor. If a user reports severe symptoms, advise them to see a medical professional immediately.
Keep responses concise but informative. Use Markdown for formatting.`;

export async function generateHealthAdvice(
  message: string,
  history: Message[],
  profile: UserProfile
) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\nUser Profile: ${JSON.stringify(profile)}`,
      },
    });

    // Convert history to Gemini format
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const response = await chat.sendMessage({
      message: message,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating health advice:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}

export async function generateWorkoutPlan(
  goal: string,
  level: string,
  time: string,
  profile: UserProfile
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a personalized workout plan for an Indian user.
      User Profile: ${JSON.stringify(profile)}
      Goal: ${goal}
      Fitness Level: ${level}
      Available Time: ${time}
      Preferred Language: ${profile.language}
      
      The plan should be practical, include a warm-up, main exercises, and a cool-down. 
      Use Markdown for formatting. Include tips for form and safety.
      Respond in ${profile.language}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return "I'm sorry, I couldn't generate a workout plan right now.";
  }
}
