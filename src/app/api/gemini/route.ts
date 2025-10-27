import { NextResponse } from 'next/server';

type GeminiRequestBody = {
  message?: unknown;
};

const GEMINI_MODEL_NAME = 'gemini-1.5-flash';

const buildPrompt = (message: string) =>
  [
    'You are assisting with polishing messages submitted through a personal portfolio contact form.',
    'Rewrite the provided message so it reads clear, professional, and friendly.',
    'Preserve the original intent and key details, and keep the response roughly the same length.',
    'Return only the improved message without any additional commentary or formatting instructions.',
    '',
    `Original message:`,
    message,
  ].join('\n');

const convertGeminiResponseToText = (payload: unknown): string | null => {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('candidates' in payload) ||
    !Array.isArray((payload as { candidates: unknown }).candidates)
  ) {
    return null;
  }

  const candidates = (payload as { candidates: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates;

  for (const candidate of candidates) {
    const text = candidate.content?.parts?.find((part) => typeof part.text === 'string')?.text;

    if (text && text.trim().length > 0) {
      return text.trim();
    }
  }

  return null;
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
  }

  let parsedBody: GeminiRequestBody;

  try {
    parsedBody = (await request.json()) as GeminiRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const message = typeof parsedBody.message === 'string' ? parsedBody.message.trim() : '';

  if (!message) {
    return NextResponse.json({ error: 'Please provide a message to enhance.' }, { status: 400 });
  }

  const prompt = buildPrompt(message);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const errorMessage =
        typeof (errorPayload as { error?: { message?: unknown } })?.error?.message === 'string'
          ? ((errorPayload as { error?: { message?: string } }).error?.message as string)
          : 'Gemini API request failed.';

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const payload = await response.json();
    const enhancedText = convertGeminiResponseToText(payload);

    if (!enhancedText) {
      return NextResponse.json(
        { error: 'Gemini did not return any enhanced text. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ enhanced: enhancedText });
  } catch (error) {
    console.error('Gemini request failed:', error);
    return NextResponse.json({ error: 'Unable to enhance the message right now.' }, { status: 500 });
  }
}
