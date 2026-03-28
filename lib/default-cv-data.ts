import type { CVData } from "./cv-types";

export const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    fullName: "Your Name",
    jobTitle: "Software Engineer",
    email: "you@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedIn: "linkedin.com/in/yourname",
    website: "",
  },
  summary:
    "Experienced software engineer with a strong background in building scalable web applications. Passionate about clean architecture, developer experience, and delivering impactful products.",
  experience: [
    {
      company: "Company Name",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "",
      current: true,
      bullets: [
        "Led development of a customer-facing dashboard serving 10K+ daily active users",
        "Reduced API response times by 40% through query optimization and caching strategies",
        "Mentored a team of 3 junior engineers, conducting code reviews and pair programming sessions",
      ],
    },
    {
      company: "Previous Company",
      role: "Software Engineer",
      location: "New York, NY",
      startDate: "Jun 2020",
      endDate: "Dec 2021",
      current: false,
      bullets: [
        "Built and maintained RESTful APIs serving 1M+ requests per day",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
      ],
    },
  ],
  education: [
    {
      institution: "University Name",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.8",
      description: "",
    },
  ],
  skillGroups: [
    { category: "Languages", skills: ["TypeScript", "Python", "Go", "SQL"] },
    { category: "Frameworks", skills: ["React", "Next.js", "Node.js", "Express"] },
    { category: "Tools", skills: ["PostgreSQL", "Docker", "AWS", "Git"] },
  ],
  certifications: [
    { title: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2023" },
  ],
  languages: [
    { language: "English", proficiency: "native" },
    { language: "Spanish", proficiency: "intermediate" },
  ],
  sectionOrder: [
    "summary",
    "experience",
    "education",
    "skillGroups",
    "certifications",
    "languages",
  ],
  colors: {
    heading: "#1a1a1a",
    accent: "#1a1a1a",
    text: "#4a4a4a",
  },
};
