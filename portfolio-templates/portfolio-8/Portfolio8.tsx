import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio8.module.css";

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

export default function Portfolio8(props: PortfolioProps) {
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

  // Split name for large hero display
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  // Brand shorthand: initials + year
  const initials =
    nameParts
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "XX";
  const brand = `${initials}/${String(currentYear).slice(-2)}`;

  return (
    <div className={styles.wrapper}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.navBrand}>{brand}</span>
          <div className={styles.navLinks}>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#skills" className={styles.navLink}>Skills</a>
            <a href="#experience" className={styles.navLink}>Experience</a>
            <a href="#projects" className={styles.navLink}>Works</a>
            <a href="#education" className={styles.navLink}>Education</a>
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        {/* Header / Hero */}
        <header className={styles.header}>
          <div className={styles.headerImgWrap}>
            <div className={styles.headerImgFrame}>
              <img src={image} alt={name} className={styles.headerImg} />
            </div>
            <div className={styles.headerBadge}>&#10003;</div>
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.heroName}>
              {firstName.toUpperCase()}
              {lastName && (
                <>
                  <br />
                  {lastName.toUpperCase()}
                </>
              )}
            </h1>
            <p className={styles.heroTitle}>{title}</p>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroBtn}
              >
                Download CV &rarr;
              </a>
            )}
          </div>
        </header>

        {/* About */}
        <section id="about" className={styles.aboutSection}>
          <div className={styles.aboutLabel}>
            <h2 className={styles.aboutHeading}>
              About
              <br />
              Me
            </h2>
          </div>
          <div className={styles.aboutBody}>
            <p className={styles.aboutText}>{bio}</p>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className={styles.section}>
          <h2 className={styles.sectionHeading}>Technical Arsenal</h2>
          <div className={styles.skillsGrid}>
            {skills.map((skill, i) => (
              <span
                key={skill.name}
                className={`${styles.skillPill} ${
                  i % 3 === 0
                    ? styles.skillPillFilled
                    : i % 3 === 1
                      ? styles.skillPillPrimary
                      : styles.skillPillOutline
                }`}
              >
                {skill.name.toUpperCase()}
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section id="experience" className={styles.section}>
            <h2 className={styles.sectionHeading}>Experience</h2>
            <div className={styles.timeline}>
              {experience.map((exp, i) => (
                <div
                  key={`${exp.company}-${exp.role}`}
                  className={styles.timelineItem}
                >
                  <div
                    className={`${styles.timelineDot} ${i === 0 ? styles.timelineDotActive : ""}`}
                  />
                  <div className={styles.timelineHead}>
                    <h3 className={styles.timelineRole}>
                      {exp.role.toUpperCase()}
                    </h3>
                    <span className={styles.timelineDate}>
                      {exp.startDate} —{" "}
                      {exp.current
                        ? "PRESENT"
                        : (exp.endDate ?? "").toUpperCase()}
                    </span>
                  </div>
                  <p className={styles.timelineCompany}>{exp.company}</p>
                  {exp.description && (
                    <p className={styles.timelineDesc}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        <section id="projects" className={styles.section}>
          <div className={styles.projectsHeader}>
            <h2 className={styles.sectionHeading}>Selected Works</h2>
          </div>
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <a
                key={project.title}
                href={project.liveUrl || project.repoUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectCard}
              >
                {project.image && (
                  <div className={styles.projectImgWrap}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles.projectImg}
                    />
                  </div>
                )}
                <h3 className={styles.projectTitle}>
                  {project.title.toUpperCase()}
                </h3>
                <p className={styles.projectDesc}>{project.description}</p>
                {project.tags.length > 0 && (
                  <div className={styles.projectTags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.projectTag}>
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
                <span className={styles.projectCta}>
                  Case Study &rarr;
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Certifications */}
        {certifications.length > 0 && (
          <section id="certificates" className={styles.section}>
            <h2 className={styles.sectionHeading}>Credentials</h2>
            <div className={styles.certGrid}>
              {certifications.map((cert, i) => (
                <div key={cert.title} className={styles.certCard}>
                  <span className={styles.certIcon}>&#10003;</span>
                  <h3 className={styles.certTitle}>
                    {cert.title.toUpperCase()}
                  </h3>
                  <p className={styles.certMeta}>
                    {cert.issuer}
                    {cert.date ? ` \u2022 ${cert.date}` : ""}
                  </p>
                  <div className={styles.certNum}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section id="education" className={styles.eduSection}>
            <h2 className={styles.sectionHeading}>Education</h2>
            <div className={styles.eduGrid}>
              {education.map((edu) => {
                const abbr =
                  edu.degree
                    .replace(/\./g, "")
                    .split(/\s+/)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase() || "ED";
                return (
                  <div
                    key={`${edu.institution}-${edu.degree}`}
                    className={styles.eduItem}
                  >
                    <div className={styles.eduAbbr}>{abbr}</div>
                    <div>
                      <h3 className={styles.eduDegree}>
                        {edu.degree} {edu.field}
                      </h3>
                      <p className={styles.eduInstitution}>{edu.institution}</p>
                      <p className={styles.eduDate}>
                        {edu.startDate} - {edu.endDate ?? "Present"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer id="contact" className={styles.footer}>
          <div className={styles.footerSocials}>
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialLink}
              >
                {SOCIAL_LABELS[s.platform] ?? s.platform}
              </a>
            ))}
          </div>
          <div className={styles.footerRight}>
            <p className={styles.footerCopy}>
              &copy; {currentYear} {name}
            </p>
            <p className={styles.footerTagline}>
              Designed for Impact // Built for Performance
            </p>
          </div>
        </footer>
      </div>

      {/* Mobile Nav */}
      <nav className={styles.mobileNav}>
        <a href="#about" className={styles.mobileNavLink}>&#9786;</a>
        <a href="#skills" className={styles.mobileNavLink}>&#9881;</a>
        <a href="#experience" className={styles.mobileNavLink}>&#9733;</a>
        <a href="#projects" className={styles.mobileNavLink}>&#9744;</a>
        <a href="#education" className={styles.mobileNavLink}>&#127891;</a>
      </nav>
    </div>
  );
}
