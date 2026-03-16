import type { PortfolioProps } from "@/portfolio-templates/PortfolioTypes";

export const DEFAULT_PORTFOLIO_DATA: PortfolioProps = {
  name: "Your Name",
  title: "Full Stack Developer",
  bio: "Write something about yourself here. This will appear in the About section of your portfolio.",
  image: "https://placehold.co/400x400/0a0a0b/a413ec?text=You",
  location: "Your City",
  resumeUrl: "",
  socials: [
    { platform: "github", url: "https://github.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
  ],
  skills: [
    { name: "TypeScript / React", percentage: 90 },
    { name: "Node.js", percentage: 85 },
    { name: "PostgreSQL", percentage: 75 },
  ],
  projects: [
    {
      title: "Project One",
      description: "A brief description of your first project.",
      tags: ["React", "TypeScript"],
      liveUrl: "",
      repoUrl: "",
    },
  ],
  certifications: [
    { title: "Example Certification", issuer: "Issuing Org", date: "2024" },
  ],
  education: [
    {
      institution: "University",
      degree: "BSc",
      field: "Computer Science",
      startDate: "2018",
      endDate: "2022",
    },
  ],
  experience: [
    {
      company: "Company",
      role: "Developer",
      startDate: "2022",
      endDate: "",
      description: "What you did at this role.",
      current: true,
    },
  ],
};
