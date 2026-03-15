# Porto.build — How It Works

---

## Template System — How It Works

### Overview

The template system lets users browse portfolio templates, click one, fill in a form with their details, and see a live preview update in real time. Data is saved to `localStorage` so it persists across sessions.

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

### File-by-File Breakdown

#### `portfolio-templates/PortfolioTypes.ts` — Shared Type Definitions

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

#### `portfolio-templates/portfolio-1/Portfolio1.tsx` — Template Component

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

#### `portfolio-templates/portfolio-1/Portfolio1.module.css` — Scoped Styles

**What it does:** All CSS for Portfolio1, scoped via CSS Modules.

- Defines template-specific CSS variables under `.wrapper` (e.g. `--p1-primary: #a413ec`)
- Contains styles for every section: `.hero`, `.skillsSection`, `.projectCard`, `.experienceItem`, etc.
- Responsive breakpoints at 768px and 1024px
- No Tailwind dependency — the template is self-contained and can render inside an E2B sandbox or as a standalone page

---

#### `portfolio-templates/portfolio-1/Portfolio1Form.tsx` — Customization Form

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

#### `components/template-card.tsx` — Template Card (Listing)

**What it does:** Renders a single template card on the `/arena/templates` page.

**Props:** `id`, `name`, `price`, `discount?`, `preview?`

**Key behavior:**
- Wrapped in a `<Link href={/arena/templates/${id}}>` — clicking navigates to the editor
- Dashed border with corner accent marks on hover
- Optional `preview` image for thumbnail
- Supports discount display (original price struck through + discounted price)

---

#### `components/browser-preview.tsx` — Reusable Browser Frame

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

#### `app/arena/templates/page.tsx` — Templates Listing Page

**What it does:** Server component that renders a grid of `TemplateCard` components.

- Template data is currently hardcoded (array of `{ id, name, price, discount? }`)
- 3-column grid on desktop, 2 on tablet, 1 on mobile
- Each card links to `/arena/templates/{id}`

---

#### `app/arena/templates/[templateId]/page.tsx` — Template Editor Page

**What it does:** The main editor page. This is where the form + live preview live side by side.

**Key parts:**

1. **Template Registry** — a `TEMPLATE_REGISTRY` object mapping template IDs to their `{ name, Form, Preview }` components:
   ```ts
   template1 → { name: "Brutalist", Form: Portfolio1Form, Preview: Portfolio1 }
   ```
   Adding a new template = one new entry here + the template files.

2. **localStorage persistence:**
   - `loadSavedData(templateId)` — reads from `localStorage` key `porto_template_{id}`
   - `saveData(templateId, data)` — writes full `PortfolioProps` JSON to `localStorage`
   - On page load: merges saved data with defaults so the form always has values

3. **State flow:**
   ```
   Form (onChange) → setPortfolioData → Preview re-renders with new props
   ```
   Every keystroke in the form triggers `onChange` → state updates → the Preview component receives new props and re-renders instantly. No API calls, no debouncing — it's all local React state.

4. **Save button:**
   - Calls `saveData()` to persist to `localStorage`
   - Shows "Saved!" for 2 seconds then reverts to "Save"

5. **Layout:**
   ```
   ┌─────────────────────────────────────────────────┐
   │  ← Back    Brutalist    EDITOR         [Save]   │  ← top bar
   ├────────────┬────────────────────────────────────┤
   │            │                                    │
   │   Form     │   BrowserPreview                   │
   │  (480px)   │   ┌──────────────────────────┐     │
   │  scrolls   │   │ ● ● ●  url bar          │     │
   │  vertically│   ├──────────────────────────┤     │
   │            │   │                          │     │
   │            │   │  Portfolio1 component     │     │
   │            │   │  (live, props-driven)     │     │
   │            │   │                          │     │
   │            │   └──────────────────────────┘     │
   └────────────┴────────────────────────────────────┘
   ```

6. **Not found handling:** If `templateId` doesn't exist in the registry, shows a "Template not found" message with a back link.

---

