import { NextResponse } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

interface GenerateContentSuccess {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: unknown };

    if (!body || typeof body.message !== 'string') {
      return NextResponse.json({ error: 'A valid message is required.' }, { status: 400 });
    }

    const message = body.message.trim();

    if (!message) {
      return NextResponse.json({ error: 'A valid message is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    const prompt = `You help portfolio owners polish the tone, grammar, and clarity of contact form messages. Rewrite the following message so that it is friendly, professional, and concise. Return only the improved message without additional commentary or formatting.

Message:
"""
${message}
"""`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);
      const errorMessage =
        (errorPayload && typeof errorPayload.error?.message === 'string'
          ? errorPayload.error.message
          : null) ?? 'Failed to enhance message.';
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = (await response.json()) as GenerateContentSuccess;
    const enhancedMessage = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!enhancedMessage) {
      return NextResponse.json({ error: 'Failed to enhance message.' }, { status: 500 });
    }

    return NextResponse.json({ enhancedMessage });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Something went wrong while enhancing your message.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
