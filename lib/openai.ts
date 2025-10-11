import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    
    openaiClient = new OpenAI({ apiKey });
  }
  
  return openaiClient;
}

export interface ReviewResult {
  canDelete: boolean;
  reasoning: string;
  risks: string[];
}

export async function reviewUserDataForDeletion(
  email: string,
  userData: any
): Promise<ReviewResult> {
  try {
    const openai = getOpenAIClient();
    
    const prompt = `You are a GDPR/CCPA compliance expert reviewing a data subject access request (DSAR) for deletion.

Email: ${email}

User Data Found:
${JSON.stringify(userData, null, 2)}

Analyze this data and determine:
1. Whether this data can be safely deleted under CCPA/GDPR regulations
2. Any potential business or compliance risks
3. Any dependencies or considerations

Respond in JSON format with:
{
  "canDelete": boolean,
  "reasoning": "detailed explanation",
  "risks": ["list", "of", "risks"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a GDPR/CCPA compliance expert. Analyze data deletion requests and provide clear, compliant recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as ReviewResult;
    return result;
  } catch (error) {
    console.error("Error reviewing user data:", error);
    throw error;
  }
}

