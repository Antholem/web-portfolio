import { NextResponse } from 'next/server';

const MODEL_NAME = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-lite';
const GENERATE_CONTENT_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

type EnhanceMode = 'enhance' | 'grammar' | 'paraphrase' | 'shorten';

interface EnhanceRequestBody {
  message?: string;
  mode?: string;
}

const enhancementInstructions: Record<EnhanceMode, string> = {
  enhance: 'Improve grammar, clarity, and tone while keeping the original intent.',
  grammar: 'Focus on correcting grammar, spelling, and punctuation while preserving the tone and length.',
  paraphrase: 'Paraphrase the message with fresh, professional wording while retaining the original meaning and key details.',
  shorten: 'Make the message more concise by removing filler while preserving the essential information and professional tone.',
};

const DEFAULT_MODE: EnhanceMode = 'enhance';

const isEnhanceMode = (value: unknown): value is EnhanceMode =>
  typeof value === 'string' && value in enhancementInstructions;

interface GeminiContentPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiContentPart[];
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
}

const extractSuggestion = (payload: GeminiResponse): string | null => {
  if (!payload.candidates?.length) {
    return null;
  }

  const [candidate] = payload.candidates;
  const parts = candidate.content?.parts;

  if (!parts?.length) {
    return null;
  }

  return parts
    .map((part) => (typeof part.text === 'string' ? part.text : ''))
    .join('')
    .trim();
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API key is not configured.' },
      { status: 500 },
    );
  }

  let body: EnhanceRequestBody;

  try {
    body = (await request.json()) as EnhanceRequestBody;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload.' },
      { status: 400 },
    );
  }

  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json(
      { error: 'Message is required.' },
      { status: 400 },
    );
  }

  let mode: EnhanceMode = DEFAULT_MODE;

  if (typeof body.mode !== 'undefined') {
    if (isEnhanceMode(body.mode)) {
      mode = body.mode;
    } else {
      return NextResponse.json(
        { error: 'Invalid enhancement mode.' },
        { status: 400 },
      );
    }
  }

  try {
    const response = await fetch(`${GENERATE_CONTENT_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: [
                  'You are an assistant that enhances professional emails for a portfolio contact form.',
                  enhancementInstructions[mode],
                  'Do not add new ideas or placeholders and respond with the refined message only.',
                  `Original message: ${message}`,
                ].join('\n\n'),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          topP: 0.9,
          topK: 32,
        },
      }),
    });

    if (!response.ok) {
      const errorPayload = (await response.json()) as GeminiResponse;
      const errorMessage =
        errorPayload.error?.message ??
        errorPayload.promptFeedback?.blockReason ??
        'Failed to generate an enhanced message.';

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as GeminiResponse;
    const suggestion = extractSuggestion(payload);

    if (!suggestion) {
      return NextResponse.json(
        { error: 'The AI response was empty. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ suggestion });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Unexpected error while contacting Gemini API.';

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
