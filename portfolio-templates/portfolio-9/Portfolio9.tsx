import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio9.module.css";

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

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Foundation",
  intermediate: "Proficient",
  advanced: "Advanced",
  expert: "Mastery",
};

export default function Portfolio9(props: PortfolioProps) {
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

  // Brand: initials with dot separator, serif italic style
  const nameParts = name.trim().split(/\s+/);
  const initials =
    nameParts
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "XX";
  const brand = `${initials}.`;

  return (
    <div className={styles.wrapper}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.navBrand}>{brand}</span>
          <nav className={styles.navLinks}>
            <a href="#projects" className={styles.navLinkActive}>
              Portfolio
            </a>
            <a href="#about" className={styles.navLink}>
              Profile
            </a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroImgCol}>
            <div className={styles.heroImgGlow} />
            <div className={styles.heroImgRing}>
              <img src={image} alt={name} className={styles.heroImg} />
            </div>
          </div>
          <div className={styles.heroTextCol}>
            <p className={styles.heroTitle}>{title}</p>
            <h1 className={styles.heroName}>{name}</h1>
            <div className={styles.heroDivider} />
            {/* About integrated into hero */}
            <h2 className={styles.heroPhilosophy}>The Philosophy</h2>
            <p className={styles.heroBio}>{bio}</p>
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
        </section>

        {/* 2-column content layout */}
        <div className={styles.contentGrid}>
          {/* Left: Projects + Experience */}
          <div className={styles.contentLeft}>
            {/* Projects */}
            <section id="projects">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Selected Works</h2>
                <span className={styles.sectionLine} />
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
                        <div
                          className={styles.projectImg}
                          style={{ backgroundImage: `url(${project.image})` }}
                        />
                        <div className={styles.projectOverlay}>
                          <span className={styles.projectCta}>
                            View Case Study
                          </span>
                        </div>
                      </div>
                    )}
                    <div className={styles.projectInfo}>
                      <h4 className={styles.projectTitle}>{project.title}</h4>
                      {project.tags.length > 0 && (
                        <div className={styles.projectTags}>
                          {project.tags.map((tag) => (
                            <span key={tag} className={styles.projectTag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Career Narrative</h2>
                  <span className={styles.sectionLine} />
                </div>
                <div className={styles.timeline}>
                  {experience.map((exp) => (
                    <div
                      key={`${exp.company}-${exp.role}`}
                      className={styles.timelineItem}
                    >
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineContent}>
                        <span className={styles.timelineDate}>
                          {exp.startDate} &mdash;{" "}
                          {exp.current
                            ? "Present"
                            : exp.endDate ?? ""}
                        </span>
                        <h3 className={styles.timelineRole}>{exp.role}</h3>
                        <p className={styles.timelineCompany}>{exp.company}</p>
                        {exp.description && (
                          <p className={styles.timelineDesc}>
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right sidebar: Skills, Certs, Education */}
          <div className={styles.contentRight}>
            {/* Skills */}
            <section>
              <h2 className={styles.sidebarTitle}>Expertise</h2>
              <ul className={styles.skillsList}>
                {skills.map((skill) => (
                  <li key={skill.name} className={styles.skillItem}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillLevel}>
                      {LEVEL_LABELS[skill.level ?? "intermediate"] ??
                        skill.level}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <h2 className={styles.sidebarTitle}>Accreditations</h2>
                <div className={styles.certList}>
                  {certifications.map((cert) => (
                    <div key={cert.title} className={styles.certCard}>
                      <div className={styles.certIcon}>&#10003;</div>
                      <div>
                        <h5 className={styles.certTitle}>{cert.title}</h5>
                        <p className={styles.certMeta}>
                          {cert.issuer}
                          {cert.date ? ` \u2022 ${cert.date}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 className={styles.sidebarTitle}>Academic Provenance</h2>
                <div className={styles.eduList}>
                  {education.map((edu) => (
                    <div
                      key={`${edu.institution}-${edu.degree}`}
                      className={styles.eduItem}
                    >
                      <div className={styles.eduIcon}>&#127891;</div>
                      <div>
                        <h4 className={styles.eduDegree}>
                          {edu.degree} {edu.field}
                        </h4>
                        <p className={styles.eduInstitution}>
                          {edu.institution}
                        </p>
                        <p className={styles.eduDate}>
                          {edu.startDate} &mdash; {edu.endDate ?? "Present"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            &copy; {name} {currentYear}
          </div>
          <div className={styles.footerSocials}>
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
    </div>
  );
}
