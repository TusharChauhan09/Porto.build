# Porto.build — How It Works

---
---

# 1. E2B Sandbox & Code Editor

## Overview

The foundation of Porto.build's live preview system. An IDE-like code editor that runs entirely in the browser, backed by E2B cloud sandboxes. Each sandbox is an isolated container running a Next.js dev server — users can create/edit files and see changes reflected instantly via HMR.

## E2B Template

### `e2b/template.ts` — Sandbox Template Definition

- Base: Node.js 22 slim image
- Installs: Next.js 16.1.6 + Tailwind CSS + all shadcn/ui components
- Working directory: `/home/user`
- Start command: `npx next dev --turbopack` (runs Next.js dev server with Turbopack)
- Waits for `http://localhost:3000` to be ready before the sandbox is considered started

### `e2b/build.ts` — Template Build Script

- Run with: `npm run e2b:build`
- Must be run once before the editor can work
- Takes a few minutes (installs Next.js + shadcn inside the template image)

---

## Server-Side: Sandbox API Routes

**Auth:** All sandbox API routes require authentication via the `requireAuth()` helper from `lib/auth-session.ts`. This returns the authenticated user's ID or a 401 JSON response. See [Auth Guards](#auth-guards) below.

### `lib/sandbox.ts` — Sandbox Manager
**What it does:** Manages E2B sandbox instances on the server.

- Keeps a `Map<string, Sandbox>` in memory so all API routes share the same sandbox instance
- `createSandbox()` — calls `Sandbox.create("nextjs-16-1-6-app")`, caches the instance, returns the sandbox ID and preview URL
- `getSandbox(id)` — looks up cached sandbox, or reconnects via `Sandbox.connect()` if the server restarted
- The preview URL is built from `sandbox.getHost(3000)` which gives the public hostname for the sandbox's port 3000

**Used by:** All API routes import from this file.

---

### `app/api/sandbox/create/route.ts` — Create Sandbox

- **Method:** POST
- **Auth:** `requireAuth()` — returns 401 if unauthenticated
- **Calls:** `createSandbox()` from `lib/sandbox.ts`
- **Returns:** `{ sandboxId: "abc123", previewUrl: "https://abc123-3000.e2b.dev" }`
- **When called:** When user visits `/editor` directly (without query params)

---

### `app/api/sandbox/files/route.ts` — List Files

- **Method:** GET
- **Auth:** `requireAuth()`
- **Params:** `?id=sandboxId&path=/home/user`
- **Calls:** `sandbox.files.list(path)`
- **Filters out:** `node_modules` and `.next` directories
- **Returns:** `{ entries: [{ name, type, path }, ...] }`

---

### `app/api/sandbox/files/read/route.ts` — Read File

- **Method:** GET
- **Auth:** `requireAuth()`
- **Params:** `?id=sandboxId&path=/home/user/app/page.tsx`
- **Calls:** `sandbox.files.read(path)`
- **Returns:** `{ content: "file content as string" }`

---

### `app/api/sandbox/files/write/route.ts` — Write File

- **Method:** POST
- **Auth:** `requireAuth()`
- **Body:** `{ id, path, content }`
- **Calls:** `sandbox.files.write(path, content)`
- **Returns:** `{ success: true }`
- **When called:** Auto-save (1 second after user stops typing), or when creating a new file

---

### `app/api/sandbox/files/delete/route.ts` — Delete File

- **Method:** POST
- **Auth:** `requireAuth()`
- **Body:** `{ id, path }`
- **Calls:** `sandbox.files.remove(path)`
- **Returns:** `{ success: true }`

---

### `app/api/sandbox/files/mkdir/route.ts` — Create Directory

- **Method:** POST
- **Auth:** `requireAuth()`
- **Body:** `{ id, path }`
- **Calls:** `sandbox.files.makeDir(path)`
- **Returns:** `{ success: true }`

---

### `app/api/sandbox/extract-data/route.ts` — Extract Portfolio Data from Sandbox

- **Method:** POST
- **Auth:** `requireAuth()`
- **Body:** `{ sandboxId }`
- **Returns:** `{ portfolioData }` — the parsed JSON from the sandbox's `page.tsx`
- Reads `/home/user/app/page.tsx` from the sandbox
- Uses regex to extract `const data = { ... };`, then `JSON.parse()`
- **When called:** When user clicks "Back" in the sandbox editor to return to the template editor

---

## Client-Side: Code Editor (`app/editor/page.tsx`)

Full IDE-like experience: file tree on the left, CodeMirror code editor in the center, live iframe preview on the right. All three panels are **resizable** via drag handles.

### Entry Points

