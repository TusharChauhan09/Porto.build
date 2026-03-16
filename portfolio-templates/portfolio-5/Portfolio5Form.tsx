"use client";

import { useState } from "react";
import type {
  PortfolioProps,
  SocialLink,
  Skill,
  Project,
  Certification,
  Education,
  Experience,
} from "../PortfolioTypes";

interface Portfolio5FormProps {
  initialData?: Partial<PortfolioProps>;
  onChange: (data: PortfolioProps) => void;
}

const EMPTY_SOCIAL: SocialLink = { platform: "github", url: "" };
const EMPTY_SKILL: Skill = { name: "", level: "intermediate", percentage: 80, category: "" };
const EMPTY_PROJECT: Project = { title: "", description: "", tags: [], liveUrl: "", repoUrl: "", image: "" };
const EMPTY_CERT: Certification = { title: "", issuer: "", date: "", url: "", image: "" };
const EMPTY_EDU: Education = { institution: "", degree: "", field: "", startDate: "", endDate: "" };
const EMPTY_EXP: Experience = { company: "", role: "", startDate: "", endDate: "", description: "", current: false };

const SOCIAL_PLATFORMS: SocialLink["platform"][] = [
  "github", "linkedin", "twitter", "website", "email", "youtube", "dribbble", "behance", "instagram",
];
const SKILL_LEVELS: Skill["level"][] = ["beginner", "intermediate", "advanced", "expert"];

const defaultData: PortfolioProps = {
  name: "",
  title: "",
  bio: "",
  image: "",
  location: "",
  resumeUrl: "",
  socials: [{ ...EMPTY_SOCIAL }],
  skills: [{ ...EMPTY_SKILL }],
  projects: [{ ...EMPTY_PROJECT }],
  certifications: [{ ...EMPTY_CERT }],
  education: [{ ...EMPTY_EDU }],
  experience: [{ ...EMPTY_EXP }],
};

