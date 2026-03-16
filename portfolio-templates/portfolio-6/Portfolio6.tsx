import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio6.module.css";

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

export default function Portfolio6(props: PortfolioProps) {
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

      {/* Navigation */}
      <nav className={styles.nav}>
        <h2 className={styles.navBrand}>SYSTEM_ROOT_V2</h2>
        <div className={styles.navLinks}>
          <a href="#about" className={styles.navLink}>01_Bio</a>
          <a href="#skills" className={styles.navLink}>02_Skills</a>
          <a href="#experience" className={styles.navLink}>03_Work</a>
          <a href="#projects" className={styles.navLink}>04_Projects</a>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navBtn}
            >
              DOWNLOAD_CV
            </a>
          ) : (
            <a href="#contact" className={styles.navBtn}>HIRE_ME</a>
          )}
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero — Asymmetric Grid */}
        <section className={styles.hero}>
          <div className={styles.heroImageCol}>
            <div className={styles.heroImageFrame}>
              <img src={image} alt={name} className={styles.heroImg} />
            </div>
            <div className={styles.heroNameBadge}>{name.toUpperCase()}</div>
          </div>
          <div className={styles.heroTextCol}>
            <span className={styles.heroSubtitle}>
              // {title.toUpperCase()}
            </span>
            <h1 className={styles.heroTitle}>
              {title.split(" ").slice(0, 1).join(" ")}
              <br />
              {title.split(" ").slice(1).join(" ")}
            </h1>
            <div className={styles.heroBar} />
          </div>
        </section>

        {/* About — Offset Card */}
        <section id="about" className={styles.aboutSection}>
          <div className={styles.aboutCard}>
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionIcon}>&#9608;</span> 01_BIOGRAPHY
            </h3>
            <p className={styles.aboutText}>{bio}</p>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className={styles.skillsSection}>
          <div className={styles.skillsHeader}>
            <h2 className={styles.sectionTitle}>02_Skill_Set</h2>
            <div className={styles.skillsHeaderBar}>
              <div className={styles.skillsHeaderBarFill} />
            </div>
          </div>
          <div className={styles.skillsGrid}>
            {Object.entries(skillsByCategory).map(
              ([category, categorySkills], idx) => (
                <div
                  key={category}
                  className={`${styles.skillCard} ${idx % 2 === 1 ? styles.skillCardAlt : ""}`}
                >
                  <h4 className={styles.skillCardTitle}>{category}</h4>
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
              <h2 className={styles.sectionTitle}>
                03_Work
                <br />
                History
              </h2>
            </div>
            <div className={styles.expTimeline}>
              {experience.map((exp, i) => (
                <div
                  key={`${exp.company}-${exp.role}`}
                  className={`${styles.expItem} ${i === 0 ? styles.expItemActive : ""}`}
                >
                  <div className={styles.expDot} />
                  <span className={styles.expDate}>
                    {exp.startDate} -{" "}
                    {exp.current ? "PRESENT" : (exp.endDate ?? "").toUpperCase()}
                  </span>
                  <h4 className={styles.expRole}>
                    {exp.role.toUpperCase()} @ {exp.company.toUpperCase()}
                  </h4>
                  {exp.description && (
                    <p className={styles.expDesc}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        <section id="projects" className={styles.projectsSection}>
          <h2 className={styles.sectionTitle}>04_Major_Deployments</h2>
          <div className={styles.projectsGrid}>
            {projects.map((project, i) => (
              <a
                key={project.title}
                href={project.liveUrl || project.repoUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.projectCard} ${i % 2 === 1 ? styles.projectCardOffset : ""}`}
              >
                {project.image && (
                  <div className={styles.projectImgWrap}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles.projectImg}
                    />
                    <div className={styles.projectImgOverlay}>
                      <span className={styles.projectOverlayText}>
                        VIEW_CASE_STUDY
                      </span>
                    </div>
                  </div>
                )}
                <div className={styles.projectMeta}>
                  <div>
                    <h4 className={styles.projectTitle}>
                      {project.title.toUpperCase()}
                    </h4>
                    <p className={styles.projectDesc}>{project.description}</p>
                  </div>
                  {project.tags.length > 0 && (
                    <span className={styles.projectTags}>
                      [{project.tags.join(" / ").toUpperCase()}]
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className={styles.certSection}>
            <h2 className={styles.sectionTitle}>05_Certifications</h2>
            <div className={styles.certGrid}>
              {certifications.map((cert) => (
                <div key={cert.title} className={styles.certCard}>
                  <span className={styles.certIcon}>&#10003;</span>
                  <div>
                    <p className={styles.certTitle}>
                      {cert.title.toUpperCase()}
                    </p>
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

        {/* Education + CTA */}
        <section className={styles.bottomSection}>
          <div className={styles.eduCol}>
            <div className={styles.eduCard}>
              <h2 className={styles.sectionTitle}>06_Academic_Core</h2>
              <ul className={styles.eduList}>
                {education.map((edu, i) => (
                  <li
                    key={`${edu.institution}-${edu.degree}`}
                    className={styles.eduItem}
                  >
                    <span className={styles.eduNum}>
                      {String(i + 1).padStart(2, "0")}/
                    </span>
                    <div>
                      <h5 className={styles.eduDegree}>
                        {edu.degree} {edu.field}
                      </h5>
                      <p className={styles.eduMeta}>
                        {edu.institution} | {edu.startDate} -{" "}
                        {edu.endDate ?? "Present"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.ctaCol}>
            <h3 className={styles.ctaTitle}>
              Open for
              <br />
              <span className={styles.ctaAccent}>Collisions</span>
            </h3>
            <p className={styles.ctaText}>
              Currently seeking high-impact projects at the intersection of
              emerging technology and digital culture.
            </p>
            {socials.find((s) => s.platform === "email") && (
              <a
                href={socials.find((s) => s.platform === "email")!.url}
                className={styles.ctaBtn}
              >
                INITIATE_CONTACT_
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>SYSTEM_ROOT_V2</div>
          <div className={styles.footerLinks}>
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                {(SOCIAL_LABELS[s.platform] ?? s.platform).toUpperCase()}
              </a>
            ))}
          </div>
          <div className={styles.footerCopy}>
            &copy; {currentYear} {name.toUpperCase()}_ALL_RIGHTS_RESERVED
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <nav className={styles.mobileNav}>
        <a href="#" className={styles.mobileNavActive}>&#8962;</a>
        <a href="#projects" className={styles.mobileNavLink}>&#9733;</a>
        <a href="#about" className={styles.mobileNavLink}>&#9786;</a>
        <a href="#contact" className={styles.mobileNavLink}>&#9993;</a>
      </nav>
    </div>
  );
}
