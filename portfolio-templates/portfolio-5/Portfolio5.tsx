import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio5.module.css";

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

export default function Portfolio5(props: PortfolioProps) {
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

  // Split name for two-tone hero
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  // Group skills by category for grid display
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
        <div className={styles.headerBrand}>
          <span className={styles.headerIcon}>&#9646;</span>
          <h1 className={styles.headerTitle}>Refined.Raw</h1>
        </div>
        <nav className={styles.headerNav}>
          <a href="#about" className={styles.headerLink}>About</a>
          <a href="#skills" className={styles.headerLink}>Skills</a>
          <a href="#experience" className={styles.headerLink}>Experience</a>
          <a href="#projects" className={styles.headerLink}>Works</a>
        </nav>
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hireBtn}
          >
            Download CV
          </a>
        ) : (
          <a href="#contact" className={styles.hireBtn}>Hire Me</a>
        )}
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroImageCol}>
              <div className={styles.heroImageGlow} />
              <div className={styles.heroImageFrame}>
                <img src={image} alt={name} className={styles.heroImg} />
              </div>
            </div>
            <div className={styles.heroTextCol}>
              <h2 className={styles.heroName}>
                {firstName.toUpperCase()}
                {lastName && (
                  <>
                    <br />
                    <span className={styles.heroNameAccent}>
                      {lastName.toUpperCase()}
                    </span>
                  </>
                )}
              </h2>
              <p className={styles.heroTagline}>{title}</p>
              <div className={styles.heroActions}>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.heroBtnOutline}
                  >
                    Download CV
                  </a>
                )}
                {socials.find((s) => s.platform === "email") && (
                  <a
                    href={socials.find((s) => s.platform === "email")!.url}
                    className={styles.heroIconLink}
                  >
                    &#9993;
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* About — split layout */}
        <section id="about" className={styles.splitSection}>
          <div className={styles.splitLeft}>
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionNum}>01</span> About Me
            </h3>
            <p className={styles.aboutText}>{bio}</p>
          </div>
          <div className={styles.splitRight}>
            <span className={styles.splitWatermark}>RAW</span>
            <p className={styles.splitQuote}>
              &quot;Design is not a decorative layer. It is the structure
              itself.&quot;
            </p>
            <div className={styles.splitBar} />
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className={styles.skillsSection}>
          <h3 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>02</span> Core Skills
          </h3>
          <div className={styles.skillsGrid}>
            {Object.entries(skillsByCategory).map(
              ([category, categorySkills]) => (
                <div key={category} className={styles.skillCard}>
                  <h4 className={styles.skillCardTitle}>
                    {category.toUpperCase()}
                  </h4>
                  <p className={styles.skillCardList}>
                    {categorySkills.map((s) => s.name).join(", ")}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section id="experience" className={styles.experienceSection}>
            <div className={styles.expSidebar}>
              <div>
                <h3 className={styles.sectionHeading}>
                  <span className={styles.sectionNum}>03</span> Career
                </h3>
                <p className={styles.expSidebarText}>
                  The timeline of professional growth and contributions.
                </p>
              </div>
              <span className={styles.expSidebarWatermark}>Path</span>
            </div>
            <div className={styles.expCards}>
              {experience.map((exp, i) => (
                <div
                  key={`${exp.company}-${exp.role}`}
                  className={styles.expCard}
                >
                  <div className={styles.expCardNumBg}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className={styles.expCardTop}>
                    <span className={styles.expCardDate}>
                      {exp.startDate} —{" "}
                      {exp.current ? "PRESENT" : (exp.endDate ?? "").toUpperCase()}
                    </span>
                    <h4 className={styles.expCardRole}>
                      {exp.role.toUpperCase()}
                    </h4>
                    <p className={styles.expCardCompany}>{exp.company}</p>
                  </div>
                  {exp.description && (
                    <ul className={styles.expCardList}>
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .map((line, j) => (
                          <li key={j} className={styles.expCardListItem}>
                            <span className={styles.expCardSlash}>/</span>{" "}
                            {line}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        <section id="projects" className={styles.projectsSection}>
          <h3 className={styles.projectsHeading}>
            <span className={styles.projectsHeadingNum}>04</span> Selected
            Works
          </h3>
          <div className={styles.projectsScroll}>
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
                    <div className={styles.projectImgOverlay} />
                  </div>
                )}
                <div className={styles.projectCardBottom}>
                  <div>
                    <h4 className={styles.projectCardTitle}>
                      {project.title.toUpperCase()}
                    </h4>
                    {project.tags.length > 0 && (
                      <p className={styles.projectCardTags}>
                        {project.tags.join(" / ").toUpperCase()}
                      </p>
                    )}
                  </div>
                  <span className={styles.projectCardArrow}>&rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Certificates & Education — split */}
        <section className={styles.splitSection} id="creds">
          {/* Certificates */}
          <div className={styles.credsLeft}>
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionNum}>05</span> Certificates
            </h3>
            <div className={styles.certList}>
              {certifications.map((cert) => (
                <div key={cert.title} className={styles.certItem}>
                  <div>
                    <h5 className={styles.certTitle}>
                      {cert.title.toUpperCase()}
                    </h5>
                    <p className={styles.certMeta}>
                      {cert.date ? `Issued ${cert.date}` : ""}{" "}
                      {cert.issuer ? `\u2022 ${cert.issuer}` : ""}
                    </p>
                  </div>
                  <span className={styles.certCheck}>&#10003;</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className={styles.credsRight}>
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionNum}>06</span> Education
            </h3>
            <div className={styles.eduList}>
              {education.map((edu) => (
                <div
                  key={`${edu.institution}-${edu.degree}`}
                  className={styles.eduItem}
                >
                  <h4 className={styles.eduDegree}>
                    {edu.degree} {edu.field}
                  </h4>
                  <p className={styles.eduMeta}>
                    {edu.institution}, {edu.startDate} -{" "}
                    {edu.endDate ?? "Present"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerLeft}>
          <h1 className={styles.footerBrand}>
            Refined.<span className={styles.footerBrandAccent}>Raw</span>
          </h1>
          <p className={styles.footerCopy}>
            &copy; {currentYear} {name} / Built with Raw Intent
          </p>
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
      </footer>

      {/* Mobile Nav */}
      <nav className={styles.mobileNav}>
        <a href="#hero" className={styles.mobileNavActive}>&#8962;</a>
        <a href="#experience" className={styles.mobileNavLink}>&#9881;</a>
        <a href="#projects" className={styles.mobileNavLink}>&#9733;</a>
        <a href="#about" className={styles.mobileNavLink}>&#9786;</a>
      </nav>
    </div>
  );
}
