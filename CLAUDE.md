@AGENTS.md

# Web portfolio — working agreement

Personal portfolio for Sam Antholem Manalo. Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, shadcn-style primitives on `radix-ui`, TypeScript, Vitest + Testing Library, Playwright + axe. Deployed on Vercel.

The owner is a senior software engineer: write and explain for that audience.

## Commands

- `npm run dev` (port 3000) · `npm run build`
- `npm run typecheck` · `npm run lint` · `npm run format:check`
- `npm test` (Vitest) · `npm run test:e2e` (Playwright builds and serves on port 3100; ~16 min)

## Where things live

- Copy and content: `src/lib/data.ts` only, never hard-coded in components.
- Site-wide constants: `src/constants/` (site config, navigation, seasons, theme).
- Server-only code: `src/server/` with `import "server-only"`. Server actions: `src/app/actions/`.
- Shared logic used by client and server (e.g. contact validation): `src/lib/`.
- UI primitives: `src/components/ui/`; page sections: `src/components/sections/`.
- Design tokens: `src/app/globals.css` (`:root` / `.dark`). Use the Tailwind token utilities, not raw hex, in components; match spacing, radii and type values exactly.

## Coding standards

- Follow the surrounding code: naming, file layout, import order, idioms.
- Accessibility is required, not optional: labelled controls, visible focus, label-in-name, no colour-only signals; respect `prefers-reduced-motion` for any animation.
- Animate only `transform`/`opacity` (compositor-friendly).
- Server actions are public endpoints: validate and coerce all input on the server; never trust the client.
- No new dependencies without a clear reason stated in the reply.
- Header and footer links to home sections use `homeSection(id)` (`/#id`) so they work from other routes.

## Comments

Write for a senior engineer. Comment only the _why_ that the code cannot say: browser/framework quirks, security reasoning, race conditions, non-obvious constraints, magic numbers, regressions (`Was QA-xx: …`). Never restate what the code does, narrate test steps, or describe visuals. Keep real `TODO`s and lint directives.

## Testing and verification

- Every behaviour change ships with tests: unit/component tests next to the code (`*.test.ts(x)`), E2E in `e2e/` for user-visible flows.
- Before reporting work as done: typecheck, lint and unit tests must pass; run the affected E2E specs; screenshot UI changes in light and dark, desktop and mobile.
- Report results faithfully, including failures and anything skipped.
- Mail safety: tests must never send real email (unit: nodemailer is mocked in `vitest.setup.ts`; E2E: JSON transport plus the SMTP guard). Do not test real mail unless explicitly asked.
- `sonner` is mocked globally in `vitest.setup.ts`; assert on `toast` calls rather than rendered snackbars in unit tests.

## Git

- Work on `main`; do not create branches.
- Commit and push only when the owner says so ("push it"). Run the tests first.
- Never commit `.env.local` or print secrets (`APP_FROM_PASSWORD`, Redis tokens). Production env vars live in Vercel.
- The season preview strip is local-only until approved: never commit `src/components/seasonal/season-preview.tsx` or the lines marked `TEMPORARY` in `src/app/layout.tsx` and `e2e/a11y.spec.ts`. Stage those two files without the TEMPORARY lines.
