import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio3.module.css";

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

export default function Portfolio3(props: PortfolioProps) {
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

  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.wrapper}>
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Fixed Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerBrand}>
            <div className={styles.brandDot} />
            <span className={styles.brandName}>{name}</span>
          </div>
          <nav className={styles.headerNav}>
            <a href="#about" className={styles.navLink}>
              Home
            </a>
            <a href="#projects" className={styles.navLink}>
              Work
            </a>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Left Column: Bio, About, Skills */}
          <aside className={styles.sidebar}>
            {/* Profile Picture */}
            <section className={styles.profileSection}>
              <div className={styles.profileImageWrap}>
                <div className={styles.profileImageContainer}>
                  <img
                    src={image}
                    alt={name}
                    className={styles.profileImage}
                  />
                </div>
                <div className={styles.profileDot} />
              </div>
              <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>{name}</h1>
                <p className={styles.profileTitle}>{title}</p>
              </div>
            </section>

            {/* About */}
            <section id="about" className={styles.aboutSection}>
              <div className={styles.aboutHeader}>
                <h2 className={styles.sectionLabelSmall}>
                  Human-Centric Approach
                </h2>
              </div>
              <p className={styles.aboutText}>{bio}</p>
            </section>

            {/* Skills */}
            <section className={styles.skillsSection}>
              <h3 className={styles.sectionLabel}>Expertise</h3>
              <div className={styles.skillsWrap}>
                {skills.map((skill, i) => (
                  <span
                    key={skill.name}
                    className={
                      i === 0 ? styles.skillTagPrimary : styles.skillTag
                    }
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          </aside>

          {/* Right Column */}
          <div className={styles.content}>
            {/* Projects */}
            <section id="projects" className={styles.projectsSection}>
              <h3 className={styles.sectionTitle}>Featured Projects</h3>
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
                      <div className={styles.projectImageWrap}>
                        <img
                          src={project.image}
                          alt={project.title}
                          className={styles.projectImage}
                        />
                      </div>
                    )}
                    <h4 className={styles.projectTitle}>{project.title}</h4>
                    {project.tags.length > 0 && (
                      <p className={styles.projectTags}>
                        {project.tags.join(" \u2022 ")}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </section>

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section className={styles.experienceSection}>
                <h3 className={styles.sectionTitleBordered}>
                  Professional Journey
                </h3>
                <div className={styles.experienceGrid}>
                  {experience.map((exp, i) => (
                    <div key={`${exp.company}-${exp.role}`} className={styles.experienceCard}>
                      <div className={styles.experienceTop}>
                        <h4 className={styles.experienceRole}>{exp.role}</h4>
                        <span
                          className={
                            i === 0
                              ? styles.experienceDatePrimary
                              : styles.experienceDate
                          }
                        >
                          {exp.startDate} —{" "}
                          {exp.current ? "Present" : exp.endDate ?? ""}
                        </span>
                      </div>
                      <p
                        className={
                          i === 0
                            ? styles.experienceCompanyPrimary
                            : styles.experienceCompany
                        }
                      >
                        {exp.company}
                      </p>
                      {exp.description && (
                        <p className={styles.experienceDesc}>
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications & Education — side by side */}
            {(certifications.length > 0 || education.length > 0) && (
              <div className={styles.bottomGrid}>
                {/* Certifications */}
                {certifications.length > 0 && (
                  <section className={styles.certsSection}>
                    <h3 className={styles.sectionLabel}>Certifications</h3>
                    <ul className={styles.certsList}>
                      {certifications.map((cert) => (
                        <li key={cert.title} className={styles.certItem}>
                          <div className={styles.certIcon}>
                            <span className={styles.certIconInner}>&#10003;</span>
                          </div>
                          <span className={styles.certTitle}>{cert.title}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Education */}
                {education.length > 0 && (
                  <section className={styles.eduSection}>
                    <h3 className={styles.sectionLabel}>Education</h3>
                    <div className={styles.eduTimeline}>
                      {education.map((edu, i) => (
                        <div key={`${edu.institution}-${edu.degree}`} className={styles.eduItem}>
                          <div
                            className={
                              i === 0
                                ? styles.eduDotPrimary
                                : styles.eduDotGray
                            }
                          />
                          <div>
                            <h4 className={styles.eduDegree}>
                              {edu.degree} {edu.field}
                            </h4>
                            <p className={styles.eduMeta}>
                              {edu.institution} &bull; {edu.startDate} —{" "}
                              {edu.endDate ?? "Present"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCta}>
            <h3 className={styles.footerHeading}>
              Let&apos;s build something together.
            </h3>
            <p className={styles.footerSubtext}>
              Available for freelance projects and consulting.
            </p>
          </div>
          <div className={styles.footerSocials}>
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
              >
                {SOCIAL_LABELS[s.platform] ?? s.platform}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.footerCopy}>
          &copy; {currentYear} {name} — Organic Modern Portfolio
        </div>
      </footer>
    </div>
  );
}
