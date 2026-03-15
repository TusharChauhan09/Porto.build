import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio1.module.css";

const SOCIAL_ICONS: Record<string, string> = {
  github: "GITHUB",
  linkedin: "LINKEDIN",
  twitter: "X_COM",
  website: "WEBSITE",
  email: "EMAIL",
  youtube: "YOUTUBE",
  dribbble: "DRIBBBLE",
  behance: "BEHANCE",
  instagram: "INSTAGRAM",
};

const PROJECT_ICONS = ["terminal", "monitoring", "layers", "data_object", "code", "hub"];

export default function Portfolio1(props: PortfolioProps) {
  const {
    name,
    title,
    bio,
    image,
    location,
    resumeUrl,
    socials,
    skills,
    projects,
    certifications,
    education,
    experience,
  } = props;

  const displayName = name.toUpperCase().replace(/\s+/g, "_");
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.wrapper}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div className={styles.layout}>
        {/* Sticky Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>V3</div>
          <nav className={styles.sidebarNav}>
            <a className={styles.sidebarLink} href="#hero">
              <span className="material-symbols-outlined">grid_view</span>
            </a>
            <a className={styles.sidebarLink} href="#skills">
              <span className="material-symbols-outlined">terminal</span>
            </a>
            <a className={styles.sidebarLink} href="#projects">
              <span className="material-symbols-outlined">layers</span>
            </a>
            <a className={styles.sidebarLink} href="#contact">
              <span className="material-symbols-outlined">description</span>
            </a>
          </nav>
          <div className={styles.sidebarMeta}>SYSTEM_STABLE // {currentYear}</div>
        </aside>

        <main className={styles.main}>
          {/* HERO SECTION */}
          <section id="hero" className={styles.hero}>
            <div className={styles.heroImage}>
              <img src={image} alt={name} className={styles.heroImg} />
            </div>
            <div className={styles.heroContent}>
              <span className={styles.heroLabel}>// ARCHITECT_ID</span>
              <h1 className={styles.heroName}>{displayName}</h1>
              <div className={styles.heroTags}>
                <span className={styles.heroTagPrimary}>{title}</span>
                {location && <span className={styles.heroTagOutline}>{location}</span>}
              </div>
            </div>
          </section>

          <div className={styles.grid}>
            {/* ABOUT / BIO */}
            <section className={styles.aboutSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>01</span>
                <h2 className={styles.sectionTitle}>About_Me</h2>
              </div>
              <p className={styles.aboutText}>{bio}</p>
              {experience && experience.length > 0 && (
                <div className={styles.aboutMeta}>
                  <div className={styles.aboutMetaItem}>
                    <span className={styles.aboutMetaLabel}>Current_Role</span>
                    <span className={styles.aboutMetaValue}>
                      {experience[0].role} @ {experience[0].company}
                    </span>
                  </div>
                  {skills.length > 0 && skills[0].category && (
                    <div className={styles.aboutMetaItem}>
                      <span className={styles.aboutMetaLabel}>Focus_Area</span>
                      <span className={styles.aboutMetaValue}>{skills[0].category}</span>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* SKILLS */}
            <section id="skills" className={styles.skillsSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>02</span>
                <h2 className={styles.sectionTitle}>Skills_Stack</h2>
              </div>
              <ul className={styles.skillsList}>
                {skills.map((skill) => (
                  <li key={skill.name} className={styles.skillItem}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillPercent}>
                      [{skill.percentage ?? 80}%]
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* EXPERIENCE */}
            {experience && experience.length > 0 && (
              <section className={styles.experienceSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNum}>03</span>
                  <h2 className={styles.sectionTitle}>Experience</h2>
                </div>
                <div className={styles.experienceList}>
                  {experience.map((exp, i) => (
                    <div
                      key={`${exp.company}-${exp.role}`}
                      className={`${styles.experienceItem} ${i === 0 ? styles.experienceItemActive : ""}`}
                    >
                      <p className={styles.experienceDate}>
                        {exp.startDate} — {exp.current ? "PRESENT" : (exp.endDate ?? "").toUpperCase()}
                      </p>
                      <h3 className={styles.experienceRole}>{exp.role}</h3>
                      <p className={styles.experienceCompany}>{exp.company}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PROJECTS */}
            <section id="projects" className={styles.projectsSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>04</span>
                <h2 className={styles.sectionTitle}>Selected_Works</h2>
              </div>
              <div className={styles.projectsGrid}>
                {projects.map((project, i) => (
                  <a
                    key={project.title}
                    href={project.liveUrl || project.repoUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectCard}
                  >
                    <div className={styles.projectCardTop}>
                      <span className="material-symbols-outlined" style={{ color: "var(--p1-primary)", fontSize: "1.875rem" }}>
                        {PROJECT_ICONS[i % PROJECT_ICONS.length]}
                      </span>
                      <span className={`material-symbols-outlined ${styles.projectArrow}`}>north_east</span>
                    </div>
                    <h3 className={styles.projectTitle}>
                      {project.title.toUpperCase().replace(/\s+/g, "_")}
                    </h3>
                    <p className={styles.projectDesc}>{project.description}</p>
                    {project.tags.length > 0 && (
                      <div className={styles.projectTags}>
                        {project.tags.map((tag) => (
                          <span key={tag} className={styles.projectTag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </section>

            {/* CERTIFICATIONS */}
            {certifications.length > 0 && (
              <section className={styles.certsSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNum}>05</span>
                  <h2 className={styles.sectionTitle}>Accreditation</h2>
                </div>
                <div className={styles.certsList}>
                  {certifications.map((cert, i) => (
                    <div
                      key={cert.title}
                      className={`${styles.certItem} ${i < certifications.length - 1 ? styles.certItemBorder : ""}`}
                    >
                      <span className="material-symbols-outlined" style={{ color: "var(--p1-primary)" }}>verified</span>
                      <div>
                        <p className={styles.certTitle}>{cert.title}</p>
                        <p className={styles.certMeta}>
                          {cert.issuer} {cert.date ? `// ${cert.date}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EDUCATION — full-width accent bar */}
            {education.length > 0 && (
              <section id="contact" className={styles.educationSection}>
                <div className={styles.educationInner}>
                  <div>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionNumLight}>06</span>
                      <h2 className={styles.sectionTitleWhite}>Academic_Qualifications</h2>
                    </div>
                    <div className={styles.educationList}>
                      {education.map((edu, i) => (
                        <div key={`${edu.institution}-${edu.degree}`} className={styles.educationItem}>
                          {i > 0 && <div className={styles.educationDivider} />}
                          <div>
                            <h3 className={styles.educationDegree}>
                              {edu.degree} {edu.field}
                            </h3>
                            <p className={styles.educationMeta}>
                              {edu.institution} / {edu.startDate} - {edu.endDate ?? "Present"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.educationActions}>
                    {resumeUrl && (
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.btnDark}>
                        Download_Resume
                        <span className="material-symbols-outlined">download</span>
                      </a>
                    )}
                    {socials.find((s) => s.platform === "email") && (
                      <a href={socials.find((s) => s.platform === "email")!.url} className={styles.btnOutline}>
                        Initial_Contact
                        <span className="material-symbols-outlined">send</span>
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* FOOTER */}
          <footer className={styles.footer}>
            <div className={styles.footerCopy}>
              (C) {currentYear} {displayName} // ALL_RIGHTS_RESERVED
            </div>
            <div className={styles.footerLinks}>
              {socials.map((s) => (
                <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                  {SOCIAL_ICONS[s.platform] ?? s.platform.toUpperCase()}
                </a>
              ))}
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className={styles.mobileNav}>
        <a className={styles.mobileNavLinkActive} href="#hero">
          <span className="material-symbols-outlined">home</span>
        </a>
        <a className={styles.mobileNavLink} href="#skills">
          <span className="material-symbols-outlined">account_circle</span>
        </a>
        <a className={styles.mobileNavLink} href="#projects">
          <span className="material-symbols-outlined">database</span>
        </a>
        <a className={styles.mobileNavLink} href="#contact">
          <span className="material-symbols-outlined">mail</span>
        </a>
      </div>
    </div>
  );
}
