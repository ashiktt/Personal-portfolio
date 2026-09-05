import { Project, ProjectSection } from '../types';

/**
 * Ensures any project object conforms to the new dynamic contentSections & links architecture.
 * Safely converts legacy caseStudy fields into modular content sections without losing data.
 */
export function migrateProjectToDynamicSections(rawProj: any): Project {
  if (!rawProj || typeof rawProj !== 'object') {
    return {
      id: 'proj-' + Date.now(),
      title: 'Untitled Project',
      category: 'Product Design',
      shortDescription: '',
      thumbnail: '',
      tools: [],
      order: 1,
      isPublished: true,
      links: {},
      contentSections: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
  }

  // If already has valid contentSections array, return with normalized fields
  if (Array.isArray(rawProj.contentSections) && rawProj.contentSections.length > 0) {
    return {
      ...rawProj,
      links: rawProj.links || {
        figma: rawProj.caseStudy?.figmaUrl || '',
        github: rawProj.caseStudy?.githubUrl || '',
        liveDemo: rawProj.caseStudy?.liveUrl || '',
      },
      tags: rawProj.tags || [],
      gallery: rawProj.gallery || rawProj.caseStudy?.galleryImages || [],
      contentSections: rawProj.contentSections.map((sec: any, idx: number) => ({
        id: sec.id || `sec-${idx + 1}-${Date.now()}`,
        title: sec.title || 'Section',
        subtitle: sec.subtitle || '',
        type: sec.type || 'text',
        content: sec.content || '',
        items: Array.isArray(sec.items) ? sec.items : [],
        images: Array.isArray(sec.images) ? sec.images : [],
        embedUrl: sec.embedUrl || '',
        codeLanguage: sec.codeLanguage || '',
        order: typeof sec.order === 'number' ? sec.order : idx + 1,
        visible: sec.visible !== false,
      })),
    };
  }

  // Convert legacy caseStudy structure into dynamic sections
  const cs = rawProj.caseStudy || {};
  const sections: ProjectSection[] = [];
  let orderCount = 1;

  if (cs.overview) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'Project Overview',
      type: 'text',
      content: cs.overview,
      order: orderCount++,
      visible: true,
    });
  }

  if (cs.problem || cs.goal) {
    if (cs.problem) {
      sections.push({
        id: `sec-${orderCount}`,
        title: 'The Problem',
        type: 'text',
        content: cs.problem,
        order: orderCount++,
        visible: true,
      });
    }
    if (cs.goal) {
      sections.push({
        id: `sec-${orderCount}`,
        title: 'Project Goal',
        type: 'text',
        content: cs.goal,
        order: orderCount++,
        visible: true,
      });
    }
  }

  if (cs.targetUsers || cs.targetAudience) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'Target Users',
      type: 'text',
      content: cs.targetUsers || cs.targetAudience,
      order: orderCount++,
      visible: true,
    });
  }

  if (Array.isArray(cs.projectStatus) && cs.projectStatus.length > 0) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'Project Stages & Progress',
      type: 'timeline',
      items: cs.projectStatus.map((item: any) => ({
        title: item.stage,
        status: item.status,
      })),
      order: orderCount++,
      visible: true,
    });
  }

  if (Array.isArray(cs.userFlow) && cs.userFlow.length > 0) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'User Flow',
      type: 'user-flow',
      items: cs.userFlow,
      order: orderCount++,
      visible: true,
    });
  }

  if (Array.isArray(cs.wireframes) && cs.wireframes.length > 0) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'Low-Fidelity Wireframes',
      type: 'process',
      items: cs.wireframes.map((wf: any) => ({
        title: wf.title,
        desc: wf.desc,
        image: wf.image,
      })),
      order: orderCount++,
      visible: true,
    });
  }

  if (Array.isArray(cs.designDecisions) && cs.designDecisions.length > 0) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'Key Design Decisions',
      type: 'feature-list',
      items: cs.designDecisions.map((dd: any) => ({
        title: dd.title,
        desc: dd.desc,
      })),
      order: orderCount++,
      visible: true,
    });
  }

  if (Array.isArray(cs.highFidelityUI) && cs.highFidelityUI.length > 0) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'High-Fidelity UI Highlights',
      type: 'process',
      items: cs.highFidelityUI.map((hf: any) => ({
        title: hf.title,
        desc: hf.desc,
        image: hf.image,
      })),
      order: orderCount++,
      visible: true,
    });
  }

  if (Array.isArray(cs.keyFeatures) && cs.keyFeatures.length > 0) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'Key Features & Capabilities',
      type: 'bullet-list',
      items: cs.keyFeatures,
      order: orderCount++,
      visible: true,
    });
  }

  if (Array.isArray(cs.learnings) && cs.learnings.length > 0) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'Key Learnings & Takeaways',
      type: 'bullet-list',
      items: cs.learnings,
      order: orderCount++,
      visible: true,
    });
  }

  if (Array.isArray(cs.galleryImages) && cs.galleryImages.length > 0) {
    sections.push({
      id: `sec-${orderCount}`,
      title: 'Project Gallery',
      type: 'gallery',
      images: cs.galleryImages.map((img: string) => ({ url: img })),
      order: orderCount++,
      visible: true,
    });
  }

  return {
    ...rawProj,
    links: rawProj.links || {
      figma: cs.figmaUrl || '',
      github: cs.githubUrl || '',
      liveDemo: cs.liveUrl || '',
      prototype: '',
      behance: '',
      documentation: '',
      customLinks: [],
    },
    gallery: rawProj.gallery || cs.galleryImages || [],
    tags: rawProj.tags || [],
    contentSections: sections,
  };
}
