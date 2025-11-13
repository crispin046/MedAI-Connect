import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { PatientData, TriageResult, AnalysisType, GroundingSource } from '../types';
import type { GenerateContentResponse } from '@google/genai';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const constructTriagePrompt = (patientData: PatientData, language: string): string => {
  return `
    Analyze the following patient case for a triage nurse in a rural African clinic.
    Your task is to return a single JSON object containing your analysis.
    The entire response must be ONLY the JSON object, optionally enclosed in a markdown code block (e.g., \`\`\`json ... \`\`\`). Do not add any other explanatory text before or after the JSON.
    The JSON object must have the following structure:
    {
      "possibleConditions": ["string"],
      "urgencyLevel": "Low" | "Medium" | "High" | "Critical",
      "referralPriority": "Urgent" | "Semi-Urgent" | "Routine",
      "triageExplanation": "string",
      "recommendedNextSteps": ["string"]
    }
    
    All string values within the JSON object, including explanations and recommendations, MUST be in the specified language: ${language}.

    Patient Data to analyze:
    - Age: ${patientData.age}
    - Symptoms: ${patientData.symptoms}
    - Vitals: ${patientData.vitals}
    - Medical History: ${patientData.history}
  `;
};

const parseGroundingSources = (response: GenerateContentResponse): GroundingSource[] => {
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!groundingChunks) return [];

    return groundingChunks.map(chunk => {
        if (chunk.web) {
            return { uri: chunk.web.uri, title: chunk.web.title || 'Web Source', type: 'web' };
        }
        if (chunk.maps) {
            return { uri: chunk.maps.uri, title: chunk.maps.title || 'Map Location', type: 'maps' };
        }
        return null;
    }).filter((source): source is GroundingSource => source !== null);
};


export const getTriageAnalysis = async (patientData: PatientData, type: AnalysisType, language: string): Promise<TriageResult> => {
    const prompt = constructTriagePrompt(patientData, language);
    
    const model = type === 'detailed' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const config = type === 'detailed' 
        ? { thinkingConfig: { thinkingBudget: 32768 }, tools: [{ googleSearch: {} }] }
        : { tools: [{ googleSearch: {} }] };

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: config
    });
    
    let jsonText = response.text.trim();
    const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch?.[1]) {
        jsonText = jsonMatch[1];
    }
    
    const sources = parseGroundingSources(response);
    
    try {
        const parsedResult = JSON.parse(jsonText) as TriageResult;
        return { ...parsedResult, sources };
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The AI returned an invalid response format.");
    }
};

export const findNearbyClinics = async (): Promise<{ text: string, sources: GroundingSource[] }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: "What are the nearest hospitals or clinics to my current location?",
                        config: {
                            tools: [{ googleMaps: {} }],
                            toolConfig: {
                                retrievalConfig: {
                                    latLng: { latitude, longitude },
                                },
                            },
                        },
                    });
                    const sources = parseGroundingSources(response);
                    resolve({ text: response.text, sources });
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`));
            }
        );
    });
};

export const continueChatSession = async (chat: Chat | null, message: string, language: string) => {
    let chatSession = chat;
    if (!chatSession) {
        chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are MedAI, a helpful medical chatbot for health workers. Provide clear, concise information. Use Google Search for up-to-date information when necessary. All your responses must be in ${language}.`,
                tools: [{ googleSearch: {} }]
            },
        });
    }
    const stream = await chatSession.sendMessageStream({ message });
    return { stream, chatSession };
};
