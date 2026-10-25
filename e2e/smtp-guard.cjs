// Preloaded into the E2E web server (NODE_OPTIONS=--require) as a hard stop:
// even if MAIL_TRANSPORT=json were lost, no SMTP connection can be opened.
// Every armed process and every blocked attempt is recorded in a JSON file so
// the tests can prove the guard was active and never had to fire.
"use strict";
/* eslint-disable @typescript-eslint/no-require-imports -- a CommonJS preload for NODE_OPTIONS=--require */

const fs = require("node:fs");
const net = require("node:net");
const tls = require("node:tls");

const SMTP_PORTS = new Set([25, 465, 587, 2525]);
const SMTP_HOST = /(^|\.)smtp\.|gmail\.com$|googlemail\.com$/i;
const logFile = process.env.SMTP_GUARD_FILE;

function read() {
  try {
    return JSON.parse(fs.readFileSync(logFile, "utf8"));
  } catch {
    return { runId: process.env.E2E_RUN_ID, armed: [], blocked: [] };
  }
}

function record(update) {
  if (!logFile) return;
  const state = read();
  if (state.runId !== process.env.E2E_RUN_ID) {
    state.runId = process.env.E2E_RUN_ID;
    state.armed = [];
    state.blocked = [];
  }
  update(state);
  fs.writeFileSync(logFile, JSON.stringify(state, null, 2));
}

/** Normalises the many (options | port, host) call signatures. */
function target(args) {
  const [first, second] = args;
  if (first && typeof first === "object") {
    return { host: first.host ?? first.servername, port: Number(first.port) };
  }
  return {
    host: typeof second === "string" ? second : undefined,
    port: Number(first),
  };
}

function guard(name, original) {
  return function guarded(...args) {
    const { host, port } = target(args);
    if (SMTP_PORTS.has(port) || (host && SMTP_HOST.test(host))) {
      record((s) =>
        s.blocked.push({ pid: process.pid, via: name, host, port }),
      );
      throw new Error(
        `E2E SMTP guard: blocked ${name} to ${host ?? "?"}:${port} — tests must never send real email`,
      );
    }
    return original.apply(this, args);
  };
}

net.connect = guard("net.connect", net.connect);
net.createConnection = guard("net.createConnection", net.createConnection);
tls.connect = guard("tls.connect", tls.connect);

// On Linux `node_modules/.bin/next` is a symlink and argv keeps the link path;
// on Windows it is a shim that already points at the real file. Resolve it so
// the record names the same script on every OS.
function scriptPath(file) {
  try {
    return fs.realpathSync(file);
  } catch {
    return file;
  }
}

record((s) => {
  const [script, ...args] = process.argv.slice(1, 3);
  s.armed.push({
    pid: process.pid,
    mailTransport: process.env.MAIL_TRANSPORT ?? null,
    argv: [script && scriptPath(script), ...args].join(" "),
  });
});
