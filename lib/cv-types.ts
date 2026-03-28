export interface CVPersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
}

export interface CVExperience {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface CVEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface CVSkillGroup {
  category: string;
  skills: string[];
}

export interface CVCertification {
  title: string;
  issuer: string;
  date: string;
}

export interface CVLanguage {
  language: string;
  proficiency: "native" | "fluent" | "advanced" | "intermediate" | "basic";
}

export type CVSectionId =
  | "summary"
  | "experience"
  | "education"
  | "skillGroups"
  | "certifications"
  | "languages";

export interface CVColors {
  heading: string;
  accent: string;
  text: string;
}

export interface CVData {
  personalInfo: CVPersonalInfo;
  summary: string;
  experience: CVExperience[];
  education: CVEducation[];
  skillGroups: CVSkillGroup[];
  certifications: CVCertification[];
  languages: CVLanguage[];
  sectionOrder: CVSectionId[];
  colors: CVColors;
}
