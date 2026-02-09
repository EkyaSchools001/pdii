/**
 * Groq AI Service
 * Handles communication with the Groq Cloud API for report analysis.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface GroqResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

export async function getGroqAnalysis(data: any, type: 'teacher' | 'observation' | 'admin'): Promise<string> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Groq API Key not found. Please add VITE_GROQ_API_KEY to your .env file.");
    }

    const systemPrompt = `You are an expert Educational Data Analyst. 
Analyze the provided JSON data and provide a concise, professional summary with:
1. Key Strengths
2. Areas for Growth
3. Actionable Recommendations

Format the output in clear Markdown with appropriate headers. Keep it professional and encouraging.`;

    const userPrompt = `Please analyze this ${type} report data: ${JSON.stringify(data, null, 2)}`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to fetch from Groq API");
        }

        const result: GroqResponse = await response.json();
        return result.choices[0].message.content;
    } catch (error) {
        console.error("Groq Analysis Error:", error);
        throw error;
    }
}
