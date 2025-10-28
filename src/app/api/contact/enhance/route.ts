import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface EnhanceRequestBody {
  message?: unknown;
}

interface GeminiTextPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiTextPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponseBody {
  candidates?: GeminiCandidate[];
  error?: { message?: string };
}

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
  }

  let body: EnhanceRequestBody;

  try {
    body = (await request.json()) as EnhanceRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const rawMessage = typeof body.message === 'string' ? body.message : '';
  const message = rawMessage.trim();

  if (!message) {
    return NextResponse.json({ error: 'Please provide a message to enhance.' }, { status: 400 });
  }

  try {
    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
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
                  'You are an expert writing assistant. Improve the tone, clarity, and grammar of the message below.',
                  'Maintain the original intent and details, and keep the response professional yet friendly.',
                  'Return only the enhanced message without additional commentary or markdown formatting.',
                  '',
                  `Message:\n${message}`,
                ].join('\n'),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      }),
    });

    const payload = (await geminiResponse.json()) as GeminiResponseBody;

    if (!geminiResponse.ok) {
      const errorMessage =
        (payload.error && payload.error.message) || 'Gemini API request failed. Please try again.';
      return NextResponse.json({ error: errorMessage }, { status: geminiResponse.status });
    }

    const enhancedMessage =
      payload.candidates
        ?.flatMap((candidate) => candidate.content?.parts ?? [])
        .map((part) => (typeof part.text === 'string' ? part.text : ''))
        .join('\n')
        .trim() ?? '';

    if (!enhancedMessage) {
      return NextResponse.json(
        { error: 'Gemini API did not return an enhanced message. Please try again.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ enhancedMessage });
  } catch (error) {
    console.error('Failed to enhance message with Gemini API:', error);
    return NextResponse.json(
      { error: 'Unable to enhance your message at this time. Please try again later.' },
      { status: 500 },
    );
  }
}
