const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: { safetyRatings?: Array<{ category?: string; probability?: string }> };
  error?: { code?: number; message?: string };
}

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENAI_API_KEY ?? process.env.GOOGLE_API_KEY;

const PROMPT_TEMPLATE =
  "You are assisting with polishing contact form messages. Rewrite the following message to improve clarity, grammar, and tone while preserving meaning, details, and intent. Do not invent new information. " +
  "Respond with only the revised message in plain text without surrounding quotes.";

export async function enhanceContactMessage(originalMessage: string): Promise<string | null> {
  const trimmed = originalMessage.trim();

  if (!trimmed) {
    return null;
  }

  if (!GEMINI_API_KEY) {
    console.warn("Gemini API key is not configured. Skipping message enhancement.");
    return null;
  }

  try {
      const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${PROMPT_TEMPLATE}\n\nMessage:\n"""${trimmed}"""`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          topP: 0.95,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API returned a non-OK status:", response.status, response.statusText);
      return null;
    }

    const payload = (await response.json()) as GenerateContentResponse;

    if (payload.error) {
      console.error("Gemini API error:", payload.error);
      return null;
    }

    const parts = payload.candidates?.[0]?.content?.parts;

    if (!parts || parts.length === 0) {
      return null;
    }

    const combined = parts
      .map((part) => (typeof part.text === "string" ? part.text : ""))
      .join("")
      .trim();

    if (!combined) {
      return null;
    }

    return combined;
  } catch (error) {
    console.error("Failed to enhance message with Gemini:", error);
    return null;
  }
}
