"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import type {
  CVData,
  CVExperience,
  CVEducation,
  CVSkillGroup,
  CVCertification,
  CVLanguage,
  CVSectionId,
  CVColors,
} from "@/lib/cv-types";
import { DEFAULT_CV_DATA } from "@/lib/default-cv-data";

interface CvFormProps {
  initialData?: Partial<CVData>;
  onChange: (data: CVData) => void;
}

const EMPTY_EXPERIENCE: CVExperience = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  bullets: [""],
};

const EMPTY_EDUCATION: CVEducation = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  gpa: "",
  description: "",
};

const EMPTY_SKILL_GROUP: CVSkillGroup = {
  category: "",
  skills: [],
};

const EMPTY_CERTIFICATION: CVCertification = {
  title: "",
  issuer: "",
  date: "",
};

const EMPTY_LANGUAGE: CVLanguage = {
  language: "",
  proficiency: "intermediate",
};

const PROFICIENCY_OPTIONS: CVLanguage["proficiency"][] = [
  "native",
  "fluent",
  "advanced",
  "intermediate",
  "basic",
];

const inputClass =
  "w-full rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

const SECTION_LABELS: Record<CVSectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skillGroups: "Skills",
  certifications: "Certifications",
  languages: "Languages",
};

const COLOR_PRESETS: { label: string; colors: CVColors }[] = [
  { label: "Classic", colors: { heading: "#1a1a1a", accent: "#1a1a1a", text: "#4a4a4a" } },
  { label: "Navy", colors: { heading: "#1e3a5f", accent: "#1e3a5f", text: "#374151" } },
  { label: "Forest", colors: { heading: "#1b4332", accent: "#2d6a4f", text: "#374151" } },
  { label: "Burgundy", colors: { heading: "#6b1d1d", accent: "#8b2525", text: "#374151" } },
  { label: "Royal", colors: { heading: "#4338ca", accent: "#4f46e5", text: "#4b5563" } },
  { label: "Slate", colors: { heading: "#334155", accent: "#475569", text: "#64748b" } },
];

