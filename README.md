# web-portfolio

Personal portfolio for Sam Antholem Manalo — a single page built with Next.js (App Router),
Tailwind CSS v4 and shadcn/ui-style components, in Geist and Geist Mono, dark by default.

## Scripts

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the dev server            |
| `npm run build`     | Production build                |
| `npm run start`     | Serve the production build      |
| `npm run lint`      | ESLint (Next core-web-vitals)   |
| `npm run typecheck` | TypeScript, no emit             |
| `npm run format`    | Prettier + Tailwind class order |

## Structure

```
src/
  app/                  Routing only: layout (fonts, providers, metadata), page, globals.css, icon
  components/
    ui/                 Primitives (shadcn conventions): Button, Card, Input, Textarea, Label, Field, ToggleGroup
    shared/             Design-system pieces: Container, Section, SectionHeader, typography, Tag,
                        IconBox, Logo, ThemeToggle, StatusDot, CheckList, TextLink
    layout/             Site chrome: SiteHeader (with mobile menu), SiteFooter
    sections/           One file or folder per page section (hero, about, experience, stack,
                        services, work, contact). Multi-part sections get a folder.
    icons/              Brand icons that lucide no longer ships (GitHub, LinkedIn)
    providers/          Client providers: next-themes, theme-color sync, lucide stroke width
  constants/            Site config (name, contact, links) and navigation/section metadata
  hooks/                Reusable client hooks
  lib/                  data.ts (all page copy), contact validation shared by client + server, cn()
  server/               Server-only modules (env, mailer) — guarded by `server-only`
  app/actions/          Server actions (contact form submission)
  types/                Content types shared by data and components
public/images/          Portrait, avatar, SA monogram, Antholem mark
```

- **Content** lives in `src/lib/data.ts`; **site-wide config** (email, links, location) in `src/constants/site.ts`.
- **Tokens** are CSS variables in `src/app/globals.css`, exposed to Tailwind via `@theme inline`.
  Components reference tokens, never hex values. Breakpoints are 640 / 960 / 1100.
- Server components by default; only interactive pieces (`site-header`, `theme-toggle`,
  `project-gallery`, `contact-form`, `copy-email-button`) are client components.

## Before launch

- Replace the `#` placeholders for LinkedIn and the résumé in `src/constants/site.ts`.
- Fill in real companies/years under `experience` and real projects under `work` in `src/lib/data.ts`.
- "Refine with AI" is a local placeholder (`polishMessage` in `src/lib/contact.ts`).

## Contact form email

The form posts to a server action that sends through Gmail SMTP. Copy `.env.example` to
`.env.local` for local development and set the same variables in Vercel / GitHub:

| Variable            | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| `APP_FROM_EMAIL`    | Gmail account that sends the messages                          |
| `APP_FROM_PASSWORD` | A Google **App Password** for that account (not the login one) |
| `APP_TO_EMAIL`      | Inbox that receives them                                       |

`MAIL_TRANSPORT=json` builds messages without sending them; the E2E suite uses it.