| Entry | URL | Behavior |
|---|---|---|
| Direct visit | `/editor` | Creates a fresh empty sandbox via `POST /api/sandbox/create` |
| Via "Sandbox" button | `/editor?sandboxId=abc&previewUrl=https://...&templateId=template1` | Uses existing sandbox with template files pre-loaded; saves data back on exit |

The `useEffect` on mount checks `searchParams.get("sandboxId")` and `searchParams.get("previewUrl")`. If both exist, it sets state directly and skips the create call. `templateId` is also read from params to enable save-on-back.

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back                    Sandbox Editor                        │  ← top bar
├──────────┬─┬─────────────────────┬─┬─────────────────────────────┤
│          │║│  [tab1] [tab2]      │║│  ↻  url...    Open in tab   │
│  File    │║│                     │║│                             │
│  Tree    │║│  CodeMirror         │║│  iframe                    │
│          │║│  Editor             │║│  preview                   │
│          │║│                     │║│                             │
└──────────┴─┴─────────────────────┴─┴─────────────────────────────┘
             ║ drag handle          ║ drag handle
```

### State

- `sandboxId` — ID of the current sandbox
- `previewUrl` — URL for the iframe preview
- `templateId` — template ID from query params (used for save-on-back)
- `isSavingBack` — loading state for save-on-back flow
- `openFiles` — array of file paths currently open as tabs
- `activeFile` — which tab is selected
- `fileContents` — `Map<path, content>` cache of file contents
- `treeWidth` — pixel width of the file tree panel (default 256, range 140–480)
- `editorFraction` — fraction of remaining space the editor takes (default 0.5, range 0.15–0.85)

### Resizable Panels

Three panels separated by two `ResizeHandle` components:
- `ResizeHandle` is a thin `div` (4px wide) with pointer-capture-based drag detection
- On `pointerdown` → captures pointer, tracks `clientX`
- On `pointermove` → computes delta, calls `onDrag(deltaX)` callback
- On `pointerup` → releases
- Visual: `bg-zinc-800`, highlights `bg-blue-500/60` on hover, `bg-blue-500` on active drag
- Left handle: adjusts `treeWidth` state (clamped 140–480px)
- Right handle: adjusts `editorFraction` state (clamped 0.15–0.85, computed relative to available width)

### Flow (once sandbox is ready)

1. User clicks a file → fetches content via `GET /api/sandbox/files/read` → opens in CodeMirror
2. User types → updates local state → debounced write to `POST /api/sandbox/files/write` after 1 second
3. Sandbox's Next.js dev server detects the file change → HMR updates the iframe preview automatically

**Key detail:** CodeMirror is loaded with `next/dynamic` and `{ ssr: false }` because it only works in the browser.

### Save-on-Back Flow

When the user navigates back from the sandbox editor to the template editor:
1. `handleBack()` fires when user clicks the back button (←)
2. If `sandboxId` and `templateId` are available:
   a. Shows "Saving changes..." spinner on the back button
   b. Calls `POST /api/sandbox/extract-data` with `{ sandboxId }` to extract portfolio data
   c. Calls `POST /api/portfolio` with `{ templateId, portfolioData }` to persist to database
   d. Navigates back via `router.back()`
3. If extraction or save fails, the user still navigates back (best-effort save)
4. If no `templateId` (direct visit to editor), just calls `router.back()` without saving

---

## Editor Components

### `components/editor/FileTree.tsx` — File Explorer Panel

- Fetches root files from `GET /api/sandbox/files?path=/home/user` on mount
- Sorts entries: directories first, then alphabetical
- Toolbar has two buttons: "New File" (+) and "New Folder" (folder icon)
- Clicking either shows an inline text input where you type the name
- "New File" → POST `/api/sandbox/files/write` with empty content
- "New Folder" → POST `/api/sandbox/files/mkdir`
- After creating, it re-fetches the file list

---

### `components/editor/FileTreeItem.tsx` — Single Tree Item (Recursive)

**For folders:**
- Click to expand/collapse
- On first expand → fetches children from `/api/sandbox/files?path=<folder path>`
- Shows chevron icon (rotates when open) + folder icon (changes to open folder when expanded)

**For files:**
- Click to open in the editor (calls `onFileSelect(path)`)
- Shows file icon

**Both:**
- Hover reveals a trash icon on the right to delete
- Selected file is highlighted with a darker background
- Indentation increases with depth (16px per level)

---

### `components/editor/CodeEditor.tsx` — Code Editor

- Wraps CodeMirror 6 (`@uiw/react-codemirror`) for syntax-highlighted editing
- Uses the One Dark theme (VS Code-like dark appearance)
- Auto-detects language from file extension:
  - `.ts`, `.tsx`, `.js`, `.jsx` → JavaScript/TypeScript with JSX
  - `.css` → CSS
  - `.html` → HTML
  - `.json` → JSON
- Features enabled: line numbers, code folding, bracket matching, autocompletion, auto-indent
- Fires `onChange` on every keystroke (parent handles debouncing)

---

### `components/editor/FileTabs.tsx` — Tab Bar

- Each tab shows the filename (last part of the path)
- Active tab has a blue top border and brighter background
- Each tab has an "x" button (visible on hover) to close it
- Clicking a tab switches the editor to that file

---

### `components/editor/Preview.tsx` — Live Preview

- Shows a loading spinner while the sandbox is starting
- Once ready, shows:
  - A toolbar with: refresh button (left), sandbox URL (center, truncated), "Open in new tab" link (right)
  - An iframe pointing to the sandbox's public URL
- The refresh button remounts the iframe by bumping a `refreshKey` state (useful if HMR misses a change)
- **"Open in new tab"** — an `<a>` tag with `target="_blank"` pointing to the sandbox URL, lets users view the preview in a full browser tab
- HMR (Hot Module Replacement) in the sandbox's Next.js dev server handles most updates automatically

---

## Utilities

### `lib/hooks/use-debounce.ts` — Debounce Hook

- Returns a debounced version of a callback function
- Used by the editor page to delay file writes
- When the user types, it waits 1 second of inactivity before writing to the sandbox
- Prevents flooding the API with a write on every keystroke

---

### `components/ui/icons.tsx` — SVG Icons

Simple SVG icon components used throughout the editor UI:
- `FileIcon` — document icon for files
- `FolderIcon` / `FolderOpenIcon` — folder icons (closed/open states)
- `ChevronRightIcon` — arrow for folder expand/collapse
- `PlusIcon` — "+" for new file button
- `TrashIcon` — trash can for delete
- `XIcon` — "x" for closing tabs
- `RefreshIcon` — circular arrows for preview refresh

---
---

# 2. Template System

## Overview

The template system lets users browse portfolio templates, click one, fill in a form with their details, and see a live preview update in real time. Data is saved **per-user** to both user-scoped `localStorage` (fast cache) and the server-side `Portfolio` table (source of truth).

### Flow

```
/arena/templates                    /arena/templates/template1
┌─────────────────────┐            ┌──────────┬────────┬──────────────┐
│  TemplateCard grid   │  click    │          │        │              │
│                      │ ───────►  │ Sidebar  │  Form  │  Browser     │
│  ┌────┐ ┌────┐      │           │          │ panel  │  Preview     │
│  │ T1 │ │ T2 │ ...  │           │          │        │  (live)      │
│  └────┘ └────┘      │           │          │        │              │
└─────────────────────┘            └──────────┴────────┴──────────────┘
```

---

## File-by-File Breakdown

### `portfolio-templates/PortfolioTypes.ts` — Shared Type Definitions

Defines all TypeScript interfaces used across every template:

- **`PortfolioProps`** — the main props every template component receives: `name`, `title`, `bio`, `image`, `location`, `resumeUrl`, `socials`, `skills`, `projects`, `certifications`, `education`, `experience`
- **`SocialLink`** — `{ platform, url }` where platform is one of github, linkedin, twitter, website, email, youtube, dribbble, behance, instagram
- **`Skill`** — `{ name, level?, percentage?, category? }`
- **`Project`** — `{ title, description, image?, tags[], liveUrl?, repoUrl? }`
- **`Certification`** — `{ title, issuer, date, url?, image? }`
- **`Education`** — `{ institution, degree, field, startDate, endDate?, description? }`
- **`Experience`** — `{ company, role, startDate, endDate?, description, current? }`

**Why it exists:** Every template and form imports from this single file, so adding a new field automatically flows through to all templates.

---

### `portfolio-templates/portfolio-1/Portfolio1.tsx` — Template Component

**What it does:** Receives `PortfolioProps` and renders the complete portfolio page.

- Uses CSS Modules (`Portfolio1.module.css`) for scoped styling — styles never leak into other templates
- Loads Google Fonts (Space Grotesk + Space Mono + Material Symbols) via `<link>` tags
- All sections (hero, about, skills, experience, projects, certifications, education, footer) are driven entirely by props
- Uses CSS custom properties (`--p1-primary`, `--p1-bg-dark`, etc.) so each template has its own color palette

**How props map to the UI:**
| Prop | Section |
|---|---|
| `name`, `image`, `title`, `location` | Hero (left image + right name block) |
| `bio`, `experience[0]` | About_Me section |
| `skills[].name`, `skills[].percentage` | Skills_Stack (monospace list with `[XX%]`) |
| `experience[]` | Timeline with left border (first = purple) |
| `projects[]` | Card grid with icons + tags |
| `certifications[]` | List with verified icons |
| `education[]` | Full-width purple accent bar |
| `socials[]` | Footer links |
| `resumeUrl` | Download button in education bar |

---

### `portfolio-templates/portfolio-1/Portfolio1.module.css` — Scoped Styles

**What it does:** All CSS for Portfolio1, scoped via CSS Modules.

- Defines template-specific CSS variables under `.wrapper` (e.g. `--p1-primary: #a413ec`)
- Contains styles for every section: `.hero`, `.skillsSection`, `.projectCard`, `.experienceItem`, etc.
- Responsive breakpoints at 768px and 1024px
- No Tailwind dependency — the template is self-contained and can render inside an E2B sandbox or as a standalone page