export default function CvForm({ initialData, onChange }: CvFormProps) {
  const [data, setData] = useState<CVData>({
    ...DEFAULT_CV_DATA,
    ...initialData,
    personalInfo: {
      ...DEFAULT_CV_DATA.personalInfo,
      ...initialData?.personalInfo,
    },
    colors: {
      ...DEFAULT_CV_DATA.colors,
      ...initialData?.colors,
    },
    sectionOrder: initialData?.sectionOrder ?? DEFAULT_CV_DATA.sectionOrder,
  });

  function update(patch: Partial<CVData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next);
  }

  function updatePersonalInfo(patch: Partial<CVData["personalInfo"]>) {
    update({ personalInfo: { ...data.personalInfo, ...patch } });
  }

  function updateColors(patch: Partial<CVColors>) {
    update({ colors: { ...data.colors, ...patch } });
  }

  // --- Section order helpers ---
  function moveSectionUp(index: number) {
    if (index === 0) return;
    const order = [...data.sectionOrder];
    [order[index - 1], order[index]] = [order[index], order[index - 1]];
    update({ sectionOrder: order });
  }

  function moveSectionDown(index: number) {
    if (index >= data.sectionOrder.length - 1) return;
    const order = [...data.sectionOrder];
    [order[index], order[index + 1]] = [order[index + 1], order[index]];
    update({ sectionOrder: order });
  }

  // --- Array helpers ---
  function updateArrayItem<K extends keyof CVData>(
    key: K,
    index: number,
    value: CVData[K] extends Array<infer T> ? T : never
  ) {
    const arr = [...(data[key] as unknown[])];
    arr[index] = value;
    update({ [key]: arr } as Partial<CVData>);
  }

  function addArrayItem(key: keyof CVData, empty: object) {
    const arr = [...(data[key] as unknown[]), structuredClone(empty)];
    update({ [key]: arr } as Partial<CVData>);
  }

  function removeArrayItem(key: keyof CVData, index: number) {
    const arr = [...(data[key] as unknown[])];
    arr.splice(index, 1);
    update({ [key]: arr } as Partial<CVData>);
  }

  // --- Bullet helpers for experience ---
  function updateBullet(expIndex: number, bulletIndex: number, value: string) {
    const exp = { ...data.experience[expIndex] };
    const bullets = [...exp.bullets];
    bullets[bulletIndex] = value;
    exp.bullets = bullets;
    updateArrayItem("experience", expIndex, exp);
  }

  function addBullet(expIndex: number) {
    const exp = { ...data.experience[expIndex] };
    exp.bullets = [...exp.bullets, ""];
    updateArrayItem("experience", expIndex, exp);
  }

  function removeBullet(expIndex: number, bulletIndex: number) {
    const exp = { ...data.experience[expIndex] };
    const bullets = [...exp.bullets];
    bullets.splice(bulletIndex, 1);
    exp.bullets = bullets;
    updateArrayItem("experience", expIndex, exp);
  }

  return (
    <div className="space-y-8 p-4">
      {/* ── SECTION ORDER ── */}
      <fieldset className="space-y-2">
        <legend className="text-lg font-semibold">Section Order</legend>
        <p className="text-xs text-muted-foreground">
          Drag sections up or down to reorder them in the preview.
        </p>
        <div className="space-y-1">
          {data.sectionOrder.map((sectionId, i) => (
            <div
              key={sectionId}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 bg-muted/30"
            >
              <GripVertical
                size={14}
                className="text-muted-foreground flex-shrink-0"
              />
              <span className="text-sm flex-1">
                {SECTION_LABELS[sectionId]}
              </span>
              <button
                type="button"
                onClick={() => moveSectionUp(i)}
                disabled={i === 0}
                className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveSectionDown(i)}
                disabled={i === data.sectionOrder.length - 1}
                className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ArrowDown size={14} />
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      {/* ── COLORS ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Colors</legend>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => updateColors(preset.colors)}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs hover:bg-muted transition-colors"
            >
              <span
                className="w-3 h-3 rounded-full border border-border"
                style={{ backgroundColor: preset.colors.accent }}
              />
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom color pickers */}
        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className="text-xs font-medium block mb-1">Headings</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.colors.heading}
                onChange={(e) => updateColors({ heading: e.target.value })}
                className="w-8 h-8 rounded border border-input cursor-pointer"
              />
              <input
                className={`${inputClass} !w-auto flex-1 font-mono text-xs`}
                value={data.colors.heading}
                onChange={(e) => updateColors({ heading: e.target.value })}
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-medium block mb-1">Accent</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.colors.accent}
                onChange={(e) => updateColors({ accent: e.target.value })}
                className="w-8 h-8 rounded border border-input cursor-pointer"
              />
              <input
                className={`${inputClass} !w-auto flex-1 font-mono text-xs`}
                value={data.colors.accent}
                onChange={(e) => updateColors({ accent: e.target.value })}
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-medium block mb-1">Body Text</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.colors.text}
                onChange={(e) => updateColors({ text: e.target.value })}
                className="w-8 h-8 rounded border border-input cursor-pointer"
              />
              <input
                className={`${inputClass} !w-auto flex-1 font-mono text-xs`}
                value={data.colors.text}
                onChange={(e) => updateColors({ text: e.target.value })}
              />
            </div>
          </label>
        </div>
      </fieldset>

      {/* ── PERSONAL INFO ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Personal Info</legend>

        <label className="block">
          <span className="text-sm font-medium">Full Name *</span>
          <input
            className={inputClass}
            value={data.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            placeholder="John Doe"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Job Title</span>
          <input
            className={inputClass}
            value={data.personalInfo.jobTitle}
            onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
            placeholder="Software Engineer"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Email *</span>
          <input
            className={inputClass}
            type="email"
            value={data.personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Phone</span>
          <input
            className={inputClass}
            value={data.personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Location</span>
          <input
            className={inputClass}
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            placeholder="San Francisco, CA"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">LinkedIn</span>
          <input
            className={inputClass}
            value={data.personalInfo.linkedIn}
            onChange={(e) => updatePersonalInfo({ linkedIn: e.target.value })}
            placeholder="linkedin.com/in/yourname"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Website</span>
          <input
            className={inputClass}
            value={data.personalInfo.website}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            placeholder="yoursite.com"
          />
        </label>
      </fieldset>

      {/* ── SUMMARY ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Professional Summary</legend>
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          value={data.summary}
          onChange={(e) => update({ summary: e.target.value })}
          placeholder="Write a brief professional summary..."
          rows={3}
        />
      </fieldset>

      {/* ── EXPERIENCE ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Experience</legend>
        {data.experience.map((exp, i) => (
          <div
            key={i}
            className="space-y-2 rounded-lg border border-border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Experience {i + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive"
                onClick={() => removeArrayItem("experience", i)}
              >
                Remove
              </button>
            </div>

            <input
              className={inputClass}
              value={exp.role}
              onChange={(e) =>
                updateArrayItem("experience", i, { ...exp, role: e.target.value })
              }
              placeholder="Job Title"
            />
            <input
              className={inputClass}
              value={exp.company}
              onChange={(e) =>
                updateArrayItem("experience", i, {
                  ...exp,
                  company: e.target.value,
                })
              }
              placeholder="Company"
            />
            <input
              className={inputClass}
              value={exp.location}
              onChange={(e) =>
                updateArrayItem("experience", i, {
                  ...exp,
                  location: e.target.value,
                })
              }
              placeholder="Location"
            />

            <div className="flex gap-2">
              <input
                className={inputClass}
                value={exp.startDate}
                onChange={(e) =>
                  updateArrayItem("experience", i, {
                    ...exp,
                    startDate: e.target.value,
                  })
                }
                placeholder="Start Date"
              />
              <input
                className={inputClass}
                value={exp.endDate}
                disabled={exp.current}
                onChange={(e) =>
                  updateArrayItem("experience", i, {
                    ...exp,
                    endDate: e.target.value,
                  })
                }
                placeholder="End Date"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) =>
                  updateArrayItem("experience", i, {
                    ...exp,
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : exp.endDate,
                  })
                }
              />
              Currently working here
            </label>

            {/* Bullets */}
            <div className="space-y-1.5 pl-2 border-l-2 border-border">
              <span className="text-xs font-medium text-muted-foreground">
                Key Achievements / Responsibilities
              </span>
              {exp.bullets.map((bullet, j) => (
                <div key={j} className="flex gap-1.5">
                  <input
                    className={inputClass}
                    value={bullet}
                    onChange={(e) => updateBullet(i, j, e.target.value)}
                    placeholder={`Bullet point ${j + 1}`}
                  />
                  <button
                    type="button"
                    className="text-xs text-destructive flex-shrink-0 px-1"
                    onClick={() => removeBullet(i, j)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-xs text-primary underline"
                onClick={() => addBullet(i)}
              >
                + Add bullet
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => addArrayItem("experience", EMPTY_EXPERIENCE)}
        >
          + Add Experience
        </button>
      </fieldset>

      {/* ── EDUCATION ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Education</legend>
        {data.education.map((edu, i) => (
          <div
            key={i}
            className="space-y-2 rounded-lg border border-border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Education {i + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive"
                onClick={() => removeArrayItem("education", i)}
              >
                Remove
              </button>
            </div>

            <input
              className={inputClass}
              value={edu.institution}
              onChange={(e) =>
                updateArrayItem("education", i, {
                  ...edu,
                  institution: e.target.value,
                })
              }
              placeholder="University / School"
            />

            <div className="flex gap-2">
              <input
                className={inputClass}
                value={edu.degree}
                onChange={(e) =>
                  updateArrayItem("education", i, {
                    ...edu,
                    degree: e.target.value,
                  })
                }
                placeholder="Degree (e.g. B.S.)"
              />
              <input
                className={inputClass}
                value={edu.field}
                onChange={(e) =>
                  updateArrayItem("education", i, {
                    ...edu,
                    field: e.target.value,
                  })
                }
                placeholder="Field of Study"
              />
            </div>

            <div className="flex gap-2">
              <input
                className={inputClass}
                value={edu.startDate}
                onChange={(e) =>
                  updateArrayItem("education", i, {
                    ...edu,
                    startDate: e.target.value,
                  })
                }
                placeholder="Start Year"
              />
              <input
                className={inputClass}
                value={edu.endDate}
                onChange={(e) =>
                  updateArrayItem("education", i, {
                    ...edu,
                    endDate: e.target.value,
                  })
                }
                placeholder="End Year"
              />
            </div>

            <input
              className={inputClass}
              value={edu.gpa}
              onChange={(e) =>
                updateArrayItem("education", i, { ...edu, gpa: e.target.value })
              }
              placeholder="GPA (optional)"
            />

            <textarea
              className={`${inputClass} min-h-[48px] resize-y`}
              value={edu.description}
              onChange={(e) =>
                updateArrayItem("education", i, {
                  ...edu,
                  description: e.target.value,
                })
              }
              placeholder="Additional details (optional)"
              rows={2}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => addArrayItem("education", EMPTY_EDUCATION)}
        >
          + Add Education
        </button>
      </fieldset>

      {/* ── SKILLS ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Skills</legend>
        {data.skillGroups.map((group, i) => (
          <div
            key={i}
            className="space-y-2 rounded-lg border border-border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Group {i + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive"
                onClick={() => removeArrayItem("skillGroups", i)}
              >
                Remove
              </button>
            </div>

            <input
              className={inputClass}
              value={group.category}
              onChange={(e) =>
                updateArrayItem("skillGroups", i, {
                  ...group,
                  category: e.target.value,
                })
              }
              placeholder="Category (e.g. Languages, Frameworks)"
            />

            <input
              className={inputClass}
              value={group.skills.join(", ")}
              onChange={(e) =>
                updateArrayItem("skillGroups", i, {
                  ...group,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              placeholder="Skills (comma separated)"
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => addArrayItem("skillGroups", EMPTY_SKILL_GROUP)}
        >
          + Add Skill Group
        </button>
      </fieldset>

      {/* ── CERTIFICATIONS ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Certifications</legend>
        {data.certifications.map((cert, i) => (
          <div
            key={i}
            className="space-y-2 rounded-lg border border-border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Certification {i + 1}
              </span>
              <button
                type="button"
                className="text-xs text-destructive"
                onClick={() => removeArrayItem("certifications", i)}
              >
                Remove
              </button>
            </div>

            <input
              className={inputClass}
              value={cert.title}
              onChange={(e) =>
                updateArrayItem("certifications", i, {
                  ...cert,
                  title: e.target.value,
                })
              }
              placeholder="Certification Title"
            />
            <input
              className={inputClass}
              value={cert.issuer}
              onChange={(e) =>
                updateArrayItem("certifications", i, {
                  ...cert,
                  issuer: e.target.value,
                })
              }
              placeholder="Issuing Organization"
            />
            <input
              className={inputClass}
              value={cert.date}
              onChange={(e) =>
                updateArrayItem("certifications", i, {
                  ...cert,
                  date: e.target.value,
                })
              }
              placeholder="Date (e.g. 2023)"
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => addArrayItem("certifications", EMPTY_CERTIFICATION)}
        >
          + Add Certification
        </button>
      </fieldset>

      {/* ── LANGUAGES ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Languages</legend>
        {data.languages.map((lang, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputClass}
              value={lang.language}
              onChange={(e) =>
                updateArrayItem("languages", i, {
                  ...lang,
                  language: e.target.value,
                })
              }
              placeholder="Language"
            />
            <select
              className={inputClass}
              value={lang.proficiency}
              onChange={(e) =>
                updateArrayItem("languages", i, {
                  ...lang,
                  proficiency: e.target.value as CVLanguage["proficiency"],
                })
              }
            >
              {PROFICIENCY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="text-xs text-destructive flex-shrink-0"
              onClick={() => removeArrayItem("languages", i)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => addArrayItem("languages", EMPTY_LANGUAGE)}
        >
          + Add Language
        </button>
      </fieldset>
    </div>
  );
}
