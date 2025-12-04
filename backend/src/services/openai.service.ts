import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateRFPStructure = async (naturalLanguageInput: string) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a procurement expert. Extract structured data from the user's RFP description. Return a JSON object with fields: title (short summary), items (list of items with quantity and specs), budget (number or string), deadline (date or string), paymentTerms, warranty, and any other relevant fields. Do not include markdown formatting, just raw JSON."
                },
                { role: "user", content: naturalLanguageInput }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content received from OpenAI");

        return JSON.parse(content);
    } catch (error) {
        console.error("Error generating RFP structure:", error);
        // Fallback for demo if no API key or error
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
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a procurement expert. Extract structured data from the vendor's proposal email. Return a JSON object with fields: price (total cost), deliveryTime, warranty, paymentTerms, and any other relevant details. Do not include markdown formatting, just raw JSON."
                },
                { role: "user", content: emailContent }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content received from OpenAI");

        return JSON.parse(content);
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

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a procurement expert. Compare the following proposals against the RFP requirements. Provide a summary of each, a score (0-100), and a final recommendation on which vendor to choose and why. Return a JSON object with fields: comparisons (array of {vendorName, score, summary}), recommendation (string), reasoning (string)."
                },
                { role: "user", content: `RFP: ${rfpDescription}\n\nProposals:\n${proposalsText}` }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content received from OpenAI");

        return JSON.parse(content);
    } catch (error) {
        console.error("Error comparing proposals:", error);
        return {
            comparisons: [],
            recommendation: "Error",
            reasoning: "AI comparison failed."
        };
    }
};