---

### `portfolio-templates/portfolio-1/Portfolio1Form.tsx` — Customization Form

**What it does:** A `"use client"` React component that renders input fields for every section of the portfolio.

**Props it accepts:**
- `initialData?: Partial<PortfolioProps>` — pre-fill the form (e.g. from saved data)
- `onChange: (data: PortfolioProps) => void` — fires on every keystroke with the full current data

**How it works internally:**
1. Holds the full `PortfolioProps` in `useState`
2. On any input change → merges the new value → calls `onChange(fullData)`
3. Array sections (socials, skills, projects, etc.) use three helper functions:
   - `updateArray(key, index, newValue)` — update one item in the array
   - `addItem(key, emptyTemplate)` — push a new blank item
   - `removeItem(key, index)` — splice out an item

**Sections rendered (top to bottom):**
1. Personal Info — name, title, bio, image URL, location, resume URL
2. Social Links — dynamic rows (select platform + URL input)
3. Skills — card per skill (name, category, level dropdown, percentage)
4. Projects — card per project (title, description, tags, image URL, live/repo URLs)
5. Experience — card per job (company, role, dates, current checkbox, description)
6. Education — card per degree (institution, degree, field, dates, description)
7. Certifications — card per cert (title, issuer, date, URL, image URL)

Each section has "+ Add" and "Remove" buttons for dynamic list management.

