export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  shortDescription: string;
  thumbnail: string;
  tools: string[];
  order: number;
  isPublished: boolean;
  featured?: boolean;
  statusBadge?: string;
  caseStudy?: {
    overview: string;
    problem: string;
    goal?: string;
    targetAudience?: string;
    targetUsers?: string;
    solution: string;
    projectStatus?: {
      stage: string;
      status: 'Completed' | 'In Progress' | 'Planned';
    }[];
    userFlow?: string[];
    wireframes?: {
      title: string;
      desc: string;
      image?: string;
    }[];
    designDecisions?: {
      title: string;
      desc: string;
    }[];
    highFidelityUI?: {
      title: string;
      desc: string;
      image?: string;
    }[];
    keyFeatures?: string[];
    processSteps?: { title: string; desc: string }[];
    learnings?: string[];
    galleryImages?: string[];
    figmaUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
  };
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  image: string;
  credentialUrl?: string;
  skills?: string[];
  createdAt: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  color?: string;
  iconType: 'figma' | 'netlify' | 'dribbble' | 'github' | 'code' | 'design' | 'layers' | 'cpu' | 'globe' | 'sparkles';
  order?: number;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
  order?: number;
}

export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export interface SiteProfile {
  name: string;
  role: string;
  availability: string;
  heroHeadline: string;
  heroIntro: string;
  aboutText: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  educationDegree?: string;
  educationInstitute?: string;
  educationYear?: string;
  linkedInUrl: string;
  githubUrl: string;
  dribbbleUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeLastUpdated?: string;
  emailJsConfig: EmailJsConfig;
  adminPasscode: string;
  hideAdminFooterLink?: boolean;
  adminSecretHint?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read?: boolean;
}
