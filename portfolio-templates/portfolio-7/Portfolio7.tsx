import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio7.module.css";

const SOCIAL_LABELS: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  website: "Website",
  email: "Email",
  youtube: "YouTube",
  dribbble: "Dribbble",
  behance: "Behance",
  instagram: "Instagram",
};

export default function Portfolio7(props: PortfolioProps) {
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
    resumeUrl,
  } = props;

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
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerBrand}>
            <div className={styles.headerIcon}>&#9608;</div>
            <span className={styles.headerBrandText}>
              System_<span className={styles.headerBrandAccent}>Admin</span>
            </span>
          </div>
          <nav className={styles.headerNav}>
            <a href="#about" className={styles.headerLink}>About</a>
            <a href="#capabilities" className={styles.headerLink}>Capabilities</a>
            <a href="#experience" className={styles.headerLink}>Log</a>
            <a href="#projects" className={styles.headerLink}>Archive</a>
          </nav>
          <div className={styles.headerStatus}>
            <div className={styles.statusDot} />
            <span className={styles.statusText}>Uplink Stable</span>
          </div>
        </div>
      </header>

      {/* Main — 2-column dashboard */}
      <main className={styles.main}>
        {/* Left Column — Sticky Sidebar */}
        <aside className={styles.sidebar}>
          <section id="about" className={styles.sidebarSection}>
            {/* Profile Image */}
            <div className={styles.profileFrame}>
              <img src={image} alt={name} className={styles.profileImg} />
              <div className={styles.scanline} />
            </div>

            {/* Identity */}
            <div className={styles.identity}>
              <h1 className={styles.identityName}>
                {name.split(" ").slice(0, 1).join(" ")}{" "}
                <span className={styles.identityAccent}>
                  {name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <p className={styles.identityTitle}>{title}</p>
              <p className={styles.identityBio}>{bio}</p>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                >
                  Download_CV
                </a>
              )}
            </div>

            {/* Education — in sidebar */}
            {education.length > 0 && (
              <div className={styles.sidebarEdu}>
                <h2 className={styles.labelHeading}>
                  <span className={styles.labelBar} /> Core Education
                </h2>
                <div className={styles.eduList}>
                  {education.map((edu, i) => (
                    <div
                      key={`${edu.institution}-${edu.degree}`}
                      className={styles.eduItem}
                    >
                      <div
                        className={`${styles.eduIcon} ${i === 0 ? styles.eduIconActive : ""}`}
                      >
                        &#127891;
                      </div>
                      <div>
                        <h4 className={styles.eduDegree}>
                          {edu.degree} {edu.field}
                        </h4>
                        <p className={styles.eduMeta}>
                          {edu.institution}
                          {edu.startDate
                            ? ` \u2022 ${edu.startDate} - ${edu.endDate ?? "Present"}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </aside>

        {/* Right Column — Scrolling Content */}
        <div className={styles.content}>
          {/* Skills / Capabilities */}
          <section id="capabilities" className={styles.section}>
            <h2 className={styles.labelHeading}>
              <span className={styles.labelBar} /> Capabilities
            </h2>
            <div className={styles.skillsGrid}>
              {Object.entries(skillsByCategory).map(
                ([category, categorySkills]) => (
                  <div key={category} className={styles.glassCard}>
                    <h3 className={styles.skillCategoryTitle}>{category}</h3>
                    <div className={styles.skillPills}>
                      {categorySkills.map((s) => (
                        <span key={s.name} className={styles.skillPill}>
                          {s.name.toUpperCase().replace(/\s+/g, "_")}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Projects / Deployment Archive */}
          <section id="projects" className={styles.section}>
            <h2 className={styles.labelHeading}>
              <span className={styles.labelBar} /> Deployment Archive
            </h2>
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <a
                  key={project.title}
                  href={project.liveUrl || project.repoUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectCard}
                >
                  {project.image ? (
                    <div className={styles.projectImgWrap}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className={styles.projectImg}
                      />
                      <div className={styles.projectOverlay}>
                        <h4 className={styles.projectOverlayTitle}>
                          {project.title.replace(/\s+/g, "_")}
                        </h4>
                        <p className={styles.projectOverlayDesc}>
                          {project.description}
                        </p>
                        {project.tags.length > 0 && (
                          <div className={styles.projectOverlayTags}>
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className={styles.projectOverlayTag}
                              >
                                {tag.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.projectNoImg}>
                      <h4 className={styles.projectOverlayTitle}>
                        {project.title.replace(/\s+/g, "_")}
                      </h4>
                      <p className={styles.projectOverlayDesc}>
                        {project.description}
                      </p>
                      {project.tags.length > 0 && (
                        <div className={styles.projectOverlayTags}>
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className={styles.projectOverlayTag}
                            >
                              {tag.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>

          {/* Experience / Career Log */}
          {experience && experience.length > 0 && (
            <section id="experience" className={styles.section}>
              <h2 className={styles.labelHeading}>
                <span className={styles.labelBar} /> Career Log
              </h2>
              <div className={styles.timeline}>
                {experience.map((exp, i) => (
                  <div
                    key={`${exp.company}-${exp.role}`}
                    className={styles.timelineItem}
                  >
                    <div
                      className={`${styles.timelineDot} ${i === 0 ? styles.timelineDotActive : ""}`}
                    />
                    <div className={styles.timelineRow}>
                      <div className={styles.timelineDate}>
                        <span
                          className={
                            i === 0
                              ? styles.timelineDateActive
                              : styles.timelineDateMuted
                          }
                        >
                          {exp.current ? "Present" : exp.endDate} —{" "}
                          {exp.startDate}
                        </span>
                      </div>
                      <div className={styles.timelineBody}>
                        <h3 className={styles.timelineRole}>{exp.role}</h3>
                        <p className={styles.timelineCompany}>
                          {exp.company}
                        </p>
                        {exp.description && (
                          <p className={styles.timelineDesc}>
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications / Node Validation */}
          {certifications.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.labelHeading}>
                <span className={styles.labelBar} /> Node Validation
              </h2>
              <div className={styles.certGrid}>
                {certifications.map((cert) => (
                  <div key={cert.title} className={styles.certCard}>
                    <div className={styles.certIcon}>&#10003;</div>
                    <div>
                      <p className={styles.certIssuer}>
                        {cert.issuer.toUpperCase()}
                      </p>
                      <p className={styles.certTitle}>{cert.title}</p>
                      {cert.date && (
                        <p className={styles.certDate}>{cert.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLeft}>
            <div className={styles.footerDot} />
            <span className={styles.footerCopy}>
              &copy; {currentYear} {name}_Protocol
            </span>
          </div>
          <div className={styles.footerLinks}>
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                {SOCIAL_LABELS[s.platform] ?? s.platform}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <div className={styles.mobileNav}>
        <div className={styles.mobileNavPill}>
          <a href="#" className={styles.mobileNavActive}>&#8962;</a>
          <a href="#about" className={styles.mobileNavLink}>&#9786;</a>
          <a href="#projects" className={styles.mobileNavLink}>&#9733;</a>
          <a href="#contact" className={styles.mobileNavLink}>&#9993;</a>
        </div>
      </div>
    </div>
  );
}
