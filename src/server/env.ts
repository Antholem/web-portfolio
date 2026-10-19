import "server-only";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable ${name}`);
  return value;
}

/** Read lazily so `next build` does not need mail credentials. */
export function getMailEnv() {
  return {
    fromEmail: requireEnv("APP_FROM_EMAIL"),
    fromPassword: requireEnv("APP_FROM_PASSWORD"),
    toEmail: requireEnv("APP_TO_EMAIL"),
  };
}
