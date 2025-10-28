import { NextResponse } from 'next/server';

import { enhanceContactMessage } from '@/lib/gemini';

interface EnhanceMessageRequestBody {
  message?: unknown;
}

const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  let parsedBody: EnhanceMessageRequestBody;

  try {
    parsedBody = (await request.json()) as EnhanceMessageRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const message = typeof parsedBody.message === 'string' ? parsedBody.message : '';
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return NextResponse.json({ error: 'Please provide a message to enhance.' }, { status: 400 });
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Message is too long to enhance.' }, { status: 400 });
  }

  try {
    const enhancedMessage = await enhanceContactMessage(trimmedMessage);
    return NextResponse.json({ enhancedMessage });
  } catch (error) {
    console.error('Failed to enhance message with Gemini:', error);

    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Unable to enhance the message at this time.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
