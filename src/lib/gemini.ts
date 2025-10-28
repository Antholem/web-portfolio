const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GenerateContentPart {
  text?: string;
}

interface GenerateContentCandidate {
  content?: {
    parts?: GenerateContentPart[];
  };
}

interface GenerateContentResponse {
  candidates?: GenerateContentCandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
    status?: string;
  };
}

export async function enhanceContactMessage(message: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error('Message is empty.');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: {
        role: 'system',
        parts: [
          {
            text: [
              'You are a writing assistant helping to polish messages for a professional portfolio contact form.',
              'Improve clarity, grammar, and tone while preserving the original intent.',
              'Respond with plain text only, without additional commentary or formatting.',
              'Keep the response under 500 words.',
            ].join(' '),
          },
        ],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: [
                'Rewrite the following message so it reads professionally while maintaining the author\'s intent.',
                'Return only the improved message.',
                `Message:\n${trimmedMessage}`,
              ].join('\n\n'),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 32,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to contact Gemini API.');
  }

  const payload = (await response.json()) as GenerateContentResponse;

  if (payload.error) {
    throw new Error(payload.error.message || 'Gemini API returned an error.');
  }

  if (payload.promptFeedback?.blockReason) {
    throw new Error('Gemini could not process the request.');
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini did not return an enhanced message.');
  }

  return text;
}
