import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

import { getMailEnv } from "./env";

export type ContactEmail = {
  name: string;
  email: string;
  topicLabel: string;
  message: string;
};

// Keyed by credentials: a long-lived server (or `next dev` after an .env edit)
// must not keep authenticating with credentials that have since changed.
let smtpTransport: { key: string; transport: Transporter } | undefined;

function getTransport(user: string, pass: string) {
  // Test seam: E2E runs set MAIL_TRANSPORT=json so nothing leaves the machine.
  if (process.env.MAIL_TRANSPORT === "json") {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  // Gmail SMTP over implicit TLS; APP_FROM_PASSWORD must be a Google App Password.
  const key = JSON.stringify([user, pass]);
  if (smtpTransport?.key !== key) {
    smtpTransport?.transport.close();
    smtpTransport = {
      key,
      transport: nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
      }),
    };
  }
  return smtpTransport.transport;
}

const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export async function sendContactEmail({
  name,
  email,
  topicLabel,
  message,
}: ContactEmail) {
  const env = getMailEnv();
  const sender = singleLine(name);

  await getTransport(env.fromEmail, env.fromPassword).sendMail({
    from: { name: "Portfolio contact form", address: env.fromEmail },
    to: env.toEmail,
    replyTo: { name: sender, address: email },
    subject: `[Portfolio] ${topicLabel} — ${sender}`,
    text: `${message}\n\n—\nFrom: ${sender} <${email}>\nTopic: ${topicLabel}`,
  });
}