---

### `components/template-card.tsx` — Template Card (Listing)

**What it does:** Renders a single template card on the `/arena/templates` page.

**Props:** `id`, `name`, `price`, `discount?`, `preview?`

**Key behavior:**
- Wrapped in a `<Link href={/arena/templates/${id}}>` — clicking navigates to the editor
- Dashed border with corner accent marks on hover
- Optional `preview` image for thumbnail
- Supports discount display (original price struck through + discounted price)

---

### `components/browser-preview.tsx` — Reusable Browser Frame

**What it does:** Wraps any content in a browser-style chrome frame.

**Props:**
- `url?: string` — text shown in the fake URL bar (defaults to `"portfolio.porto.build"`)
- `children` — the preview content rendered inside the frame

**Structure:**
```
┌─────────────────────────────────────────┐
│ ● ● ●   ┌─ portfolio.porto.build/... ─┐│  ← browser chrome
│          └─────────────────────────────┘│
├─────────────────────────────────────────┤
│                                         │
│         {children}                      │  ← preview content
│                                         │
└─────────────────────────────────────────┘
```

Handles its own scrolling (`overflow-y-auto overflow-x-hidden`) with `bg-muted/30` background and `shadow-2xl` for depth.

**Reusable:** Any future template editor uses `<BrowserPreview url="..."><TemplateN {...data} /></BrowserPreview>`.

---

### `app/arena/templates/page.tsx` — Templates Listing Page

**What it does:** Server component that renders a grid of `TemplateCard` components.

- Template data is currently hardcoded (array of `{ id, name, price, discount? }`)
- 3-column grid on desktop, 2 on tablet, 1 on mobile
- Each card links to `/arena/templates/{id}`

---

### `app/arena/templates/[templateId]/page.tsx` — Template Editor Page

**What it does:** The main customization page. Form on the left, live preview on the right, with a Sandbox button to launch the full code editor.

**Key parts:**

1. **Template Registry** — a `TEMPLATE_REGISTRY` object mapping template IDs to their `{ name, Form, Preview }` components:
   ```ts
   template1 → { name: "Brutalist", Form: Portfolio1Form, Preview: Portfolio1 }
   ```
   Adding a new template = one new entry here + the template files.

