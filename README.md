# web-portfolio

[![CI](https://github.com/Antholem/web-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Antholem/web-portfolio/actions/workflows/ci.yml)

Personal portfolio for Sam Antholem Manalo — a single page built with Next.js (App Router),
Tailwind CSS v4 and shadcn/ui-style components, in Geist and Geist Mono, dark by default.

## Scripts

| Command             | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server                         |
| `npm run build`     | Production build                             |
| `npm run start`     | Serve the production build                   |
| `npm run lint`      | ESLint (Next core-web-vitals)                |
| `npm run typecheck` | TypeScript, no emit                          |
| `npm run format`    | Prettier + Tailwind class order              |
| `npm test`          | Unit and component tests (Vitest)            |
| `npm run test:e2e`  | End-to-end + axe (Playwright, system Chrome) |

## Structure

```
src/
  app/                  Routing only: layout (fonts, providers, metadata), page, globals.css, icon
  components/
    ui/                 Primitives (shadcn conventions): Button, Card, Input, Textarea, Label, Field, Toaster
    shared/             Design-system pieces: Container, Section, SectionHeader, typography, Tag,
                        IconBox, Logo, ThemeToggle, StatusDot, CheckList, TextLink
    layout/             Site chrome: SiteHeader (with mobile menu), SiteFooter
    sections/           One file or folder per page section (hero, about, experience, stack,
                        services, work, contact). Multi-part sections get a folder.
    icons/              Brand icons that lucide no longer ships (GitHub, LinkedIn)
    providers/          Client providers: next-themes, theme-color sync, lucide stroke width
    seasonal/           Seasonal themes, set before first paint
  constants/            Site config (name, contact, links) and navigation/section metadata
  hooks/                Reusable client hooks
  lib/                  data.ts (all page copy), contact validation shared by client + server, cn()
  server/               Server-only modules (env, mailer, rate limiter) — guarded by `server-only`
  app/actions/          Server actions (contact form submission)
  types/                Content types shared by data and components
public/images/          Portrait, avatar, SA monogram, Antholem mark
```

- **Content** lives in `src/lib/data.ts`; **site-wide config** (email, links, location) in `src/constants/site.ts`.
- **Tokens** are CSS variables in `src/app/globals.css`, exposed to Tailwind via `@theme inline`.
  Components reference tokens, never hex values. Breakpoints are 640 / 960 / 1100.
- Server components by default; only interactive pieces (`site-header`, `theme-toggle`,
  `contact-form`, `copy-email-button`) are client components.

## Before launch

- Replace the `#` placeholders for LinkedIn and the résumé in `src/constants/site.ts`.
- Fill in real companies/years under `experience` and real projects under `work` in `src/lib/data.ts`.
- Set `NEXT_PUBLIC_SITE_URL` once a custom domain is live (canonical URLs, sitemap, link previews).

## Contact form email

The form posts to a server action that sends through Gmail SMTP. Copy `.env.example` to
`.env.local` for local development and set the same variables in Vercel / GitHub:

| Variable            | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| `APP_FROM_EMAIL`    | Gmail account that sends the messages                          |
| `APP_FROM_PASSWORD` | A Google **App Password** for that account (not the login one) |
| `APP_TO_EMAIL`      | Inbox that receives them                                       |

`MAIL_TRANSPORT=json` builds messages without sending them; the E2E suite uses it.

Sends are rate-limited (5 an hour per visitor, 100 a day overall). Without Redis the
counters are per server instance; for a limit that holds everywhere, add Upstash Redis
(Vercel → Storage), which sets `KV_REST_API_URL` / `KV_REST_API_TOKEN`, or set
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` yourself.

## Testing and CI

GitHub Actions runs on every push to `main` and on pull requests: format check, lint,
typecheck and unit tests, then the Playwright suite (desktop and mobile, with axe) against a
production build. No secrets are needed: the E2E server uses dummy credentials, the JSON mail
transport and a preloaded SMTP guard, so a test can never send real email. On failure the
Playwright report is attached to the run.
