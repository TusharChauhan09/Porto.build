# PortfolioForge — How It Works

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
