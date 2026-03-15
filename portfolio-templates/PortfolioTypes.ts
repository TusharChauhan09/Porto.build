export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "website" | "email" | "youtube" | "dribbble" | "behance" | "instagram";
  url: string;
}

export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  percentage?: number;
  category?: string;
}

export interface Project {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  url?: string;
  image?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  current?: boolean;
}

export interface PortfolioProps {
  // Personal
  name: string;
  title: string;
  bio: string;
  image: string;
  location?: string;
  resumeUrl?: string;

  // Socials
  socials: SocialLink[];

  // Sections
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  experience?: Experience[];
}
