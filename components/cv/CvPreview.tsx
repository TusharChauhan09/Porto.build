import type { CVData, CVSectionId } from "@/lib/cv-types";
import styles from "./CvPreview.module.css";

interface CvPreviewProps {
  data: CVData;
}

const SECTION_LABELS: Record<CVSectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skillGroups: "Skills",
  certifications: "Certifications",
  languages: "Languages",
};

export default function CvPreview({ data }: CvPreviewProps) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skillGroups,
    certifications,
    languages,
    sectionOrder,
    colors,
  } = data;

  const contactItems: string[] = [];
  if (personalInfo.email) contactItems.push(personalInfo.email);
  if (personalInfo.phone) contactItems.push(personalInfo.phone);
  if (personalInfo.location) contactItems.push(personalInfo.location);
  if (personalInfo.linkedIn) contactItems.push(personalInfo.linkedIn);
  if (personalInfo.website) contactItems.push(personalInfo.website);

  const colorVars = {
    "--cv-heading": colors.heading,
    "--cv-accent": colors.accent,
    "--cv-text-secondary": colors.text,
  } as React.CSSProperties;

  function renderSection(id: CVSectionId) {
    switch (id) {
      case "summary":
        if (!summary) return null;
        return (
          <section key={id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{SECTION_LABELS[id]}</h2>
            <p className={styles.summary}>{summary}</p>
          </section>
        );

      case "experience":
        if (experience.length === 0) return null;
        return (
          <section key={id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{SECTION_LABELS[id]}</h2>
            {experience.map((exp, i) => (
              <div key={i} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <h3 className={styles.entryTitle}>{exp.role}</h3>
                  <span className={styles.entryDate}>
                    {exp.startDate}
                    {(exp.endDate || exp.current) &&
                      ` — ${exp.current ? "Present" : exp.endDate}`}
                  </span>
                </div>
                <p className={styles.entrySubtitle}>
                  {exp.company}
                  {exp.location && ` · ${exp.location}`}
                </p>
                {exp.bullets.length > 0 && (
                  <ul className={styles.bulletList}>
                    {exp.bullets
                      .filter((b) => b.trim())
                      .map((bullet, j) => (
                        <li key={j} className={styles.bulletItem}>
                          {bullet}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      case "education":
        if (education.length === 0) return null;
        return (
          <section key={id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{SECTION_LABELS[id]}</h2>
            {education.map((edu, i) => (
              <div key={i} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <h3 className={styles.entryTitle}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <span className={styles.entryDate}>
                    {edu.startDate}
                    {edu.endDate && ` — ${edu.endDate}`}
                  </span>
                </div>
                <p className={styles.entrySubtitle}>
                  {edu.institution}
                  {edu.gpa && (
                    <span className={styles.gpa}> · GPA: {edu.gpa}</span>
                  )}
                </p>
                {edu.description && (
                  <p className={styles.eduDetails}>{edu.description}</p>
                )}
              </div>
            ))}
          </section>
        );

      case "skillGroups":
        if (skillGroups.length === 0) return null;
        return (
          <section key={id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{SECTION_LABELS[id]}</h2>
            <div className={styles.skillsGrid}>
              {skillGroups.map((group, i) => (
                <div key={i} className={styles.skillGroup}>
                  <span className={styles.skillCategory}>
                    {group.category}
                  </span>
                  <span className={styles.skillList}>
                    {group.skills.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case "certifications":
        if (certifications.length === 0) return null;
        return (
          <section key={id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{SECTION_LABELS[id]}</h2>
            {certifications.map((cert, i) => (
              <div key={i} className={styles.certEntry}>
                <span className={styles.certTitle}>
                  {cert.title}
                  {cert.issuer && (
                    <span className={styles.certIssuer}> — {cert.issuer}</span>
                  )}
                </span>
                {cert.date && (
                  <span className={styles.certDate}>{cert.date}</span>
                )}
              </div>
            ))}
          </section>
        );

      case "languages":
        if (languages.length === 0) return null;
        return (
          <section key={id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{SECTION_LABELS[id]}</h2>
            <div className={styles.languagesList}>
              {languages.map((lang, i) => (
                <span key={i} className={styles.languageItem}>
                  {lang.language}
                  {lang.proficiency && (
                    <span className={styles.languageProficiency}>
                      {" "}
                      ({lang.proficiency})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  }

  return (
    <div className={styles.page} style={colorVars} data-cv-print>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.name}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.jobTitle && (
          <p className={styles.jobTitle}>{personalInfo.jobTitle}</p>
        )}
        {contactItems.length > 0 && (
          <div className={styles.contactRow}>
            {contactItems.map((item, i) => (
              <span key={i}>
                <span className={styles.contactItem}>{item}</span>
                {i < contactItems.length - 1 && (
                  <span className={styles.contactSeparator}> </span>
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Sections rendered in user-defined order */}
      {sectionOrder.map((id) => renderSection(id))}
    </div>
  );
}