export default function Portfolio5Form({ initialData, onChange }: Portfolio5FormProps) {
  const [data, setData] = useState<PortfolioProps>({ ...defaultData, ...initialData });

  function update(patch: Partial<PortfolioProps>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next);
  }

  function updateArray<T>(key: keyof PortfolioProps, index: number, value: T) {
    const arr = [...(data[key] as T[])];
    arr[index] = value;
    update({ [key]: arr });
  }

  function addItem<T>(key: keyof PortfolioProps, empty: T) {
    const arr = [...(data[key] as T[]), { ...empty }];
    update({ [key]: arr });
  }

  function removeItem<T>(key: keyof PortfolioProps, index: number) {
    const arr = [...(data[key] as T[])];
    arr.splice(index, 1);
    update({ [key]: arr });
  }

  return (
    <div className="space-y-8 p-4">
      {/* ── PERSONAL INFO ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Personal Info</legend>

        <label className="block">
          <span className="text-sm font-medium">Full Name *</span>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            placeholder="Alex Rivera"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Title / Role *</span>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            placeholder="Senior Creative Technologist"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Bio *</span>
          <textarea
            value={data.bio}
            onChange={(e) => update({ bio: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            placeholder="A short bio about yourself..."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Profile Image URL *</span>
          <input
            type="text"
            value={data.image}
            onChange={(e) => update({ image: e.target.value })}
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            placeholder="https://example.com/photo.jpg"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Location</span>
          <input
            type="text"
            value={data.location ?? ""}
            onChange={(e) => update({ location: e.target.value })}
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            placeholder="New York, NY"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Resume URL</span>
          <input
            type="text"
            value={data.resumeUrl ?? ""}
            onChange={(e) => update({ resumeUrl: e.target.value })}
            className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            placeholder="https://example.com/resume.pdf"
          />
        </label>
      </fieldset>

      {/* ── SOCIALS ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Social Links</legend>
        {data.socials.map((social, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={social.platform}
              onChange={(e) =>
                updateArray<SocialLink>("socials", i, { ...social, platform: e.target.value as SocialLink["platform"] })
              }
              className="rounded border border-input bg-background px-2 py-2 text-sm flex-shrink-0"
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="text"
              value={social.url}
              onChange={(e) => updateArray<SocialLink>("socials", i, { ...social, url: e.target.value })}
              className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://..."
            />
            <button type="button" onClick={() => removeItem("socials", i)} className="text-destructive text-sm px-2 flex-shrink-0">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("socials", EMPTY_SOCIAL)} className="text-sm text-primary underline">
          + Add Social
        </button>
      </fieldset>

      {/* ── SKILLS ── */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold">Skills</legend>
        <p className="text-xs text-muted-foreground">Group skills by category — each category becomes a grid card in the template.</p>
        {data.skills.map((skill, i) => (
          <div key={i} className="space-y-2 rounded border border-input p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateArray<Skill>("skills", i, { ...skill, name: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="React, Three.js..."
              />
              <input
                type="text"
                value={skill.category ?? ""}
                onChange={(e) => updateArray<Skill>("skills", i, { ...skill, category: e.target.value })}
                className="w-36 flex-shrink-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Category (e.g. Frontend)"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={skill.level ?? "intermediate"}
                onChange={(e) =>
                  updateArray<Skill>("skills", i, { ...skill, level: e.target.value as Skill["level"] })
                }
                className="flex-shrink-0 rounded border border-input bg-background px-2 py-2 text-sm"
              >
                {SKILL_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                max={100}
                value={skill.percentage ?? 80}
                onChange={(e) => updateArray<Skill>("skills", i, { ...skill, percentage: Number(e.target.value) })}
                className="w-20 flex-shrink-0 rounded border border-input bg-background px-2 py-2 text-sm"
                placeholder="%"
              />
              <button type="button" onClick={() => removeItem("skills", i)} className="ml-auto flex-shrink-0 text-destructive text-sm px-2">
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addItem("skills", EMPTY_SKILL)} className="text-sm text-primary underline">
          + Add Skill
        </button>
      </fieldset>

      {/* ── PROJECTS ── */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Projects</legend>
        <p className="text-xs text-muted-foreground">Project images are displayed with a grayscale-to-color hover effect. Experience descriptions support newline-separated bullet points.</p>
        {data.projects.map((proj, i) => (
          <div key={i} className="space-y-2 rounded border border-input p-3">
            <input
              type="text"
              value={proj.title}
              onChange={(e) => updateArray<Project>("projects", i, { ...proj, title: e.target.value })}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="Project Title"
            />
            <textarea
              value={proj.description}
              onChange={(e) => updateArray<Project>("projects", i, { ...proj, description: e.target.value })}
              rows={2}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="Project description..."
            />
            <input
              type="text"
              value={proj.tags.join(", ")}
              onChange={(e) =>
                updateArray<Project>("projects", i, {
                  ...proj,
                  tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="Tags (comma separated): React, D3.js, Web3..."
            />
            <input
              type="text"
              value={proj.image ?? ""}
              onChange={(e) => updateArray<Project>("projects", i, { ...proj, image: e.target.value })}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="Project Image URL (recommended)"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={proj.liveUrl ?? ""}
                onChange={(e) => updateArray<Project>("projects", i, { ...proj, liveUrl: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Live URL"
              />
              <input
                type="text"
                value={proj.repoUrl ?? ""}
                onChange={(e) => updateArray<Project>("projects", i, { ...proj, repoUrl: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Repo URL"
              />
            </div>
            <button type="button" onClick={() => removeItem("projects", i)} className="text-destructive text-sm">
              Remove Project
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("projects", EMPTY_PROJECT)} className="text-sm text-primary underline">
          + Add Project
        </button>
      </fieldset>

      {/* ── EXPERIENCE ── */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Experience</legend>
        <p className="text-xs text-muted-foreground">Use newlines in the description for bullet-point items (shown with / prefix).</p>
        {(data.experience ?? []).map((exp, i) => (
          <div key={i} className="space-y-2 rounded border border-input p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateArray<Experience>("experience", i, { ...exp, company: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Company"
              />
              <input
                type="text"
                value={exp.role}
                onChange={(e) => updateArray<Experience>("experience", i, { ...exp, role: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Role"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => updateArray<Experience>("experience", i, { ...exp, startDate: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Start Date (e.g. 2021)"
              />
              <input
                type="text"
                value={exp.endDate ?? ""}
                onChange={(e) => updateArray<Experience>("experience", i, { ...exp, endDate: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="End Date"
                disabled={exp.current}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={exp.current ?? false}
                onChange={(e) => updateArray<Experience>("experience", i, { ...exp, current: e.target.checked })}
              />
              Currently working here
            </label>
            <textarea
              value={exp.description}
              onChange={(e) => updateArray<Experience>("experience", i, { ...exp, description: e.target.value })}
              rows={3}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="One bullet per line:&#10;Scaling design systems&#10;Mentoring junior developers"
            />
            <button type="button" onClick={() => removeItem("experience", i)} className="text-destructive text-sm">
              Remove Experience
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("experience", EMPTY_EXP)} className="text-sm text-primary underline">
          + Add Experience
        </button>
      </fieldset>

      {/* ── EDUCATION ── */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Education</legend>
        {data.education.map((edu, i) => (
          <div key={i} className="space-y-2 rounded border border-input p-3">
            <input
              type="text"
              value={edu.institution}
              onChange={(e) => updateArray<Education>("education", i, { ...edu, institution: e.target.value })}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="Institution"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateArray<Education>("education", i, { ...edu, degree: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Degree (e.g. M.Sc.)"
              />
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateArray<Education>("education", i, { ...edu, field: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Field of Study"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={edu.startDate}
                onChange={(e) => updateArray<Education>("education", i, { ...edu, startDate: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Start Date"
              />
              <input
                type="text"
                value={edu.endDate ?? ""}
                onChange={(e) => updateArray<Education>("education", i, { ...edu, endDate: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="End Date"
              />
            </div>
            <textarea
              value={edu.description ?? ""}
              onChange={(e) => updateArray<Education>("education", i, { ...edu, description: e.target.value })}
              rows={2}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="Description (optional)"
            />
            <button type="button" onClick={() => removeItem("education", i)} className="text-destructive text-sm">
              Remove Education
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("education", EMPTY_EDU)} className="text-sm text-primary underline">
          + Add Education
        </button>
      </fieldset>

      {/* ── CERTIFICATIONS ── */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold">Certifications</legend>
        {data.certifications.map((cert, i) => (
          <div key={i} className="space-y-2 rounded border border-input p-3">
            <input
              type="text"
              value={cert.title}
              onChange={(e) => updateArray<Certification>("certifications", i, { ...cert, title: e.target.value })}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              placeholder="Certification Title"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateArray<Certification>("certifications", i, { ...cert, issuer: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Issuing Organization"
              />
              <input
                type="text"
                value={cert.date}
                onChange={(e) => updateArray<Certification>("certifications", i, { ...cert, date: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Date Issued"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={cert.url ?? ""}
                onChange={(e) => updateArray<Certification>("certifications", i, { ...cert, url: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Certificate URL"
              />
              <input
                type="text"
                value={cert.image ?? ""}
                onChange={(e) => updateArray<Certification>("certifications", i, { ...cert, image: e.target.value })}
                className="flex-1 min-w-0 rounded border border-input bg-background px-3 py-2 text-sm"
                placeholder="Certificate Image URL"
              />
            </div>
            <button type="button" onClick={() => removeItem("certifications", i)} className="text-destructive text-sm">
              Remove Certification
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem("certifications", EMPTY_CERT)} className="text-sm text-primary underline">
          + Add Certification
        </button>
      </fieldset>
    </div>
  );
}
