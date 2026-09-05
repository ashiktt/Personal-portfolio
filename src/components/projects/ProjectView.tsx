import React from 'react';
import { Project } from '../../types';
import { ProjectHero } from './ProjectHero';
import { ProjectLinks } from './ProjectLinks';
import { ProjectSectionRenderer } from './ProjectSectionRenderer';
import { Sparkles, Folder } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
  isPreview?: boolean;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project, isPreview = false }) => {
  // Sort sections by order and filter visible
  const visibleSections = (project.contentSections || [])
    .filter((sec) => sec.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-10 text-slate-100">
      {/* Hero Banner / Image (if heroImage exists) */}
      {project.heroImage && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl max-h-96">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Hero Information */}
      <ProjectHero project={project} />

      {/* Action Links Bar */}
      <ProjectLinks links={project.links} />

      {/* Dynamic Content Sections */}
      {visibleSections.length > 0 ? (
        <div className="space-y-10 pt-2">
          {visibleSections.map((section, idx) => (
            <ProjectSectionRenderer key={section.id || idx} section={section} index={idx} />
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center space-y-2">
          <Folder className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm text-slate-400">No content sections defined yet.</p>
        </div>
      )}

      {/* Standalone Project Gallery (if provided in project.gallery and not in sections) */}
      {project.gallery && project.gallery.length > 0 && !visibleSections.some((s) => s.type === 'gallery') && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h3 className="text-xl font-bold text-white">Project Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((img, gIdx) => (
              <div key={gIdx} className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
                <img src={img} alt={`Gallery ${gIdx + 1}`} className="w-full h-56 object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
