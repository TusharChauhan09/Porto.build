# Porto.build — Project Documentation

## Project Purpose

Porto.build is a web application that helps candidates generate and deploy their personal portfolio websites. Users can select from a variety of templates, customize the portfolio content to their needs, and receive a live Vercel URL for their deployed portfolio. The app also includes a CV generator that produces downloadable resumes in multiple formats.

---

## Core Features

### Portfolio Generator
- **Template Selection** — Users browse and choose from pre-built portfolio templates.
- **Portfolio Customization** — Users fill in their personal details, projects, skills, experience, and other sections to tailor the portfolio.
- **Live Sandbox Preview (E2B)** — During customization, the portfolio is rendered inside an [E2B](https://e2b.dev) cloud sandbox. Users see a real-time preview of their portfolio running in an isolated environment. Changes made in the customization form are reflected instantly in the sandboxed view before any deployment occurs.
  - The sandbox runs a Next.js dev server inside the E2B environment.
  - The preview is embedded via an `<iframe>` pointing to the sandbox's exposed localhost URL.
  - Users can interact with the live preview (click links, scroll, resize) to verify the look and feel.
  - The sandbox is ephemeral — it spins up per session and is destroyed after the user publishes or exits.
- **Deployment & URL** — After the user is satisfied with the sandbox preview, the portfolio is deployed to Vercel and the user receives a shareable URL.

### CV Generator
- **CV Creation** — Users generate a professional CV from their entered information.
- **Multi-format Download** — The generated CV can be downloaded in multiple formats including PDF, Word (.docx), and others.

---

## Sandbox Preview — E2B Integration Details

The live preview flow works as follows:

1. **Sandbox creation** — When the user enters the customization step, the app calls the E2B SDK to spin up a new sandbox from a base Next.js template image.
2. **File injection** — The user's current portfolio data (template files + filled content) is written into the sandbox filesystem via the E2B API.
3. **Dev server start** — The sandbox runs `npm run dev` internally and exposes port 3000.
4. **iframe embed** — The frontend renders an `<iframe>` pointing to the sandbox's public URL (provided by E2B's port-forwarding). This gives the user a live, interactive preview.
5. **Incremental updates** — As the user edits fields (name, bio, projects, etc.), the app pushes file changes to the sandbox and the iframe reloads to reflect them.
6. **Publish** — When satisfied, the user clicks "Publish". The app takes the finalized files from the sandbox (or the local state) and triggers a Vercel deployment, then tears down the sandbox.

### E2B Conventions
- Use the `@e2b/code-interpreter` or `e2b` SDK package for sandbox management.
- Sandbox templates are defined in `e2b/` directory (`template.ts` + `build.ts`).
- **Current template**: `nextjs-16-1-6-app` — Next.js 16.1.6, Node 22, Tailwind CSS, shadcn/ui, Turbopack.
- Build the template via `npx tsx e2b/build.ts`.
- Sandbox lifecycle (create/destroy) is managed server-side via Next.js Route Handlers (`app/api/sandbox/`).
- Never expose the E2B API key to the client; all E2B calls go through server-side API routes.
- Store the sandbox ID in server-side session state (or a short-lived cookie) so the same sandbox is reused while the user is on the customization page.

---

## Roadmap (Future Features)

- **Download as Next.js Project** — Users will be able to download the full source code of their portfolio as a Next.js project zip file for self-hosting or further customization.
- Additional export formats for the CV generator.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth | better-auth |
| Database | PostgreSQL |
| ORM | Prisma |
| Sandbox / Preview | E2B (cloud sandboxes) |
| Deployment | Vercel |
| Package Manager | npm |

---

## Project Structure

