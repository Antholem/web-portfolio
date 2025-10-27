import { NextResponse } from 'next/server';

interface ParaphraseRequestBody {
  message?: unknown;
}

interface GeminiContentPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiContentPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponseBody {
  candidates?: GeminiCandidate[];
  promptFeedback?: { safetyRatings?: Array<{ category?: string; probability?: string }>; }; // eslint-disable-line @typescript-eslint/no-unused-vars
  error?: { message?: string };
}

const GEMINI_API_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const MIN_MESSAGE_LENGTH = 1;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  let body: ParaphraseRequestBody;

  try {
    body = (await request.json()) as ParaphraseRequestBody;
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? `Invalid JSON payload: ${error.message}`
        : 'Invalid JSON payload.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { message } = body;

  if (typeof message !== 'string') {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Please provide a message to enhance.' }, { status: 400 });
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: 'Message is too long. Please keep it under 5000 characters.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY.' },
      { status: 500 },
    );
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: [
              'You are an assistant that helps polish professional contact form messages.',
              'Rewrite the following message to make it clear, professional, and friendly.',
              'Keep the meaning intact and respond with only the improved message text without additional commentary.',
              `Message: ${trimmedMessage}`,
            ].join('\n\n'),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
    },
  };

  let geminiResponse: Response;

  try {
    geminiResponse = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? `Failed to reach Gemini: ${error.message}`
        : 'Failed to reach Gemini.';
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const responseBody = (await geminiResponse.json()) as GeminiResponseBody;

  if (!geminiResponse.ok) {
    const message = responseBody?.error?.message ?? 'Gemini API returned an error.';
    return NextResponse.json({ error: message }, { status: geminiResponse.status || 502 });
  }

  const enhancedMessage = responseBody?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!enhancedMessage) {
    return NextResponse.json(
      { error: 'Gemini did not return a suggestion. Please try again.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: enhancedMessage });
}
