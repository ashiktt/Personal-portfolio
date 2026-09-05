import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, ArrowUpRight, Sparkles, Clock, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/Badge';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const { publishedProjects } = usePortfolio();

  // Find the primary featured project or first published project
  const featuredProject = publishedProjects.find((p) => p.featured) || publishedProjects[0];
  const otherProjects = publishedProjects.filter((p) => p.id !== featuredProject?.id);

  // Helper to extract dynamic highlight items from project's content sections
  const getProjectHighlights = (project: Project): string[] => {
    const highlights: string[] = [];

    // Look for bullet-list items or process/feature titles
    for (const section of project.contentSections || []) {
      if (section.items && Array.isArray(section.items)) {
        for (const item of section.items) {
          if (highlights.length >= 4) break;
          if (typeof item === 'string') {
            highlights.push(item);
          } else if (item && typeof item === 'object' && item.title) {
            highlights.push(item.title);
          }
        }
      }
      if (highlights.length >= 4) break;
    }

    // Fallback to tools or section titles if items are sparse
    if (highlights.length < 2 && project.contentSections) {
      project.contentSections.slice(0, 4).forEach((s) => {
        if (s.title && !highlights.includes(s.title)) highlights.push(s.title);
      });
    }

    return highlights.slice(0, 4);
  };

  const featuredHighlights = featuredProject ? getProjectHighlights(featuredProject) : [];

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>SELECTED WORK &amp; CASE STUDIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            A showcase of digital products, user experience case studies, AI workflows, and software solutions.
          </p>
        </div>

        {/* 1. Large Hero-Grade Featured Project Showcase */}
        {featuredProject && (
          <SpotlightCard
            onClick={() => onSelectProject(featuredProject)}
            className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-[#0E1322]/95 via-[#0C1019]/90 to-[#0A0D17]/95 border border-blue-500/30 backdrop-blur-2xl shadow-2xl shadow-blue-500/10 cursor-pointer group transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Project Details & Action */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Badges Header */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold tracking-wide uppercase shadow-md shadow-blue-600/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    FEATURED PROJECT
                  </span>

                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-mono">
                    {featuredProject.category}
                  </span>

                  {featuredProject.projectType && (
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                      {featuredProject.projectType}
                    </span>
                  )}

                  {(featuredProject.statusBadge || featuredProject.status) && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {featuredProject.statusBadge || featuredProject.status}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                    {featuredProject.title}
                  </h3>
                  {featuredProject.subtitle && (
                    <div className="text-sm sm:text-base font-medium text-blue-300/90 font-mono">
                      {featuredProject.subtitle}
                    </div>
                  )}
                </div>

                {/* Project Description */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  {featuredProject.shortDescription}
                </p>

                {/* Dynamic Highlights from project content */}
                {featuredHighlights.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {featuredHighlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tools Tags */}
                {featuredProject.tools && featuredProject.tools.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {featuredProject.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-900/90 text-slate-200 border border-slate-800"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

                {/* Prominent CTA Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-[1.02] transition-all border border-blue-400/40"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-4 h-4 text-blue-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

              </div>

              {/* Right Column: Project Image or Clean Placeholder */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/80 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 aspect-video sm:aspect-[4/3] flex items-center justify-center">
                  {featuredProject.heroImage || featuredProject.thumbnail ? (
                    <img
                      src={featuredProject.heroImage || featuredProject.thumbnail}
                      alt={featuredProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <FolderGit2 className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">{featuredProject.title}</p>
                      <span className="text-xs text-slate-500 font-mono">{featuredProject.category}</span>
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </SpotlightCard>
        )}

        {/* 2. Additional Future Real Projects Grid */}
        {otherProjects.length > 0 && (
          <div className="space-y-6 pt-8">
            <h4 className="text-xl font-bold text-white tracking-tight">
              Other Projects
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <SpotlightCard
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="p-6 rounded-2xl bg-[#0E1322]/80 border border-slate-800 flex flex-col justify-between h-full group cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 space-y-1">
                          <ImageIcon className="w-6 h-6" />
                          <span className="text-[11px] font-mono">{project.category}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                        {project.category}
                      </span>
                      {project.status && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {project.status}
                        </span>
                      )}
                    </div>

                    <h5 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-medium">
                    <span>View Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
