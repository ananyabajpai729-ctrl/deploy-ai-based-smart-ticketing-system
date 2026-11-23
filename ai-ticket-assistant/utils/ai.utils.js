
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const analyzeTicket = async (ticket) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `
                Analyse this technical support ticket.

                Title: ${ticket.title}
                Description: ${ticket.description}

                Return:
                - priority: low, medium, or high
                - helpfulNotes: concise, practical guidance for a human moderator including what resources can be used to faciltate learning process and real-world projects
                - relatedSkills: array of relevant technical skills
            `,
            config: {
                systemInstruction: `You are an AI assistant that analyses technical support tickets. Return only valid JSON.`,
                responseMimeType: "application/json",
                responseJsonSchema: {
                    type: "OBJECT",
                    properties: {
                        priority: {
                            type: "STRING",
                            enum: ["low", "medium", "high"]
                        },
                        helpfulNotes: {
                            type: "STRING"
                        },
                        relatedSkills: {
                            type: "ARRAY",
                            items: {
                                type: "STRING"
                            }
                        }
                    },
                    required: ["priority", "helpfulNotes", "relatedSkills"]
                },
                thinkingConfig: {
                    thinkingLevel: "LOW"
                }
            }
        });

        const result = JSON.parse(response.text);

        return result;

    } catch (error) {
        console.error("Gemini ticket analysis failed:", error);
        throw error;
    }
};