2. **User-scoped persistence:**
   - Uses `useSession()` from `lib/auth-client.ts` to get the authenticated user ID
   - `storageKey(userId, templateId)` → `porto_template_{userId}_{templateId}`
   - `loadSavedData(userId, templateId)` — reads from user-scoped `localStorage`
   - `saveDataLocal(userId, templateId, data)` — writes to user-scoped `localStorage`
   - On page load: loads from localStorage first (fast), then fetches from `GET /api/portfolio` (server source of truth), merges with defaults
   - Shows loading spinner until session and data resolve

3. **State flow:**
   ```
   Form (onChange) → setPortfolioData → Preview re-renders with new props
   ```
   Every keystroke in the form triggers `onChange` → state updates → the Preview component receives new props and re-renders instantly. No API calls, no debouncing — it's all local React state.

4. **Save button:**
   - Writes to user-scoped `localStorage` (instant feedback)
   - Simultaneously `POST /api/portfolio` to persist to database
   - Shows "Saved!" for 2 seconds then reverts to "Save"

5. **Sandbox button** (next to Save):
   - Idle: `Play` icon + "Sandbox" label
   - Loading: spinning `Loader2` icon + "Launching..."
   - **Saves data first** (localStorage + server) before sandbox creation
   - Calls `POST /api/sandbox/deploy-template` with `{ templateId, portfolioData }`
   - On success → navigates to `/editor?sandboxId=...&previewUrl=...&templateId=...`
   - On error → shows error bar below the top bar with a dismiss button

6. **Layout:**
   ```
   ┌─────────────────────────────────────────────────────────────┐
   │  ← Back    Brutalist    EDITOR       [▶ Sandbox]  [Save]   │
   ├─────────────────────────────────────────────────────────────┤
   │  (error bar here if sandboxError is set)                    │
   ├────────────┬────────────────────────────────────────────────┤
   │            │                                                │
   │   Form     │   BrowserPreview                               │
   │  (480px)   │   ┌──────────────────────────────────────┐     │
   │  scrolls   │   │ ● ● ●  portfolio.porto.build/...    │     │
   │  vertically│   ├──────────────────────────────────────┤     │
   │            │   │  Portfolio1 component                 │     │
   │            │   │  (live, props-driven)                 │     │
   │            │   └──────────────────────────────────────┘     │
   └────────────┴────────────────────────────────────────────────┘
   ```

7. **Not found handling:** If `templateId` doesn't exist in the registry, shows a "Template not found" message with a back link.

---

### Adding a New Template

1. Create `portfolio-templates/portfolio-2/` with:
   - `Portfolio2.tsx` — component accepting `PortfolioProps`
   - `Portfolio2.module.css` — scoped styles
   - `Portfolio2Form.tsx` — form (can reuse Portfolio1Form if the fields are the same)

2. Add to the registry in `[templateId]/page.tsx`:
   ```ts
   template2: { name: "Minimal", Form: Portfolio2Form, Preview: Portfolio2 },
   ```

3. Add to `SANDBOX_TEMPLATE_MAP` in `lib/sandbox-template-utils.ts`:
   ```ts
   template2: { dir: "portfolio-2", component: "Portfolio2.tsx", css: "Portfolio2.module.css" },
   ```

4. Add a card to `app/arena/templates/page.tsx`:
   ```ts
   { id: "template2", name: "Minimal", price: "Free" },
   ```

That's it — the routing, form, preview, save/load, and sandbox deploy all work automatically.

---
---

# 3. Sandbox Deployment — Template to Code Editor

## Overview

The bridge between the template system and the code editor. The template editor's **"Sandbox" button** deploys the user's current portfolio data into an E2B cloud sandbox as a standalone Next.js app, then navigates to the full code editor (`/editor`) with the sandbox already running. The user lands in the IDE with their template files in the file tree, a CodeMirror editor, and a live iframe preview — they can freely edit the code, add files, and see changes via HMR.

```
/arena/templates/template1                             /editor?sandboxId=...&previewUrl=...&templateId=...
┌──────────┬────────┬──────────────┐                  ┌────────┬────────────┬──────────────┐
│          │        │              │                   │        │            │              │
│ Sidebar  │  Form  │  Browser     │   click           │  File  │  CodeMirror │  Live        │
│          │ panel  │  Preview     │  "Sandbox"  ──►   │  Tree  │  Editor    │  Preview     │
│          │        │  (local)     │                   │        │            │  (iframe)    │
│          │        │              │                   │        │            │              │
└──────────┴────────┴──────────────┘                  └────────┴────────────┴──────────────┘
```

### Flow (Template → Sandbox)

