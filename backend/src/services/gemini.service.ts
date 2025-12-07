import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const getModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is missing in environment variables.");
        throw new Error("GEMINI_API_KEY is not set. Please check your .env file.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const generateRFPStructure = async (naturalLanguageInput: string) => {
    try {
        const prompt = `You are a procurement expert. Extract structured data from the user's RFP description. 
    Return a JSON object with fields: title (short summary), items (list of items with quantity and specs), budget (number or string, in INR), deadline (date or string), paymentTerms, warranty, and any other relevant fields. 
    Do not include markdown formatting, just raw JSON.
    
    Input: ${naturalLanguageInput}`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating RFP structure:", error);
        return {
            title: "Draft RFP",
            description: naturalLanguageInput,
            items: [],
            budget: "TBD",
            note: "AI generation failed, please fill details manually."
        };
    }
};

export const parseProposal = async (emailContent: string) => {
    try {
        const prompt = `You are a procurement expert. Extract structured data from the vendor's proposal email. 
    Return a JSON object with fields: price (total cost in INR), deliveryTime, warranty, paymentTerms, and any other relevant details. 
    Do not include markdown formatting, just raw JSON.
    
    Email Content: ${emailContent}`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json\n|\n```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing proposal:", error);
        return {
            price: "Unknown",
            note: "AI parsing failed."
        };
    }
};

export const compareProposalsAI = async (rfpDescription: string, proposals: any[]) => {
    try {
        const proposalsText = proposals.map((p: any, i: number) => `Vendor ${i + 1} (${p.vendor.name}): ${p.parsedData}`).join('\n\n');

        const prompt = `You are a procurement expert. Compare the following proposals against the RFP requirements. 
    Provide a summary of each, a score (0-100), and a final recommendation on which vendor to choose and why. 
    Return a JSON object with fields: comparisons (array of {vendorName, score, summary}), recommendation (string), reasoning (string).
    Do not include markdown formatting, just raw JSON.

    RFP: ${rfpDescription}

    Proposals:
    ${proposalsText}`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json\n|\n```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error comparing proposals:", error);
        return {
            comparisons: [],
            recommendation: "Error",
            reasoning: "AI comparison failed."
        };
    }
};
