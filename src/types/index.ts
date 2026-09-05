export type ProjectSectionType =
  | 'text'
  | 'rich-text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'bullet-list'
  | 'numbered-list'
  | 'quote'
  | 'statistics'
  | 'timeline'
  | 'process'
  | 'user-flow'
  | 'feature-list'
  | 'comparison'
  | 'code'
  | 'prototype'
  | 'link';

export interface ProjectSectionItem {
  id?: string;
  title?: string;
  desc?: string;
  value?: string;
  label?: string;
  status?: 'Completed' | 'In Progress' | 'Planned' | string;
  icon?: string;
  image?: string;
}

export interface ProjectSectionImage {
  url: string;
  caption?: string;
  alt?: string;
}

export interface ProjectSection {
  id: string;
  title: string;
  subtitle?: string;
  type: ProjectSectionType;
  content?: string;
  items?: (string | ProjectSectionItem)[];
  images?: (string | ProjectSectionImage)[];
  embedUrl?: string;
  codeLanguage?: string;
  order: number;
  visible: boolean;
}

export interface ProjectLinks {
  liveDemo?: string;
  prototype?: string;
  github?: string;
  figma?: string;
  behance?: string;
  documentation?: string;
  customLinks?: { label: string; url: string }[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  projectType?: string;
  shortDescription: string;
  longDescription?: string;
  thumbnail: string;
  heroImage?: string;
  gallery?: string[];
  status?: 'Idea' | 'Planning' | 'In Progress' | 'Completed' | 'Archived' | string;
  statusBadge?: string;
  date?: string;
  duration?: string;
  role?: string;
  team?: string;
  tools: string[];
  tags?: string[];
  order: number;
  isPublished: boolean;
  featured?: boolean;
  links: ProjectLinks;
  contentSections: ProjectSection[];
  createdAt: string;
  caseStudy?: any;
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