1. User clicks "Sandbox" on `/arena/templates/[templateId]`
2. **Portfolio data is saved first** (localStorage + `POST /api/portfolio`) before sandbox creation
3. Client calls `POST /api/sandbox/deploy-template` with `{ templateId, portfolioData }`
4. Server creates sandbox, reads template files from disk, adapts import paths, generates `page.tsx` (with user's data as props), writes 6 files to `/home/user/app/`
5. Client receives `{ sandboxId, previewUrl }` → navigates to `/editor?sandboxId=...&previewUrl=...&templateId=...`
6. Editor page detects query params → skips creating a new sandbox → uses the pre-loaded one

### Flow (Sandbox → Template — Save on Back)

1. User clicks the back button (←) in the sandbox editor
2. Editor calls `POST /api/sandbox/extract-data` with `{ sandboxId }` — reads `page.tsx` from the sandbox and extracts the `const data = { ... }` JSON
3. Extracted portfolio data is saved to the server via `POST /api/portfolio` with `{ templateId, portfolioData }`
4. User is navigated back to the template editor, which loads the updated data from the server
5. If extraction or save fails, the user still navigates back (best-effort save)

---

### `lib/sandbox-template-utils.ts` — Shared Utilities

**What it does:** Contains shared constants and functions used by both the server-side deploy route and client-side code.

- **`SANDBOX_TEMPLATE_MAP`** — maps template IDs to their file metadata:
  ```ts
  template1 → { dir: "portfolio-1", component: "Portfolio1.tsx", css: "Portfolio1.module.css" }
  ```
  Adding a new template = one new entry here.

- **`generateSandboxPageTsx(componentFileName, portfolioData)`** — generates the `page.tsx` source code for the sandbox. It imports the template component and renders it with the user's data as a hardcoded props object:
  ```tsx
  import Portfolio1 from "./Portfolio1";

  const data = { name: "Jane Doe", title: "Developer", ... };

  export default function Page() {
    return <Portfolio1 {...data} />;
  }
  ```

**Why it's shared:** The deploy route uses it server-side for the initial deploy. If incremental updates were needed in the future, the client could also call it to regenerate `page.tsx` without a dedicated API route.

---

### `app/api/sandbox/deploy-template/route.ts` — Deploy Template to Sandbox

**What it does:** Single API route that creates a sandbox and writes all template files into it in one request.

- **Method:** POST
- **Auth:** `requireAuth()`
- **Body:** `{ templateId: "template1", portfolioData: { name: "Jane", ... } }`
- **Returns:** `{ sandboxId: "abc123", previewUrl: "https://abc123-3000.e2b.dev" }`

**Step-by-step flow inside the route:**

1. **Validate** — checks `templateId` exists in `SANDBOX_TEMPLATE_MAP`
2. **Create sandbox** — calls `createSandbox()` from `lib/sandbox.ts`
3. **Read template files from disk** — uses `fs.readFileSync` to read three files from the `portfolio-templates/` directory:
   - `PortfolioTypes.ts` — shared type definitions
   - `Portfolio1.tsx` — the template component
   - `Portfolio1.module.css` — scoped styles
4. **Adapt import paths** — the original component imports from `"../PortfolioTypes"` (parent directory). In the sandbox all files live in `/home/user/app/` (flat), so it rewrites to `"./PortfolioTypes"` via regex replace
5. **Generate dynamic files** — creates three files that don't exist on disk:
   - `page.tsx` — imports the template component and renders it with the user's data (via `generateSandboxPageTsx`)
   - `layout.tsx` — minimal Next.js root layout (`<html><body>{children}</body></html>`)
   - `globals.css` — minimal CSS reset (box-sizing + font smoothing)
6. **Write all 6 files to sandbox in parallel** — uses `Promise.all` with `sandbox.files.write()`:
   ```
   /home/user/app/
   ├── page.tsx              ← generated (imports Portfolio1, passes user data as props)
   ├── layout.tsx            ← generated (minimal, no Tailwind)
   ├── globals.css           ← generated (CSS reset only)
   ├── Portfolio1.tsx         ← from disk (import path adapted)
   ├── Portfolio1.module.css  ← from disk (unchanged)
   └── PortfolioTypes.ts     ← from disk (unchanged)
   ```
7. **Return** — `{ sandboxId, previewUrl }` to the client

**Key design decisions:**
- **Why read from disk?** Template files can be large (770-line CSS). Embedding them as string constants would bloat the API route. Reading from `portfolio-templates/` is clean and stays in sync with the source of truth.
- **Why a flat structure?** All files in `/home/user/app/` avoids creating subdirectories. The only path that needs rewriting is `"../PortfolioTypes"` → `"./PortfolioTypes"`. The CSS Module import (`"./Portfolio1.module.css"`) already works because it's same-directory.
- **Why generate `layout.tsx` and `globals.css`?** The sandbox's default `create-next-app` layout includes Tailwind imports and styling that would conflict. The generated files give the template a clean environment. Google Fonts are loaded via `<link>` tags inside `Portfolio1.tsx` itself, so no special setup is needed.

---
---

# 4. User Isolation & Authentication

## Overview

Porto.build is a multi-tenant SaaS — each user's portfolio data is completely isolated. No user can see or modify another user's portfolio data.

## Auth Architecture (Defense-in-Depth)

Authentication is enforced at **two layers**:

### Layer 1: Route Protection (`proxy.ts`)
- Next.js 16 proxy (replaces deprecated `middleware.ts`)
- Uses `auth.api.getSession()` to check the session cookie
- **Protects pages**: unauthenticated users visiting `/arena`, `/dashboard`, `/editor` are redirected to `/auth/signin`
- **Does NOT protect API routes** — it only handles page navigation redirects

### Layer 2: API Route Auth Guards (`requireAuth()`)
- Every API route independently validates the session
- Uses the `requireAuth()` helper from `lib/auth-session.ts`
- Returns the authenticated user's ID (`string`) or a `NextResponse` with 401 status
- **Why both layers?** The proxy protects pages (redirects browsers). API routes need their own auth because they return JSON (a redirect response would break `fetch()` calls). This is defense-in-depth — if the proxy fails or is bypassed, the API routes still reject unauthenticated requests.

### `requireAuth()` Helper (`lib/auth-session.ts`)

```ts
export async function requireAuth(): Promise<string | NextResponse> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session.user.id;
}
```

**Usage pattern in every API route:**
```ts
const auth = await requireAuth();
if (auth instanceof NextResponse) return auth;
const userId = auth; // string — the authenticated user's ID
```

This eliminates the repeated `getServerSession()` + null-check boilerplate that was previously duplicated across all routes.

## Auth Guards on All API Routes

| Route | Auth |
|---|---|
| `POST /api/sandbox/create` | `requireAuth()` |
| `POST /api/sandbox/deploy-template` | `requireAuth()` |
| `POST /api/sandbox/extract-data` | `requireAuth()` |
| `GET /api/sandbox/files` | `requireAuth()` |
| `GET /api/sandbox/files/read` | `requireAuth()` |
| `POST /api/sandbox/files/write` | `requireAuth()` |
| `POST /api/sandbox/files/delete` | `requireAuth()` |
| `POST /api/sandbox/files/mkdir` | `requireAuth()` |
| `GET /api/portfolio` | `requireAuth()` |
| `POST /api/portfolio` | `requireAuth()` |

## User-Scoped Data Storage

### Client-Side (localStorage)
- Keys are scoped: `porto_template_{userId}_{templateId}` (via `storageKey()` helper)
- `useSession()` from `lib/auth-client.ts` provides the user ID on the client
- localStorage is a fast cache; the server database is the source of truth

### Server-Side (Portfolio table)
- `Portfolio` model in Prisma: `{ id, userId, templateId, name, content (JSON), status, createdAt, updatedAt }`
- All queries are scoped by `userId` from the session — a user can only read/write their own records
- Upsert pattern: find by `userId + templateId`, update if exists, create if not

### Data Load Sequence (Template Editor)
1. `useSession()` resolves → user ID available
2. Load from user-scoped `localStorage` (fast, offline-capable)
3. Fetch from `GET /api/portfolio` (server source of truth) → merge with defaults → update state + localStorage
4. Loading spinner shown until both session and server data resolve

### Save Sequence
1. User clicks Save → write to user-scoped `localStorage` (instant feedback)
2. Simultaneously `POST /api/portfolio` to persist to database
3. Server failures are silent — localStorage has the data as fallback

## Sandbox Isolation

Each sandbox is ephemeral and created per-session through authenticated API calls. Sandbox IDs are only returned to the authenticated caller — one user cannot access another user's sandbox because they never receive the sandbox ID.

---
---

# 5. Portfolio API

## `app/api/portfolio/route.ts`

### GET `/api/portfolio?templateId=...`
- **Auth:** `requireAuth()` — returns 401 if unauthenticated
- Returns the authenticated user's portfolio data for a given template
- Queries `Portfolio` table filtered by `userId + templateId`, ordered by `updatedAt desc`
- Returns `{ data: <content JSON>, portfolioId: <id> }` or `{ data: null }` if no portfolio exists

### POST `/api/portfolio`
- **Auth:** `requireAuth()` — returns 401 if unauthenticated
- **Body:** `{ templateId, portfolioData }`
- Upserts: finds existing `Portfolio` by `userId + templateId`, updates if exists, creates if not
- On update: overwrites `content` field, updates `name` from `portfolioData.name` if present
- On create: sets `status: "DRAFT"`, `name` from `portfolioData.name` or "My Portfolio"
- Returns `{ success: true, portfolioId: <id> }`

---
---

# Data Flows

## Editing a File in the Code Editor

```
1. User clicks "app/Portfolio1.tsx" in FileTree
       │
       ▼
2. FileTree calls onFileSelect("/home/user/app/Portfolio1.tsx")
       │
       ▼
3. EditorPage fetches GET /api/sandbox/files/read?id=abc&path=/home/user/app/Portfolio1.tsx
       │
       ▼
4. API route calls sandbox.files.read("/home/user/app/Portfolio1.tsx")
       │
       ▼
5. Content returned → stored in fileContents Map → displayed in CodeMirror
       │
       ▼
6. User types changes → onChange fires → fileContents updated immediately (local)
       │
       ▼
7. After 1 second of no typing → debouncedWrite fires
       │
       ▼
8. POST /api/sandbox/files/write { id, path, content }
       │
       ▼
9. API route calls sandbox.files.write(path, content)
       │
       ▼
10. Next.js dev server in sandbox detects file change → HMR
       │
       ▼
11. Preview iframe auto-updates (no reload needed)
```

---

## User Edits Their Portfolio (Template Form)

```
1. User navigates to /arena/templates
       │
       ▼
2. Sees grid of TemplateCards — clicks "Brutalist"
       │
       ▼
3. Browser navigates to /arena/templates/template1
       │
       ▼
4. [templateId]/page.tsx loads:
   a. useSession() → gets authenticated user ID
   b. Checks user-scoped localStorage for "porto_template_{userId}_template1"
   c. Fetches GET /api/portfolio?templateId=template1 (server source of truth)
   d. Merges server data with defaults → pre-fills form
   e. Renders Form on the left, BrowserPreview + Portfolio1 on the right
       │
       ▼
5. User types in the form (e.g. changes name to "Jane Doe")
       │
       ▼
6. Portfolio1Form calls onChange({ ...data, name: "Jane Doe" })
       │
       ▼
7. TemplateEditorPage updates state: setPortfolioData(newData)
       │
       ▼
8. React re-renders Portfolio1 with new props → preview updates instantly
       │
       ▼
9. User clicks "Save":
   a. Writes to user-scoped localStorage (instant)
   b. POST /api/portfolio { templateId, portfolioData } (background, to database)
   OR
   User clicks "Sandbox":
   a. Saves data first (localStorage + server)
   b. Deploys to E2B → navigates to /editor (see below)
```

---

## Template → Sandbox → Editor → Back (Full Round-Trip)

```
1. User is on /arena/templates/template1 with form filled out
       │
       ▼
2. User clicks "Sandbox" button
       │
       ▼
3. handleLaunchSandbox() fires:
   a. Saves to user-scoped localStorage
   b. POST /api/portfolio (persist to database)
   c. POST /api/sandbox/deploy-template
      Body: { templateId: "template1", portfolioData: { name: "Jane", ... } }
       │
       ▼
4. Server-side route:
   a. requireAuth() → validates session, gets userId
   b. Calls createSandbox() → new E2B sandbox spins up
   c. Reads Portfolio1.tsx, Portfolio1.module.css, PortfolioTypes.ts from disk
   d. Adapts import paths (../PortfolioTypes → ./PortfolioTypes)
   e. Generates page.tsx (renders Portfolio1 with user's data as props)
   f. Generates layout.tsx (minimal) + globals.css (CSS reset)
   g. Writes all 6 files to /home/user/app/ in parallel
   h. Returns { sandboxId, previewUrl }
       │
       ▼
5. Client receives response → navigates to:
   /editor?sandboxId=abc123&previewUrl=https://abc123-3000.e2b.dev&templateId=template1
       │
       ▼
6. Editor page mounts:
   a. Reads sandboxId + previewUrl + templateId from query params
   b. Skips sandbox creation (already exists)
   c. Sets sandboxId + previewUrl in state → FileTree + Preview activate
       │
       ▼
7. User edits code in the sandbox editor...
       │
       ▼
8. User clicks "Back" (←) button
       │
       ▼
9. handleBack() fires:
   a. POST /api/sandbox/extract-data { sandboxId }
      → reads page.tsx from sandbox
      → regex extracts "const data = { ... };"
      → JSON.parse → returns { portfolioData }
   b. POST /api/portfolio { templateId, portfolioData }
      → persists extracted data to database
   c. router.back() → navigates to /arena/templates/template1
       │
       ▼
10. Template editor loads:
    a. useSession() → userId
    b. GET /api/portfolio → gets updated data (including sandbox changes)
    c. Form pre-fills with the data that was edited in the sandbox
```
