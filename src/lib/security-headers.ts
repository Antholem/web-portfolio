/**
 * The site is fully static, so the CSP cannot use per-request nonces (they need
 * dynamic rendering). Inline scripts stay allowed: the pre-paint season and
 * theme scripts, JSON-LD and Next's own inline payload all depend on it. Every
 * other source is locked to this origin. `upgrade-insecure-requests` is left
 * out: production is HTTPS-only via HSTS, and the E2E server is plain-HTTP
 * localhost.
 */
export function contentSecurityPolicy({ dev }: { dev: boolean }) {
  const directives = {
    "default-src": ["'self'"],
    // React needs eval in development for error stacks; production never does.
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(dev ? ["'unsafe-eval'"] : []),
    ],
    // React `style` attributes (e.g. --enter-delay) count as inline styles.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'"],
    "connect-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(" ")}`)
    .join("; ");
}

export function securityHeaders({ dev }: { dev: boolean }) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy({ dev }) },
    // Ignored over plain HTTP, so harmless locally.
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Legacy twin of `frame-ancestors 'none'` for browsers without CSP 2.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Clipboard is left alone: "Copy email" uses it.
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}
