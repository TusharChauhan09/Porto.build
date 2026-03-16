import type { PortfolioProps } from "../PortfolioTypes";
import styles from "./Portfolio4.module.css";

const SOCIAL_LABELS: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  website: "Website",
  email: "Email Me",
  youtube: "YouTube",
  dribbble: "Dribbble",
  behance: "Behance",
  instagram: "Instagram",
};

export default function Portfolio4(props: PortfolioProps) {
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

  // Split name for two-tone display
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div className={styles.wrapper}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.navBrand}>Portfolio.</span>
          <div className={styles.navLinks}>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#projects" className={styles.navLink}>Works</a>
            <a href="#experience" className={styles.navLink}>Journey</a>
            <a href="#contact" className={styles.navLink}>Contact</a>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.heroLabel}>{title}</p>
            <h1 className={styles.heroName}>
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span className={styles.heroNameAccent}>{lastName}</span>
                </>
              )}
            </h1>
            <p className={styles.heroTagline}>{bio}</p>
            <div className={styles.heroActions}>
              <a href="#projects" className={styles.btnPrimary}>
                View Portfolio
              </a>
              <a href="#about" className={styles.btnOutline}>
                My Story
              </a>
            </div>
          </div>
          <div className={styles.heroImageCol}>
            <div className={styles.heroImageWrap}>
              <div className={styles.blobImage}>
                <img src={image} alt={name} className={styles.heroImg} />
              </div>
              {/* Decorative blobs */}
              <div className={styles.decorBlobSage} />
              <div className={styles.decorBlobTerra} />
            </div>
          </div>
        </section>

        {/* About + Skills Grid */}
        <div className={styles.aboutSkillsGrid}>
          {/* About */}
          <section id="about" className={styles.aboutSection}>
            <div className={styles.aboutCard}>
              <h2 className={styles.aboutHeading}>
                Hello, I&apos;m {firstName}
              </h2>
              <div className={styles.aboutBody}>
                <p>{bio}</p>
              </div>
              <div className={styles.aboutCorner} />
            </div>
          </section>

          {/* Skills */}
          <section className={styles.skillsSection}>
            <h2 className={styles.skillsHeading}>
              Expertise <span className={styles.skillsLine} />
            </h2>
            <div className={styles.skillsWrap}>
              {skills.map((skill, i) => {
                const variant =
                  i % 3 === 0
                    ? styles.skillPillTerra
                    : i % 3 === 1
                    ? styles.skillPillSage
                    : styles.skillPillGray;
                return (
                  <span key={skill.name} className={variant}>
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </section>
        </div>

        {/* Projects */}
        <section id="projects" className={styles.projectsSection}>
          <div className={styles.projectsHeader}>
            <div>
              <h2 className={styles.projectsHeading}>Selected Works</h2>
              <p className={styles.projectsSub}>
                Crafting digital ecosystems with purpose.
              </p>
            </div>
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
                <div className={styles.projectBody}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>
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

        {/* Experience + Education side-by-side */}
        <div className={styles.journeyGrid}>
          {/* Experience */}
          {experience && experience.length > 0 && (
            <section id="experience" className={styles.experienceSection}>
              <h2 className={styles.journeyHeading}>The Journey</h2>
              <div className={styles.timeline}>
                <div className={styles.timelinePath} />
                {experience.map((exp, i) => (
                  <div
                    key={`${exp.company}-${exp.role}`}
                    className={styles.timelineItem}
                  >
                    <div
                      className={
                        i === 0
                          ? styles.timelineDotTerra
                          : styles.timelineDotSage
                      }
                    />
                    <div>
                      <span
                        className={
                          i === 0
                            ? styles.timelineDateTerra
                            : styles.timelineDateSage
                        }
                      >
                        {exp.startDate} —{" "}
                        {exp.current ? "Present" : (exp.endDate ?? "").toUpperCase()}
                      </span>
                      <h3 className={styles.timelineRole}>{exp.role}</h3>
                      <p className={styles.timelineCompany}>{exp.company}</p>
                      {exp.description && (
                        <p className={styles.timelineDesc}>{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className={styles.eduSection}>
              <div className={styles.eduCard}>
                <h2 className={styles.eduHeading}>Qualifications</h2>
                <div className={styles.eduList}>
                  {education.map((edu) => (
                    <div
                      key={`${edu.institution}-${edu.degree}`}
                      className={styles.eduItem}
                    >
                      <h3 className={styles.eduDegree}>
                        {edu.degree} {edu.field}
                      </h3>
                      {edu.description && (
                        <p className={styles.eduField}>{edu.description}</p>
                      )}
                      <p className={styles.eduMeta}>
                        {edu.institution} | {edu.startDate} -{" "}
                        {edu.endDate ?? "Present"}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Decorative blob */}
                <div className={styles.eduBlob} />
              </div>
            </section>
          )}
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className={styles.certsSection}>
            <h2 className={styles.certsHeading}>Accreditations</h2>
            <div className={styles.certsGrid}>
              {certifications.map((cert, i) => (
                <div
                  key={cert.title}
                  className={`${styles.certCard} ${
                    i % 2 === 0
                      ? styles.certCardTerra
                      : styles.certCardSage
                  }`}
                >
                  <div className={styles.certIcon}>&#10003;</div>
                  <h4 className={styles.certTitle}>{cert.title}</h4>
                  <p className={styles.certIssuer}>
                    {cert.issuer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerInner}>
          <h2 className={styles.footerHeading}>
            Let&apos;s grow{" "}
            <span className={styles.footerAccent}>together.</span>
          </h2>
          <p className={styles.footerSub}>
            Currently open to collaborations on projects that prioritize
            sustainability, community, and human-centric design.
          </p>
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
          <div className={styles.footerBottom}>
            <span className={styles.footerBrand}>Portfolio.</span>
            <p className={styles.footerCopy}>
              &copy; {currentYear} {name} &bull; Organic Modern Portfolio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
