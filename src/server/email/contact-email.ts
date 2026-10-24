import "server-only";

import { siteConfig } from "@/constants/site";
import {
  parseMessage,
  type InlineRun,
  type MessageBlock,
} from "@/lib/rich-text";

export type ContactEmailInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt?: Date;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

// Email clients ignore <style> unevenly, so every rule is inline.
const C = {
  page: "#f4f4f5",
  card: "#ffffff",
  border: "#e6e6e6",
  text: "#0a0a0a",
  muted: "#525252",
  subtle: "#6b6b6b",
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

function formatReceived(date: Date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: siteConfig.location.timeZoneId,
  }).format(date);
  return `${formatted} (${siteConfig.location.timezone})`;
}

function renderRuns(runs: InlineRun[]) {
  return runs
    .map(({ text, bold, italic }) => {
      let html = escapeHtml(text);
      if (italic) html = `<em>${html}</em>`;
      if (bold) html = `<strong style="font-weight:600;">${html}</strong>`;
      return html;
    })
    .join("");
}

function renderBlocks(blocks: MessageBlock[]) {
  const p = `margin:0 0 14px;font-size:15px;line-height:1.65;color:${C.text};`;
  return blocks
    .map((block) => {
      if (block.type === "paragraph") {
        return `<p style="${p}">${block.lines.map(renderRuns).join("<br>")}</p>`;
      }
      const tag = block.type === "bullet-list" ? "ul" : "ol";
      const items = block.items
        .map(
          (item) =>
            `<li style="margin:0 0 6px;padding-left:4px;">${renderRuns(item)}</li>`,
        )
        .join("");
      return `<${tag} style="margin:0 0 14px;padding-left:22px;font-size:15px;line-height:1.65;color:${C.text};">${items}</${tag}>`;
    })
    .join("");
}

function detailRow(label: string, valueHtml: string) {
  return `<tr>
  <td style="padding:10px 0;border-top:1px solid ${C.border};width:96px;vertical-align:top;font-family:${C.mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.subtle};">${label}</td>
  <td style="padding:10px 0;border-top:1px solid ${C.border};vertical-align:top;font-size:14px;line-height:1.5;color:${C.text};">${valueHtml}</td>
</tr>`;
}

export function renderContactEmail({
  name,
  email,
  subject: visitorSubject,
  message,
  receivedAt = new Date(),
}: ContactEmailInput) {
  const sender = singleLine(name);
  const firstName = sender.split(/\s+/)[0] || sender;
  const received = formatReceived(receivedAt);
  const visitorLine = singleLine(visitorSubject);
  const subject = `New inquiry from ${sender} — ${visitorLine}`;
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  const preview = singleLine(message.replace(/[*_]/g, "")).slice(0, 120);

  const text = [
    "New portfolio inquiry",
    "",
    `From:      ${sender} <${email}>`,
    `Subject:   ${visitorLine}`,
    `Received:  ${received}`,
    "",
    "Message",
    "-------",
    message.trim(),
    "",
    "—",
    `Reply to this email to respond to ${firstName} directly.`,
    `Sent from the contact form on ${siteConfig.name}’s portfolio.`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:${C.font};">
  <tr><td style="padding:0 4px 16px;font-family:${C.mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.subtle};">Portfolio · New inquiry</td></tr>
  <tr><td style="background:${C.card};border:1px solid ${C.border};border-radius:16px;padding:32px;">
    <h1 style="margin:0 0 6px;font-size:22px;line-height:1.3;font-weight:600;letter-spacing:-0.02em;color:${C.text};">New message from ${escapeHtml(sender)}</h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:${C.muted};">Someone reached out through the contact form on your portfolio.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;border-bottom:1px solid ${C.border};">
      ${detailRow("Name", escapeHtml(sender))}
      ${detailRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${C.text};text-decoration:underline;">${escapeHtml(email)}</a>`)}
      ${detailRow("Subject", escapeHtml(visitorLine))}
      ${detailRow("Received", escapeHtml(received))}
    </table>
    <p style="margin:0 0 12px;font-family:${C.mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.subtle};">Message</p>
    <div style="margin:0 0 28px;padding:20px 22px 6px;border:1px solid ${C.border};border-radius:12px;background:#fafafa;">${renderBlocks(parseMessage(message))}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-radius:10px;background:${C.text};"><a href="${escapeHtml(replyHref)}" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:500;color:#fafafa;text-decoration:none;border-radius:10px;">Reply to ${escapeHtml(firstName)}</a></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:20px 4px 0;font-size:12px;line-height:1.6;color:${C.subtle};">Replying to this email goes directly to ${escapeHtml(email)}.<br>Sent from the contact form on ${escapeHtml(siteConfig.name)}’s portfolio.</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, text, html };
}
