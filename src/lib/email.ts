import { connect } from "tls";

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

class EmailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigurationError";
  }
}

const SMTP_PORT = 465;
const SMTP_HOST = "smtp.gmail.com";

function sanitizeHeaderValue(value: string, fallback = ""): string {
  const cleaned = value.replace(/[\r\n]+/g, " ").trim();
  return cleaned || fallback;
}

function sanitizeEmail(value: string): string {
  return value.replace(/[\r\n\s]+/g, "").trim();
}

function normalizeMessageBody(body: string): string {
  const normalized = body.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const dotStuffed = normalized.replace(/\n\./g, "\n..");
  return dotStuffed.split("\n").join("\r\n");
}

function toBase64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPlainText(name: string, replyTo: string, msg: string) {
  return [
    "You received a new message through your portfolio.",
    "",
    `Name: ${name}`,
    `Email: ${replyTo || "not provided"}`,
    "",
    "Message:",
    msg.trim(),
    "",
    "—",
    "This email came from your portfolio.",
  ].join("\n");
}

function buildHtml(name: string, replyTo: string, msg: string) {
  const preheader = "New message from your portfolio. Open to view.";
  const safeMsg = escapeHtml(msg.trim()).replace(/\r?\n/g, "<br>");
  const replyHref = replyTo ? `mailto:${replyTo}` : "#";

  return normalizeMessageBody(`\
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="light dark">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New message</title>
  <style>
    .preheader{display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;}
    body{margin:0;padding:0;background:#f5f7fb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;}
    .wrapper{width:100%;padding:24px 0;}
    .container{max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;}
    .header{padding:20px 24px;border-bottom:1px solid #e5e7eb;}
    .title{font-size:18px;line-height:1.4;margin:0;}
    .body{padding:20px 24px;font-size:15px;line-height:1.6;}
    .label{display:block;font-size:12px;color:#64748b;margin-bottom:4px;text-transform:uppercase;letter-spacing:.02em;}
    .value{font-size:15px;color:#0f172a;margin:0 0 16px;}
    .msg{padding:14px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;}
    .btn{display:inline-block;margin-top:16px;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;border:1px solid #0f172a;color:#0f172a;background:transparent;}
    .footer{padding:16px 24px;color:#64748b;font-size:12px;border-top:1px solid #e5e7eb;background:#fafafa;}
    @media (prefers-color-scheme: dark){
      body{background:#0b0c10;color:#e5e7eb;}
      .container{background:#111827;border-color:#1f2937;}
      .header{border-bottom-color:#1f2937;}
      .body{color:#e5e7eb;}
      .value{color:#e5e7eb;}
      .msg{background:#0f172a;border-color:#1f2937;color:#e5e7eb;}
      .btn{color:#e5e7eb;border-color:#e5e7eb;background:transparent;}
      .footer{background:#0f172a;border-top-color:#1f2937;color:#9ca3af;}
    }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="title">New message</h1>
      </div>
      <div class="body">
        <span class="label">Name</span>
        <p class="value">${escapeHtml(name)}</p>

        <span class="label">Email</span>
        <p class="value">${replyTo ? escapeHtml(replyTo) : "not provided"}</p>

        <span class="label">Message</span>
        <div class="msg">${safeMsg}</div>

        ${replyTo ? `<a class="btn" href="${replyHref}">Reply</a>` : ""}
      </div>
      <div class="footer">
        This email came from your portfolio contact form.
      </div>
    </div>
  </div>
</body>
</html>`);
}

