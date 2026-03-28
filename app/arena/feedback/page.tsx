"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type FeedbackType = "bug" | "feature" | "general";

export default function FeedbackPage() {
  const [type, setType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes: { value: FeedbackType; label: string }[] = [
    { value: "general", label: "General" },
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: wire up to an API endpoint
    setSubmitted(true);
    setMessage("");
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare size={22} strokeWidth={1.5} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border rounded-xl p-8 text-center"
            >
              <CheckCircle size={40} strokeWidth={1.5} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Thanks for your feedback!
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                We appreciate you taking the time to help us improve Porto.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setSubmitted(false)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Submit more feedback
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
            >
              <div className="bg-card border border-border rounded-xl p-5 mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  We&apos;d love to hear from you. Share a bug report, feature request, or general feedback.
                </p>

                {/* Feedback type selector */}
                <div className="flex gap-2 mb-4">
                  {feedbackTypes.map(({ value, label }) => (
                    <motion.button
                      key={value}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setType(value)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        type === value
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>

                {/* Message textarea */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "Describe the bug you encountered..."
                      : type === "feature"
                        ? "Describe the feature you'd like to see..."
                        : "Share your thoughts with us..."
                  }
                  rows={6}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={!message.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} strokeWidth={1.5} />
                Submit feedback
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
