import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio2.module.css";

const SOCIAL_LABELS: Record<string, string> = {
  github: "GH",
  linkedin: "LI",
  twitter: "TW",
  website: "WEB",
  email: "EM",
  youtube: "YT",
  dribbble: "DR",
  behance: "BE",
  instagram: "IG",
};

export default function Portfolio2(props: PortfolioProps) {
  const {
    name,
    title,
    bio,
    image,
    socials,
    skills,
    projects,
    certifications,
    education,
    experience,
  } = props;

  const displayName = `<${name.toUpperCase().replace(/\s+/g, "_")} />`;
  const currentYear = new Date().getFullYear();

  // Group skills by category
  const skillsByCategory: Record<string, typeof skills> = {};
  skills.forEach((skill) => {
    const cat = skill.category || "General";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(skill);
  });

  return (
    <div className={styles.wrapper}>
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap"
        rel="stylesheet"
      />

      {/* Scanline overlay */}
      <div className={styles.scanline} />

      <div className={styles.bgGrid}>
        <div className={styles.container}>
          {/* ── Sidebar ── */}
          <aside className={styles.sidebar}>
            <header className={styles.sidebarHeader}>
              {/* Profile image with glow */}
              <div className={styles.profileFrame}>
                <div className={styles.profileImageWrap}>
                  <img
                    src={image}
                    alt={name}
                    className={styles.profileImage}
                  />
                </div>
                <div className={styles.bracketLeft}>[</div>
                <div className={styles.bracketRight}>]</div>
              </div>

              <h1 className={styles.heroName}>{displayName}</h1>
              <p className={styles.heroTitle}>{title.toUpperCase()}</p>
            </header>

            {/* Sidebar nav */}
            <nav className={styles.sidebarNav}>
              <a href="#about" className={styles.navLinkMagenta}>
                01. ABOUT_ME
              </a>
              <a href="#skills" className={styles.navLinkCyan}>
                02. CORE_COMPETENCIES
              </a>
              <a href="#experience" className={styles.navLinkMagenta}>
                03. WORK_HISTORY
              </a>
              <a href="#projects" className={styles.navLinkCyan}>
                04. RECENT_BUILDS
              </a>
              {certifications.length > 0 && (
                <a href="#certificates" className={styles.navLinkMagenta}>
                  05. CREDENTIALS
                </a>
              )}
              {education.length > 0 && (
                <a href="#qualifications" className={styles.navLinkCyan}>
                  06. ACADEMIC_DATA
                </a>
              )}
            </nav>

            {/* Social links */}
            <div className={styles.sidebarSocials}>
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                >
                  {SOCIAL_LABELS[s.platform] ?? s.platform.toUpperCase().slice(0, 2)}
                </a>
              ))}
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className={styles.main}>
            {/* About */}
            <section id="about" className={styles.section}>
              <h2 className={styles.sectionHeadingMagenta}>
                <span className={styles.sectionNum}>01.</span> ABOUT_ME
                <div className={styles.dividerMagenta} />
              </h2>
              <div className={styles.aboutCard}>
                <p className={styles.aboutText}>{bio}</p>
              </div>
            </section>

            {/* Skills */}
            <section id="skills" className={styles.section}>
              <h2 className={styles.sectionHeadingCyan}>
                <span className={styles.sectionNumMagenta}>02.</span>{" "}
                CORE_COMPETENCIES
                <div className={styles.dividerCyan} />
              </h2>
              <div className={styles.skillsGrid}>
                {Object.entries(skillsByCategory).map(
                  ([category, categorySkills], catIdx) => (
                    <div key={category} className={styles.skillGroup}>
                      <h3 className={styles.skillGroupTitle}>
                        <span
                          className={
                            catIdx % 2 === 0
                              ? styles.dotCyan
                              : styles.dotMagenta
                          }
                        />
                        {category.toUpperCase().replace(/\s+/g, "_")}
                      </h3>
                      <div className={styles.skillTags}>
                        {categorySkills.map((skill) => (
                          <span
                            key={skill.name}
                            className={
                              catIdx % 2 === 0
                                ? styles.skillTagCyan
                                : styles.skillTagMagenta
                            }
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section id="experience" className={styles.section}>
                <h2 className={styles.sectionHeadingMagenta}>
                  <span className={styles.sectionNumCyan}>03.</span>{" "}
                  WORK_HISTORY
                  <div className={styles.dividerMagenta} />
                </h2>
                <div className={styles.timeline}>
                  {experience.map((exp, i) => (
                    <div key={`${exp.company}-${exp.role}`} className={styles.timelineItem}>
                      <div
                        className={`${styles.timelineDot} ${
                          i === 0
                            ? styles.timelineDotMagenta
                            : styles.timelineDotGray
                        }`}
                      />
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <h3 className={styles.timelineRole}>
                            {exp.role} @ {exp.company}
                          </h3>
                          <span className={styles.timelineDate}>
                            {exp.startDate} -{" "}
                            {exp.current
                              ? "PRESENT"
                              : exp.endDate?.toUpperCase() ?? ""}
                          </span>
                        </div>
                        {exp.description && (
                          <ul className={styles.timelineDesc}>
                            {exp.description
                              .split("\n")
                              .filter(Boolean)
                              .map((line, j) => (
                                <li key={j} className={styles.timelineDescItem}>
                                  <span
                                    className={
                                      i % 2 === 0
                                        ? styles.bulletMagenta
                                        : styles.bulletCyan
                                    }
                                  >
                                    ‣
                                  </span>{" "}
                                  {line}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            <section id="projects" className={styles.section}>
              <h2 className={styles.sectionHeadingCyan}>
                <span className={styles.sectionNumMagenta}>04.</span>{" "}
                RECENT_BUILDS
                <div className={styles.dividerCyan} />
              </h2>
              <div className={styles.projectsGrid}>
                {projects.map((project, i) => (
                  <div
                    key={project.title}
                    className={`${styles.projectCard} ${
                      i % 2 === 0
                        ? styles.projectCardCyan
                        : styles.projectCardMagenta
                    }`}
                  >
                    <div className={styles.projectTop}>
                      <h3 className={styles.projectTitle}>
                        {project.title.toUpperCase().replace(/\s+/g, "_")}
                      </h3>
                      {(project.repoUrl || project.liveUrl) && (
                        <a
                          href={project.repoUrl || project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            i % 2 === 0
                              ? styles.projectLinkMagenta
                              : styles.projectLinkCyan
                          }
                        >
                          SOURCE //
                        </a>
                      )}
                    </div>
                    <p className={styles.projectDesc}>{project.description}</p>
                    {project.tags.length > 0 && (
                      <div className={styles.projectTags}>
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={
                              i % 2 === 0
                                ? styles.projectTagCyan
                                : styles.projectTagMagenta
                            }
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            {certifications.length > 0 && (
              <section id="certificates" className={styles.section}>
                <h2 className={styles.sectionHeadingMagenta}>
                  <span className={styles.sectionNumCyan}>05.</span> CREDENTIALS
                  <div className={styles.dividerMagenta} />
                </h2>
                <div className={styles.certsGrid}>
                  {certifications.map((cert, i) => (
                    <div
                      key={cert.title}
                      className={`${styles.certCard} ${
                        i % 2 === 0
                          ? styles.certCardMagenta
                          : styles.certCardCyan
                      }`}
                    >
                      <div
                        className={
                          i % 2 === 0
                            ? styles.certIssuerMagenta
                            : styles.certIssuerCyan
                        }
                      >
                        {cert.issuer.toUpperCase()}
                      </div>
                      <div className={styles.certTitle}>{cert.title}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section id="qualifications" className={styles.section}>
                <h2 className={styles.sectionHeadingCyan}>
                  <span className={styles.sectionNumMagenta}>06.</span>{" "}
                  ACADEMIC_DATA
                  <div className={styles.dividerCyan} />
                </h2>
                <div className={styles.eduList}>
                  {education.map((edu) => (
                    <div
                      key={`${edu.institution}-${edu.degree}`}
                      className={styles.eduItem}
                    >
                      <div>
                        <h3 className={styles.eduDegree}>
                          {edu.degree} {edu.field}
                        </h3>
                        <p className={styles.eduInstitution}>
                          {edu.institution}
                        </p>
                      </div>
                      <div className={styles.eduRight}>
                        <p className={styles.eduDate}>
                          {edu.startDate} - {edu.endDate ?? "Present"}
                        </p>
                        {edu.description && (
                          <p className={styles.eduDesc}>{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className={styles.footer}>
              <p className={styles.footerText}>
                &copy; {currentYear}{" "}
                <span className={styles.footerHighlight}>
                  {name.toUpperCase().replace(/\s+/g, "_")}
                </span>{" "}
                | ENCRYPTED CONNECTION
              </p>
              {/* Mobile social links */}
              <div className={styles.footerSocials}>
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerSocialLink}
                  >
                    {SOCIAL_LABELS[s.platform] ?? s.platform.toUpperCase().slice(0, 2)}
                  </a>
                ))}
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
