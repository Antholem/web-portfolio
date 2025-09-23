import { connect } from 'tls';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

class EmailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailConfigurationError';
  }
}

const SMTP_PORT = 465;
const SMTP_HOST = 'smtp.gmail.com';

function sanitizeHeaderValue(value: string, fallback = ''): string {
  const cleaned = value.replace(/[\r\n]+/g, ' ').trim();
  return cleaned || fallback;
}

function sanitizeEmail(value: string): string {
  return value.replace(/[\r\n\s]+/g, '').trim();
}

function normalizeMessageBody(body: string): string {
  const normalized = body.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const dotStuffed = normalized.replace(/\n\./g, '\n..');
  return dotStuffed.split('\n').join('\r\n');
}

function toBase64(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64');
}

function createLineReader(socket: import('tls').TLSSocket) {
  let buffer = '';
  const pending: { resolve: (line: string) => void; reject: (error: Error) => void }[] = [];
  const queued: string[] = [];

  const failPending = (error: Error) => {
    while (pending.length > 0) {
      const { reject } = pending.shift()!;
      reject(error);
    }
  };

  socket.setEncoding('utf8');

  socket.on('data', (chunk) => {
    buffer += chunk;
    let index;
    while ((index = buffer.indexOf('\r\n')) !== -1) {
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      if (pending.length > 0) {
        pending.shift()!.resolve(line);
      } else {
        queued.push(line);
      }
    }
  });

  socket.on('error', (error) => {
    failPending(error instanceof Error ? error : new Error(String(error)));
  });

  socket.on('end', () => {
    failPending(new Error('SMTP connection ended unexpectedly.'));
  });

  socket.on('close', () => {
    failPending(new Error('SMTP connection closed unexpectedly.'));
  });

  socket.on('timeout', () => {
    const timeoutError = new Error('SMTP connection timed out.');
    failPending(timeoutError);
    socket.destroy(timeoutError);
  });

  return () =>
    new Promise<string>((resolve, reject) => {
      if (queued.length > 0) {
        resolve(queued.shift()!);
        return;
      }
      pending.push({ resolve, reject });
    });
}

async function write(socket: import('tls').TLSSocket, data: string) {
  await new Promise<void>((resolve, reject) => {
    if (!socket.writable) {
      reject(new Error('SMTP connection is not writable.'));
      return;
    }

    const cleanup = () => {
      socket.off('error', onError);
      socket.off('drain', onDrain);
    };

    const onError = (error: unknown) => {
      cleanup();
      reject(error instanceof Error ? error : new Error(String(error)));
    };

    const onDrain = () => {
      cleanup();
      resolve();
    };

    socket.on('error', onError);
    const flushed = socket.write(data, 'utf8');
    if (flushed) {
      process.nextTick(onDrain);
    } else {
      socket.once('drain', onDrain);
    }
  });
}

async function writeLine(socket: import('tls').TLSSocket, line: string) {
  await write(socket, `${line}\r\n`);
}

async function readResponse(
  readLine: () => Promise<string>,
  expectedCode: string,
  commandLabel: string,
) {
  const lines: string[] = [];
  while (true) {
    const line = await readLine();
    lines.push(line);
    if (line.length < 4) {
      continue;
    }
    const code = line.slice(0, 3);
    const delimiter = line.charAt(3);
    if (delimiter === ' ') {
      if (code !== expectedCode) {
        throw new Error(
          `Unexpected SMTP response while executing ${commandLabel}: ${lines.join('\n')}`,
        );
      }
      return lines.join('\n');
    }
  }
}

async function sendCommand(
  socket: import('tls').TLSSocket,
  readLine: () => Promise<string>,
  command: string,
  expectedCode: string,
  label: string,
) {
  await writeLine(socket, command);
  return readResponse(readLine, expectedCode, label);
}

export async function sendContactEmail({ name, email, message }: ContactMessage): Promise<void> {
  const fromEmail = process.env.APP_FROM_EMAIL;
  const fromPassword = process.env.APP_FROM_PASSWORD;
  const toEmail = process.env.APP_TO_EMAIL;

  if (!fromEmail || !fromPassword || !toEmail) {
    throw new EmailConfigurationError('Email environment variables are not fully configured.');
  }

  const sanitizedName = sanitizeHeaderValue(name, 'Portfolio Visitor');
  const replyTo = sanitizeEmail(email);
  const subject = `New portfolio message from ${sanitizedName}`;
  const composedBody = `You received a new message through your portfolio contact form.\n\nName: ${sanitizedName}\nEmail: ${
    replyTo || 'not provided'
  }\n\nMessage:\n${message.trim()}`;
  const messageBody = normalizeMessageBody(composedBody);

  const socket = connect({
    host: SMTP_HOST,
    port: SMTP_PORT,
    servername: SMTP_HOST,
  });

  socket.setTimeout(15000);

  const connectPromise = new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      socket.off('secureConnect', onConnect);
      socket.off('error', onError);
    };

    const onConnect = () => {
      cleanup();
      resolve();
    };

    const onError = (error: unknown) => {
      cleanup();
      reject(error instanceof Error ? error : new Error(String(error)));
    };

    socket.once('secureConnect', onConnect);
    socket.once('error', onError);
  });

  await connectPromise;

  const readLine = createLineReader(socket);

  try {
    await readResponse(readLine, '220', 'initial greeting');
    await sendCommand(socket, readLine, 'EHLO portfolio.local', '250', 'EHLO');
    await sendCommand(socket, readLine, 'AUTH LOGIN', '334', 'AUTH LOGIN');
    await sendCommand(socket, readLine, toBase64(fromEmail), '334', 'username authentication');
    await sendCommand(socket, readLine, toBase64(fromPassword), '235', 'password authentication');
    await sendCommand(socket, readLine, `MAIL FROM:<${fromEmail}>`, '250', 'MAIL FROM');
    await sendCommand(socket, readLine, `RCPT TO:<${toEmail}>`, '250', 'RCPT TO');
    await sendCommand(socket, readLine, 'DATA', '354', 'DATA');

    const headers = [
      `From: "${sanitizedName}" <${fromEmail}>`,
      `To: ${toEmail}`,
      `Reply-To: ${replyTo || fromEmail}`,
      `Subject: ${sanitizeHeaderValue(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      messageBody,
    ].join('\r\n');

    await write(socket, `${headers}\r\n.\r\n`);
    await readResponse(readLine, '250', 'message delivery');
    await sendCommand(socket, readLine, 'QUIT', '221', 'QUIT');
  } finally {
    socket.end();
  }
}