```
/
├── app/                        # Next.js App Router pages and layouts
│   ├── page.tsx                # Landing page (public, no auth required)
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── globals.css             # Global styles and Tailwind base
│   ├── auth/
│   │   └── signin/page.tsx     # Sign-in page (Google / GitHub OAuth)
│   ├── dashboard/
│   │   └── page.tsx            # User dashboard (protected, post-login)
│   └── api/
│       ├── auth/
│       │   └── [...all]/route.ts       # better-auth route handler
│       └── sandbox/            # E2B sandbox API routes (server-side only)
├── prisma/
│   └── schema.prisma           # Prisma schema (User, Account, Session, Portfolio)
├── public/                     # Static assets (images, icons)
├── e2b/                        # E2B sandbox template and build scripts
│   ├── template.ts             # Sandbox template definition (Next.js 16.1.6)
│   └── build.ts                # Script to build the E2B template
├── components/                 # Reusable UI components
├── lib/                        # Utility functions and helpers
│   ├── sandbox.ts              # E2B sandbox create/connect helpers
│   ├── auth.ts                 # better-auth server config (providers, Prisma adapter)
│   ├── auth-client.ts          # better-auth typed client (useSession, signIn, signOut)
│   └── db.ts                   # Prisma client singleton
├── middleware.ts               # Auth middleware — protects non-public routes
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
└── CLAUDE.md                   # This file
```

---

## Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

The dev server runs at `http://localhost:3000` by default.

---

## Authentication — better-auth

- **Library**: `better-auth` with the built-in Prisma adapter.
- **Providers**: Google OAuth and GitHub OAuth only. No email/password auth.
- **Config**: Auth instance is created in `lib/auth.ts` using `betterAuth({ ... })` with `prismaAdapter(db, { provider: "postgresql" })` and both social providers configured.
- **Client**: A typed auth client is created in `lib/auth-client.ts` using `createAuthClient()` from `better-auth/react` — import `signIn`, `signOut`, `useSession` from there.
- **Route handler**: `app/api/auth/[...all]/route.ts` exports `{ GET, POST }` from the better-auth Next.js handler (`toNextJsHandler(auth.handler)`).
- **Middleware**: `middleware.ts` uses `auth.api.getSession()` to check session and redirect unauthenticated users away from protected routes (`/dashboard`, `/editor`). Public routes: `/`, `/auth/signin`, `/api/auth/*`.
- **Schema**: better-auth's Prisma plugin auto-generates the required auth models — run `npx better-auth generate` then `npx prisma migrate dev` to apply.
- **Sign-in page**: `app/auth/signin/page.tsx` — calls `signIn.social({ provider: "google" })` and `signIn.social({ provider: "github" })` from the auth client.
- **Never expose** `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, or `GITHUB_CLIENT_ID/SECRET` to the client.

### Required Environment Variables

```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

DATABASE_URL=postgresql://...
```

---

## Database — PostgreSQL + Prisma

- **ORM**: Prisma with PostgreSQL.
- **Client singleton**: `lib/db.ts` exports a single `PrismaClient` instance (use the standard Next.js singleton pattern to avoid exhausting connections in dev).
- **Schema**: `prisma/schema.prisma` includes auth models auto-generated by better-auth (`npx better-auth generate`) plus app-specific models (`Portfolio`, etc.). Never hand-write the auth models — let better-auth manage them.
- **Migrations**: use `npx prisma migrate dev` in development, `npx prisma migrate deploy` in CI/production.
- **Never** import `PrismaClient` directly in components or client code — always go through `lib/db.ts` in server-side code.

---

## Landing Page

- `app/page.tsx` is **public** (no auth required) and serves as the marketing/landing page.
- It should showcase what Porto.build does: template gallery preview, feature highlights (live preview, one-click deploy, CV generator), and a clear CTA to sign up / sign in.
- Unauthenticated users land here. After sign-in they are redirected to `/dashboard`.
- Do not render any user-specific data on this page — it must be fully static/SSG-friendly.

---

## Key Conventions

- Use the **App Router** (`app/` directory) for all pages and layouts.
- Use **Tailwind CSS** utility classes for styling; avoid inline styles.
- Keep components in `components/` and shared logic in `lib/`.
- TypeScript strict mode is enabled — avoid `any` types.
- Follow existing file naming: `kebab-case` for directories, `PascalCase` for component files.