### Data Flow: User Edits Their Portfolio

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
   a. Looks up "template1" in TEMPLATE_REGISTRY → finds Portfolio1Form + Portfolio1
   b. Checks localStorage for "porto_template_template1" → merges with defaults
   c. Renders Form on the left, BrowserPreview + Portfolio1 on the right
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
9. User clicks "Save"
       │
       ▼
10. saveData("template1", portfolioData) → writes to localStorage
       │
       ▼
11. Next time user visits /arena/templates/template1 → data is loaded from localStorage
```

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

3. Add a card to `app/arena/templates/page.tsx`:
   ```ts
   { id: "template2", name: "Minimal", price: "Free" },
   ```

That's it — the routing, form, preview, and save/load all work automatically.

---
---

# Legacy: Editor & E2B Sandbox System (Reference)

## High-Level Flow

```
User visits /editor
       │
       ▼
┌──────────────────┐     POST /api/sandbox/create     ┌──────────────────┐
│  Editor Page     │ ──────────────────────────────►   │  E2B Cloud       │
│  (app/editor/    │                                   │  Sandbox         │
│   page.tsx)      │  ◄─────────────────────────────   │  (Next.js dev    │
│                  │   { sandboxId, previewUrl }        │   server on      │
│  ┌────┬────┬───┐ │                                   │   port 3000)     │
│  │Tree│Edit│View│ │                                   └──────────────────┘
│  └────┴────┴───┘ │                                          ▲
│       │    │     │    GET/POST /api/sandbox/files/*          │
│       │    │     │ ─────────────────────────────────────────►│
│       │    │     │   (list, read, write, delete, mkdir)      │
│       │    │     │                                           │
│       │    └─────│── iframe src={previewUrl} ───────────────►│
│       │          │   (live preview with HMR auto-refresh)    │
└───────┴──────────┘
```

---

## Project Structure (only project files)

```
├── app/
│   ├── page.tsx                          # Landing page with "Open Editor" link
│   ├── layout.tsx                        # Root layout (fonts, metadata)
│   ├── globals.css                       # Tailwind CSS + theme variables
│   ├── editor/
│   │   └── page.tsx                      # Main IDE page (orchestrator)
│   └── api/
│       └── sandbox/
│           ├── create/route.ts           # POST — spin up a new sandbox
│           └── files/
│               ├── route.ts              # GET  — list files in sandbox
│               ├── read/route.ts         # GET  — read a file's content
│               ├── write/route.ts        # POST — write/create a file
│               ├── delete/route.ts       # POST — delete a file
│               └── mkdir/route.ts        # POST — create a directory
├── components/
│   ├── editor/
│   │   ├── FileTree.tsx                  # File explorer panel
│   │   ├── FileTreeItem.tsx              # Single file/folder row (recursive)
│   │   ├── CodeEditor.tsx                # CodeMirror 6 wrapper
│   │   ├── FileTabs.tsx                  # Open file tabs bar
│   │   └── Preview.tsx                   # Live preview iframe
│   └── ui/
│       └── icons.tsx                     # SVG icon components
├── lib/
│   ├── sandbox.ts                        # Server-side sandbox manager
│   └── hooks/
│       └── use-debounce.ts               # Debounce hook for auto-save
├── e2b/
│   ├── template.ts                       # E2B sandbox template definition
│   └── build.ts                          # Script to build the template
├── .env                                  # E2B_API_KEY
├── package.json
├── next.config.ts
├── tsconfig.json
└── CLAUDE.md                             # Project documentation
```

---

## File-by-File Breakdown

### Server-Side (Backend)

#### `lib/sandbox.ts` — Sandbox Manager
**What it does:** Manages E2B sandbox instances on the server.

- Keeps a `Map<string, Sandbox>` in memory so all API routes share the same sandbox instance
- `createSandbox()` — calls `Sandbox.create("nextjs-app")`, caches the instance, returns the sandbox ID and preview URL
- `getSandbox(id)` — looks up cached sandbox, or reconnects via `Sandbox.connect()` if the server restarted
- The preview URL is built from `sandbox.getHost(3000)` which gives the public hostname for the sandbox's port 3000

**Used by:** All API routes import from this file.

---

#### `app/api/sandbox/create/route.ts` — Create Sandbox
**What it does:** Spins up a new E2B cloud sandbox.

- **Method:** POST
- **Calls:** `createSandbox()` from `lib/sandbox.ts`
- **Returns:** `{ sandboxId: "abc123", previewUrl: "https://abc123-3000.e2b.dev" }`
- **When called:** Once when the user opens `/editor`

---

#### `app/api/sandbox/files/route.ts` — List Files
**What it does:** Lists files and folders at a given path inside the sandbox.

- **Method:** GET
- **Params:** `?id=sandboxId&path=/home/user`
- **Calls:** `sandbox.files.list(path)`
- **Filters out:** `node_modules` and `.next` directories
- **Returns:** `{ entries: [{ name, type, path }, ...] }`
- **When called:** When the file tree loads or a folder is expanded

---

#### `app/api/sandbox/files/read/route.ts` — Read File
**What it does:** Reads the content of a single file from the sandbox.

- **Method:** GET
- **Params:** `?id=sandboxId&path=/home/user/pages/index.tsx`
- **Calls:** `sandbox.files.read(path)`
- **Returns:** `{ content: "file content as string" }`
- **When called:** When the user clicks a file in the tree to open it

---

#### `app/api/sandbox/files/write/route.ts` — Write File
**What it does:** Writes content to a file in the sandbox (creates it if it doesn't exist).

- **Method:** POST
- **Body:** `{ id, path, content }`
- **Calls:** `sandbox.files.write(path, content)`
- **Returns:** `{ success: true }`
- **When called:** Auto-save (1 second after user stops typing), or when creating a new file

---

#### `app/api/sandbox/files/delete/route.ts` — Delete File
**What it does:** Deletes a file or directory from the sandbox.

- **Method:** POST
- **Body:** `{ id, path }`
- **Calls:** `sandbox.files.remove(path)`
- **Returns:** `{ success: true }`
- **When called:** When user clicks the trash icon on a file/folder

---

#### `app/api/sandbox/files/mkdir/route.ts` — Create Directory
**What it does:** Creates a new directory in the sandbox.

- **Method:** POST
- **Body:** `{ id, path }`
- **Calls:** `sandbox.files.makeDir(path)`
- **Returns:** `{ success: true }`
- **When called:** When user creates a new folder via the file tree toolbar

---

### Client-Side (Frontend)

#### `app/editor/page.tsx` — Main IDE Page (Orchestrator)
**What it does:** The main page that wires all editor components together.

**State it manages:**
- `sandboxId` — ID of the current sandbox
- `previewUrl` — URL for the iframe preview
- `openFiles` — array of file paths currently open as tabs
- `activeFile` — which tab is selected
- `fileContents` — `Map<path, content>` cache of file contents

**Flow:**
1. On mount → POST `/api/sandbox/create` → stores sandbox ID + preview URL
2. User clicks a file → fetches content via `/api/sandbox/files/read` → opens in CodeMirror
3. User types → updates local state → debounced write to `/api/sandbox/files/write` after 1 second
4. Sandbox's Next.js dev server detects the file change → HMR updates the iframe preview automatically

**Key detail:** CodeMirror is loaded with `next/dynamic` and `{ ssr: false }` because it only works in the browser.

---

#### `components/editor/FileTree.tsx` — File Explorer Panel
**What it does:** Shows the sandbox's file structure with toolbar buttons.

- Fetches root files from `GET /api/sandbox/files?path=/home/user` on mount
- Sorts entries: directories first, then alphabetical
- Toolbar has two buttons: "New File" (+) and "New Folder" (folder icon)
- Clicking either shows an inline text input where you type the name
- "New File" → POST `/api/sandbox/files/write` with empty content
- "New Folder" → POST `/api/sandbox/files/mkdir`
- After creating, it re-fetches the file list

---

#### `components/editor/FileTreeItem.tsx` — Single Tree Item (Recursive)
**What it does:** Renders one file or folder row. Folders render their children recursively.

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

#### `components/editor/CodeEditor.tsx` — Code Editor
**What it does:** Wraps CodeMirror 6 (`@uiw/react-codemirror`) for syntax-highlighted editing.

- Uses the One Dark theme (VS Code-like dark appearance)
- Auto-detects language from file extension:
  - `.ts`, `.tsx`, `.js`, `.jsx` → JavaScript/TypeScript with JSX
  - `.css` → CSS
  - `.html` → HTML
  - `.json` → JSON
- Features enabled: line numbers, code folding, bracket matching, autocompletion, auto-indent
- Fires `onChange` on every keystroke (parent handles debouncing)

---

#### `components/editor/FileTabs.tsx` — Tab Bar
**What it does:** Horizontal tab bar showing all open files.

- Each tab shows the filename (last part of the path)
- Active tab has a blue top border and brighter background
- Each tab has an "x" button (visible on hover) to close it
- Clicking a tab switches the editor to that file

---

#### `components/editor/Preview.tsx` — Live Preview
**What it does:** Embeds the sandbox's running Next.js app in an iframe.

- Shows a loading spinner while the sandbox is starting
- Once ready, shows:
  - A toolbar with the sandbox URL and a refresh button
  - An iframe pointing to the sandbox's public URL
- The refresh button remounts the iframe (useful if HMR misses a change)
- HMR (Hot Module Replacement) in the sandbox's Next.js dev server handles most updates automatically

---

### Utilities

#### `lib/hooks/use-debounce.ts` — Debounce Hook
**What it does:** Returns a debounced version of a callback function.

- Used by the editor page to delay file writes
- When the user types, it waits 1 second of inactivity before writing to the sandbox
- Prevents flooding the API with a write on every keystroke

---

#### `components/ui/icons.tsx` — SVG Icons
**What it does:** Simple SVG icon components used throughout the editor UI.

- `FileIcon` — document icon for files
- `FolderIcon` / `FolderOpenIcon` — folder icons (closed/open states)
- `ChevronRightIcon` — arrow for folder expand/collapse
- `PlusIcon` — "+" for new file button
- `TrashIcon` — trash can for delete
- `XIcon` — "x" for closing tabs
- `RefreshIcon` — circular arrows for preview refresh

---

### E2B Template

#### `e2b/template.ts` — Sandbox Template Definition
**What it does:** Defines what the cloud sandbox contains when it starts up.

- Base: Node.js 21 slim image
- Installs: Next.js 14 + Tailwind CSS + all shadcn/ui components
- Working directory: `/home/user`
- Start command: `npx next --turbo` (runs Next.js dev server with Turbopack)
- Waits for `http://localhost:3000` to be ready before the sandbox is considered started

#### `e2b/build.ts` — Template Build Script
**What it does:** Builds and pushes the template to E2B's cloud.

- Run with: `npm run e2b:build`
- Must be run once before the editor can work
- Takes a few minutes (installs Next.js + shadcn inside the template image)

---

## Data Flow: Editing a File

```
1. User clicks "pages/index.tsx" in FileTree
       │
       ▼
2. FileTree calls onFileSelect("/home/user/pages/index.tsx")
       │
       ▼
3. EditorPage fetches GET /api/sandbox/files/read?id=abc&path=/home/user/pages/index.tsx
       │
       ▼
4. API route calls sandbox.files.read("/home/user/pages/index.tsx")
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

## Data Flow: Creating a New File

```
1. User clicks "+" button in FileTree toolbar
       │
       ▼
2. Inline input appears → user types "components/Hero.tsx" → presses Enter
       │
       ▼
3. POST /api/sandbox/files/write { id, path: "/home/user/components/Hero.tsx", content: "" }
       │
       ▼
4. API route calls sandbox.files.write(path, "")
       │
       ▼
5. FileTree re-fetches file list → new file appears in tree
       │
       ▼
6. User clicks the new file → opens in editor (same flow as above)
```
