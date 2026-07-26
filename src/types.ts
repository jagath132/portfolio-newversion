export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  duration: string;
  institution: string;
  description: string;
  achievements: string[];
}

export interface SkillItem {
  name: string;
  iconName: string;
  level: number; // 1-100
  color: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  location?: string;
  summary: string;
  bulletPoints: string[];
  techStack: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  image: string;
  description: string;
  fullDetails: {
    overview: string;
    keyFeatures: string[];
    metrics: { label: string; value: string }[];
    architecture: string;
  };
  demoUrl?: string;
  githubUrl?: string;
}
