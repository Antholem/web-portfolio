import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

import {
  renderContactEmail,
  type ContactEmailInput,
} from "./email/contact-email";
import { getMailEnv } from "./env";

export type ContactEmail = ContactEmailInput;

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

export async function sendContactEmail(input: ContactEmail) {
  const env = getMailEnv();
  const { subject, text, html } = renderContactEmail(input);
  const sender = input.name.replace(/[\r\n]+/g, " ").trim();

  await getTransport(env.fromEmail, env.fromPassword).sendMail({
    from: { name: "Portfolio contact form", address: env.fromEmail },
    to: env.toEmail,
    replyTo: { name: sender, address: input.email },
    subject,
    text,
    html,
  });
}
