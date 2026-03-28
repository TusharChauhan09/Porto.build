"use client";

import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Mail,
  ExternalLink,
  LayoutTemplate,
  FileUser,
  Code,
  Rocket,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const faqs = [
  {
    q: "How do I create a portfolio?",
    a: "Go to Templates, pick a template, customize it with your details using the form editor, then preview it in the sandbox.",
  },
  {
    q: "How do I deploy my portfolio?",
    a: "After customizing your template, click the Deploy button to publish it to Vercel, or upload it to GitHub as a repository.",
  },
  {
    q: "Can I edit the code directly?",
    a: "Yes! Use the Code Editor to open your portfolio in an E2B sandbox where you can edit files, see live previews, and save changes.",
  },
  {
    q: "What is the CV Maker?",
    a: "The CV Maker lets you create a professional CV/resume that you can download as a PDF, separate from your portfolio website.",
  },
];

const quickLinks = [
  {
    title: "Templates",
    description: "Browse and customize portfolio templates",
    href: "/arena/templates",
    icon: LayoutTemplate,
  },
  {
    title: "CV Maker",
    description: "Create and download your CV",
    href: "/arena/cv-maker",
    icon: FileUser,
  },
  {
    title: "Documentation",
    description: "Read the full documentation",
    href: "/arena/docs",
    icon: BookOpen,
  },
];

export default function HelpPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle size={22} strokeWidth={1.5} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        </div>

        {/* Quick Links */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4 flex items-center gap-2">
            <Rocket size={14} strokeWidth={1.5} />
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <motion.div key={link.href} whileTap={{ scale: 0.97 }}>
                <Link
                  href={link.href}
                  className="block bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
                >
                  <link.icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-muted-foreground group-hover:text-foreground transition-colors mb-2"
                  />
                  <p className="text-sm font-medium text-foreground">{link.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {link.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4 flex items-center gap-2">
            <MessageSquare size={14} strokeWidth={1.5} />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-5"
              >
                <p className="text-sm font-medium text-foreground mb-1.5">
                  {faq.q}
                </p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4 flex items-center gap-2">
            <Mail size={14} strokeWidth={1.5} />
            Contact Us
          </h2>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground mb-4">
              Need more help? Reach out through one of these channels.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/arena/feedback"
                className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary transition-colors"
              >
                <MessageSquare size={14} strokeWidth={1.5} />
                Submit feedback
              </Link>
              <a
                href="mailto:support@porto.build"
                className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary transition-colors"
              >
                <Mail size={14} strokeWidth={1.5} />
                support@porto.build
                <ExternalLink size={10} strokeWidth={1.5} className="text-muted-foreground" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
