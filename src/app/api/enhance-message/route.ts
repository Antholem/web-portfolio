import { NextResponse } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

interface EnhanceRequestBody {
  message?: unknown;
}

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
  finishReason?: string;
}

interface GeminiErrorResponse {
  error?: {
    message?: string;
    status?: string;
  };
}

interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!message) {
    return NextResponse.json({ error: 'Please provide a message to enhance.' }, { status: 400 });
  }

  if (message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long to enhance.' }, { status: 400 });
  }

  try {
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Improve the clarity and tone of the following contact form message while preserving the original intent. Return only the enhanced message without additional commentary.\n\n${message}`,
              },
            ],
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      let errorMessage = 'Failed to enhance message with Gemini.';

      try {
        const errorData = (await geminiResponse.json()) as GeminiErrorResponse;

        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // Ignore JSON parse errors and use the default error message.
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const data = (await geminiResponse.json()) as GeminiGenerateContentResponse;

    if (data.promptFeedback?.blockReason) {
      return NextResponse.json(
        { error: 'Gemini was unable to process the message. Please adjust your text and try again.' },
        { status: 400 },
      );
    }

    const enhancedMessage = extractEnhancedMessage(data.candidates);

    if (!enhancedMessage) {
      return NextResponse.json(
        { error: 'Gemini did not return an enhanced message. Please try again.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ enhancedMessage });
  } catch (error) {
    console.error('Failed to enhance message with Gemini:', error);
    return NextResponse.json(
      { error: 'Something went wrong while enhancing your message. Please try again later.' },
      { status: 500 },
    );
  }
}

function extractEnhancedMessage(candidates: GeminiCandidate[] | undefined) {
  if (!Array.isArray(candidates)) {
    return '';
  }

  for (const candidate of candidates) {
    if (!candidate || !candidate.content?.parts) {
      continue;
    }

    const messageParts: string[] = [];

    for (const part of candidate.content.parts) {
      if (typeof part?.text === 'string' && part.text.trim().length > 0) {
        messageParts.push(part.text.trim());
      }
    }

    const combined = messageParts.join('\n').trim();

    if (combined.length > 0) {
      return combined;
    }
  }

  return '';
}
