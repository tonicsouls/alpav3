import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedFileInfo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeFileContent = async (fileContent: string, model: string): Promise<ExtractedFileInfo> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Analyze the following file content and extract the required information: \n\n---START CONTENT---\n${fileContent}\n---END CONTENT---`,
            config: {
                systemInstruction: `You are a secure document analyst for a bank. Your task is to analyze the provided text content, identify the type of document (e.g., 'Invoice', 'Tax Form', 'Loan Application', 'Other'), and extract the most prominent single piece of customer identification data. This could be a customer name, an account ID, an address, or an email. Prioritize official IDs or account numbers if present. The response MUST be a JSON object conforming to the provided schema.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        "fileType": { 
                            type: Type.STRING, 
                            description: "The determined type of the document (e.g., Invoice, Tax Form, Loan Application, Other)." 
                        },
                        "customerIdentifier": { 
                            type: Type.STRING, 
                            description: "The single most reliable piece of customer identification found (e.g., email address, account name, customer ID, or full address). Set to 'N/A' if none found." 
                        }
                    },
                    required: ["fileType", "customerIdentifier"]
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        return parsedJson as ExtractedFileInfo;

    } catch (error) {
        console.error("Error analyzing file with Gemini API:", error);
        throw new Error("Failed to analyze document. The AI model could not process the request.");
    }
};