import { NextResponse } from 'next/server';

import { sendContactEmail } from '@/lib/email';

interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  messageHtml?: unknown;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRequest(body: ContactRequestBody) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const rawMessage = typeof body.message === 'string' ? body.message : '';
  const normalizedMessage = rawMessage.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const message = normalizedMessage.trim();
  const messageHtml = typeof body.messageHtml === 'string' ? body.messageHtml.trim() : '';

  if (!name) {
    return { error: 'Please provide your name.' } as const;
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: 'Please provide a valid email address.' } as const;
  }

  if (!message) {
    return { error: 'Please include a message.' } as const;
  }

  if (message.length > 5000) {
    return { error: 'Message is too long. Please keep it under 5000 characters.' } as const;
  }

  if (messageHtml.length > 20000) {
    return { error: 'Formatted message is too long. Please shorten it.' } as const;
  }

  return { name, email, message, messageHtml } as const;
}

export async function POST(request: Request) {
  let parsedBody: ContactRequestBody;

  try {
    parsedBody = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const validation = validateRequest(parsedBody);

  if ('error' in validation) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    await sendContactEmail(validation);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.name === 'EmailConfigurationError') {
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    console.error('Failed to send contact email:', error);
    return NextResponse.json({ error: 'Unable to send your message at this time.' }, { status: 500 });
  }
}
