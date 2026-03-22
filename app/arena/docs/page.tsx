"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Rocket,
  LayoutTemplate,
  Code2,
  Globe,
  Database,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DocsNav, type DocSection } from "@/components/docs/DocsNav";

const SECTIONS: DocSection[] = [
  { id: "getting-started", title: "Getting Started", icon: Rocket },
  { id: "templates", title: "Templates", icon: LayoutTemplate },
  { id: "sandbox", title: "Sandbox & Code Editor", icon: Code2 },
  { id: "deploying", title: "Deploying", icon: Globe },
  { id: "portfolio-api", title: "Portfolio API", icon: Database },
  { id: "cv-maker", title: "CV Maker", icon: FileText },
];

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[13px] bg-secondary px-1.5 py-0.5 rounded text-foreground">
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-secondary rounded-lg p-4 overflow-x-auto border border-border my-4">
      <code className="font-mono text-[13px] text-foreground whitespace-pre">{children}</code>
    </pre>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg px-4 py-3 text-sm text-muted-foreground my-4">
      {children}
    </div>
  );
}

function ComingSoon() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium ml-2">
      <Sparkles size={10} />
      Coming soon
    </span>
  );
}

function SectionHeading({
  id,
  icon: Icon,
  children,
}: {
  id: string;
  icon: typeof Rocket;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      data-section
      className="text-xl font-semibold tracking-tight text-foreground mb-4 flex items-center gap-2.5 scroll-mt-10"
    >
      <Icon size={20} strokeWidth={1.5} className="text-primary" />
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-foreground mt-8 mb-3">{children}</h3>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground leading-relaxed mb-4">{children}</p>;
}

function SectionDivider() {
  return <div className="border-t border-border mt-12 pt-12" />;
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          setActiveSection(topmost.target.id);
        }
      },
      {
        root: container,
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      }
    );

    const sectionEls = container.querySelectorAll("[data-section]");
    sectionEls.forEach((el) => observer.observe(el));

    // When scrolled to the bottom, activate the last section
    function handleScroll() {
      if (!container) return;
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
      if (atBottom) {
        const lastSection = SECTIONS[SECTIONS.length - 1];
        setActiveSection(lastSection.id);
      }
    }

    container.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el && scrollRef.current) {
      const container = scrollRef.current;
      const top = el.offsetTop - container.offsetTop - 40;
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="flex h-full">
      <DocsNav
        sections={SECTIONS}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      <div ref={scrollRef} className="flex-1 h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-10 py-10">
          {/* Page header */}
          <div className="mb-12">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Documentation</h1>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about building and deploying your portfolio with Porto.build.
            </p>
          </div>

          {/* ────────────────── Getting Started ────────────────── */}
          <SectionHeading id="getting-started" icon={Rocket}>
            Getting Started
          </SectionHeading>

          <Paragraph>
            Porto.build helps you create and deploy a professional portfolio website in minutes.
            Pick a template, customize it with your information, preview it live, and ship it.
          </Paragraph>

          <SubHeading>Sign in</SubHeading>
          <Paragraph>
            Create an account or sign in with your <InlineCode>Google</InlineCode> or{" "}
            <InlineCode>GitHub</InlineCode> account. After signing in you&apos;ll land in the{" "}
            <strong className="text-foreground">Arena</strong> — your workspace for building portfolios.
          </Paragraph>

          <SubHeading>Quick start</SubHeading>
          <ol className="list-none space-y-3 text-sm text-muted-foreground mb-4">
            {[
              "Sign in with Google or GitHub",
              "Browse and pick a template",
              "Fill in your details using the form editor",
              "Preview your portfolio in real time",
              "Launch the sandbox for advanced code editing",
              "Save and deploy",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          <Tip>
            Your portfolio data is automatically saved to the cloud so you can pick up where you left off on any device.
          </Tip>

          {/* ────────────────── Templates ────────────────── */}
          <SectionDivider />
          <SectionHeading id="templates" icon={LayoutTemplate}>
            Templates
          </SectionHeading>

          <Paragraph>
            Porto.build offers a growing collection of professionally designed portfolio templates.
            Each template has its own visual style — from brutalist to minimal, cyberpunk to luxury.
          </Paragraph>

          <SubHeading>Browsing templates</SubHeading>
          <Paragraph>
            Navigate to <strong className="text-foreground">Templates</strong> in the sidebar to see
            the full collection. Each card shows a live preview of the template along with its name
            and price. Click any card to open the template editor.
          </Paragraph>

          <SubHeading>Template editor</SubHeading>
          <Paragraph>
            The template editor is a split-screen view with a <strong className="text-foreground">form panel</strong> on
            the left and a <strong className="text-foreground">live preview</strong> on the right. The divider between
            them is draggable so you can adjust the width to your preference.
          </Paragraph>

          <Paragraph>
            The form lets you customize every aspect of your portfolio:
          </Paragraph>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-4">
            <li>Personal info — name, title, bio, email, location, avatar</li>
            <li>Social links — GitHub, LinkedIn, Twitter, website, and more</li>
            <li>Skills — add, remove, and reorder your skills</li>
            <li>Projects — title, description, tech stack, links, images</li>
            <li>Experience — company, role, dates, description</li>
            <li>Education — institution, degree, dates</li>
            <li>Certifications — name, issuer, date</li>
          </ul>

          <SubHeading>Live preview</SubHeading>
          <Paragraph>
            As you type in the form, the preview updates in real time. The preview is wrapped in a
            browser chrome frame showing what your deployed portfolio URL will look like.
          </Paragraph>

          <SubHeading>Saving your work</SubHeading>
          <Paragraph>
            Click the <strong className="text-foreground">Save</strong> button to persist your data.
            Your portfolio is saved in two places for reliability:
          </Paragraph>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-4">
            <li><strong className="text-foreground">Browser storage</strong> — instant load on your next visit</li>
            <li><strong className="text-foreground">Cloud database</strong> — accessible from any device</li>
          </ul>

          <Tip>
            Your data is scoped to your account and template — each template has its own saved data.
          </Tip>

          {/* ────────────────── Sandbox & Code Editor ────────────────── */}
          <SectionDivider />
          <SectionHeading id="sandbox" icon={Code2}>
            Sandbox & Code Editor
          </SectionHeading>

          <Paragraph>
            For advanced customization beyond the form editor, Porto.build gives you a full cloud
            sandbox powered by <InlineCode>E2B</InlineCode>. The sandbox runs a complete Next.js
            environment with your template code, and you can edit it using the built-in code editor.
          </Paragraph>

          <SubHeading>Launching the sandbox</SubHeading>
          <Paragraph>
            From the template editor, click the <strong className="text-foreground">Sandbox</strong> button
            in the top bar. Porto.build will:
          </Paragraph>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground mb-4">
            <li>Save your current portfolio data</li>
            <li>Create a cloud sandbox with Next.js pre-configured</li>
            <li>Deploy your template code into the sandbox</li>
            <li>Open the code editor with a live preview</li>
          </ol>

          <SubHeading>Editor layout</SubHeading>
          <Paragraph>
            The code editor is a three-panel layout:
          </Paragraph>
          <CodeBlock>{`┌──────────┬────────────────────┬──────────────────┐
│ File     │  Code Editor       │  Live Preview    │
│ Tree     │                    │                  │
│          │  (CodeMirror)      │  (iframe)        │
│ - app/   │                    │                  │
│ - css/   │                    │                  │
│ - ...    │                    │                  │
└──────────┴────────────────────┴──────────────────┘`}</CodeBlock>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-4">
            <li><strong className="text-foreground">File tree</strong> — browse and open files in the sandbox</li>
            <li><strong className="text-foreground">Code editor</strong> — edit files with syntax highlighting (CodeMirror)</li>
            <li><strong className="text-foreground">Live preview</strong> — see changes instantly via Hot Module Replacement</li>
          </ul>

          <SubHeading>Editing files</SubHeading>
          <Paragraph>
            Click any file in the tree to open it in the editor. Changes are <strong className="text-foreground">auto-saved</strong> after
            1 second of inactivity and the preview refreshes automatically via HMR. You can also use
            file tabs to switch between open files.
          </Paragraph>

          <SubHeading>File management</SubHeading>
          <Paragraph>
            Right-click in the file tree or use the toolbar icons to:
          </Paragraph>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-4">
            <li>Create new files</li>
            <li>Create new folders</li>
            <li>Delete files and folders</li>
          </ul>

          <SubHeading>Returning to the template editor</SubHeading>
          <Paragraph>
            When you click <strong className="text-foreground">Back</strong> from the code editor,
            Porto.build automatically extracts your updated portfolio data from the sandbox code and
            saves it back to the server. Your form editor will reflect any changes you made in code.
          </Paragraph>

          <Tip>
            The sandbox is ephemeral — it runs while you&apos;re using the editor and is cleaned up after.
            All your data is safely persisted to the cloud before the sandbox stops.
          </Tip>

          {/* ────────────────── Deploying ────────────────── */}
          <SectionDivider />
          <SectionHeading id="deploying" icon={Globe}>
            Deploying
          </SectionHeading>

          <Paragraph>
            While your sandbox is running, the live preview URL is accessible and shareable.
            You can use it to show your portfolio to others or test it on different devices.
          </Paragraph>

          <SubHeading>
            Vercel deployment<ComingSoon />
          </SubHeading>
          <Paragraph>
            One-click deployment to Vercel is on the roadmap. You&apos;ll be able to deploy your
            portfolio to a production URL with a custom domain, SSL, and global CDN — all with
            a single click.
          </Paragraph>

          <SubHeading>
            Download as project<ComingSoon />
          </SubHeading>
          <Paragraph>
            Export your portfolio as a standalone Next.js project zip file. Download it,
            run <InlineCode>npm install && npm run dev</InlineCode>, and you have a fully
            working project you own.
          </Paragraph>

          {/* ────────────────── Portfolio API ────────────────── */}
          <SectionDivider />
          <SectionHeading id="portfolio-api" icon={Database}>
            Portfolio API
          </SectionHeading>

          <Paragraph>
            Porto.build stores your portfolio data on the server, scoped to your user account and
            template. The data is automatically managed by the app, but here&apos;s how it works
            under the hood.
          </Paragraph>

          <SubHeading>How data is stored</SubHeading>
          <Paragraph>
            Each portfolio is identified by a combination of your <InlineCode>userId</InlineCode> and
            the <InlineCode>templateId</InlineCode>. This means you can have different portfolio data
            for each template you customize.
          </Paragraph>

          <SubHeading>Fetching your data</SubHeading>
          <CodeBlock>{`GET /api/portfolio?templateId=template1

// Response
{
  "data": {
    "name": "Jane Doe",
    "title": "Full-Stack Developer",
    "bio": "...",
    "skills": [...],
    "projects": [...]
  },
  "portfolioId": "clx..."
}`}</CodeBlock>

          <SubHeading>Saving your data</SubHeading>
          <CodeBlock>{`POST /api/portfolio
Content-Type: application/json

{
  "templateId": "template1",
  "portfolioData": {
    "name": "Jane Doe",
    "title": "Full-Stack Developer",
    ...
  }
}`}</CodeBlock>

          <Tip>
            All API routes require authentication. Your session cookie is sent automatically
            when making requests from the Porto.build app.
          </Tip>

          {/* ────────────────── CV Maker ────────────────── */}
          <SectionDivider />
          <SectionHeading id="cv-maker" icon={FileText}>
            CV Maker<ComingSoon />
          </SectionHeading>

          <Paragraph>
            The CV Maker will let you generate a professional CV/resume from your portfolio data.
          </Paragraph>

          <SubHeading>What to expect</SubHeading>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-4">
            <li>Auto-populate from your portfolio data — no need to re-enter information</li>
            <li>Multiple CV formats and styles to choose from</li>
            <li>Export as PDF, ready to send to employers</li>
            <li>ATS-friendly formatting options</li>
          </ul>

          {/* Bottom spacer */}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
}