function createLineReader(socket: import("tls").TLSSocket) {
  let buffer = "";
  const pending: {
    resolve: (line: string) => void;
    reject: (error: Error) => void;
  }[] = [];
  const queued: string[] = [];

  const failPending = (error: Error) => {
    while (pending.length > 0) {
      const { reject } = pending.shift()!;
      reject(error);
    }
  };

  socket.setEncoding("utf8");

  socket.on("data", (chunk) => {
    buffer += chunk;
    let index;
    while ((index = buffer.indexOf("\r\n")) !== -1) {
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      if (pending.length > 0) pending.shift()!.resolve(line);
      else queued.push(line);
    }
  });

  socket.on("error", (e) =>
    failPending(e instanceof Error ? e : new Error(String(e)))
  );
  socket.on("end", () =>
    failPending(new Error("SMTP connection ended unexpectedly."))
  );
  socket.on("close", () =>
    failPending(new Error("SMTP connection closed unexpectedly."))
  );
  socket.on("timeout", () => {
    const err = new Error("SMTP connection timed out.");
    failPending(err);
    socket.destroy(err);
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

async function write(socket: import("tls").TLSSocket, data: string) {
  await new Promise<void>((resolve, reject) => {
    if (!socket.writable) {
      reject(new Error("SMTP connection is not writable."));
      return;
    }
    const cleanup = () => {
      socket.off("error", onError);
      socket.off("drain", onDrain);
    };
    const onError = (error: unknown) => {
      cleanup();
      reject(error instanceof Error ? error : new Error(String(error)));
    };
    const onDrain = () => {
      cleanup();
      resolve();
    };
    socket.on("error", onError);
    const flushed = socket.write(data, "utf8");
    if (flushed) process.nextTick(onDrain);
    else socket.once("drain", onDrain);
  });
}

async function writeLine(socket: import("tls").TLSSocket, line: string) {
  await write(socket, `${line}\r\n`);
}

async function readResponse(
  readLine: () => Promise<string>,
  expectedCode: string,
  commandLabel: string
) {
  const lines: string[] = [];
  while (true) {
    const line = await readLine();
    lines.push(line);
    if (line.length < 4) continue;
    const code = line.slice(0, 3);
    const delimiter = line.charAt(3);
    if (delimiter === " ") {
      if (code !== expectedCode) {
        throw new Error(
          `Unexpected SMTP response while executing ${commandLabel}: ${lines.join(
            "\n"
          )}`
        );
      }
      return lines.join("\n");
    }
  }
}

async function sendCommand(
  socket: import("tls").TLSSocket,
  readLine: () => Promise<string>,
  command: string,
  expectedCode: string,
  label: string
) {
  await writeLine(socket, command);
  return readResponse(readLine, expectedCode, label);
}

export async function sendContactEmail({
  name,
  email,
  message,
}: ContactMessage): Promise<void> {
  const fromEmail = process.env.APP_FROM_EMAIL;
  const fromPassword = process.env.APP_FROM_PASSWORD;
  const toEmail = process.env.APP_TO_EMAIL;

  if (!fromEmail || !fromPassword || !toEmail) {
    throw new EmailConfigurationError(
      "Email environment variables are not fully configured."
    );
  }

  const sanitizedName = sanitizeHeaderValue(name, "Portfolio Visitor");
  const replyTo = sanitizeEmail(email);
  const subject = `[Portfolio] New message from ${sanitizedName}`;

  // Build bodies
  const textBody = buildPlainText(sanitizedName, replyTo, message);
  const htmlBody = buildHtml(sanitizedName, replyTo, message);

  // MIME body
  const boundary = `b1_${Date.now().toString(36)}`;
  const mimeBody = [
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    textBody,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    htmlBody,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");

  const socket = connect({
    host: SMTP_HOST,
    port: SMTP_PORT,
    servername: SMTP_HOST,
  });

  socket.setTimeout(15000);

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      socket.off("secureConnect", onConnect);
      socket.off("error", onError);
    };
    const onConnect = () => {
      cleanup();
      resolve();
    };
    const onError = (error: unknown) => {
      cleanup();
      reject(error instanceof Error ? error : new Error(String(error)));
    };
    socket.once("secureConnect", onConnect);
    socket.once("error", onError);
  });

  const readLine = createLineReader(socket);

  try {
    await readResponse(readLine, "220", "initial greeting");
    await sendCommand(socket, readLine, "EHLO portfolio.local", "250", "EHLO");
    await sendCommand(socket, readLine, "AUTH LOGIN", "334", "AUTH LOGIN");
    await sendCommand(
      socket,
      readLine,
      toBase64(fromEmail),
      "334",
      "username authentication"
    );
    await sendCommand(
      socket,
      readLine,
      toBase64(fromPassword),
      "235",
      "password authentication"
    );
    await sendCommand(
      socket,
      readLine,
      `MAIL FROM:<${fromEmail}>`,
      "250",
      "MAIL FROM"
    );
    await sendCommand(
      socket,
      readLine,
      `RCPT TO:<${toEmail}>`,
      "250",
      "RCPT TO"
    );
    await sendCommand(socket, readLine, "DATA", "354", "DATA");

    const headers = [
      `From: "Portfolio" <${fromEmail}>`,
      `To: ${toEmail}`,
      `Reply-To: ${replyTo || fromEmail}`,
      `Subject: ${sanitizeHeaderValue(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
    ].join("\r\n");

    await write(socket, `${headers}${mimeBody}\r\n.\r\n`);
    await readResponse(readLine, "250", "message delivery");
    await sendCommand(socket, readLine, "QUIT", "221", "QUIT");
  } finally {
    socket.end();
  }
}
