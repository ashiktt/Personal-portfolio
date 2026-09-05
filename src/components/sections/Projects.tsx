import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/Badge';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const { publishedProjects } = usePortfolio();

  // Exactly ONE featured project (where featured === true)
  const featuredProject = publishedProjects.find((p) => p.featured === true);

  // All published projects where featured === false
  const otherProjects = publishedProjects.filter((p) => !p.featured);

  // Category filtering state for Other Projects carousel
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories from otherProjects
  const categories = ['All', ...Array.from(new Set(otherProjects.map((p) => p.category).filter(Boolean)))];

  // Filtered Other Projects
  const filteredProjects = selectedCategory === 'All'
    ? otherProjects
    : otherProjects.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  // Carousel ref & scroll state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to update arrow disabled states
  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    // Buffer of 6px for subpixel rounding
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    updateScrollState();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [filteredProjects]);

  // Scroll navigation handlers
  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    // Scroll by approximately one visible viewport step or card width
    const scrollAmount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Helper to extract dynamic highlight items from project's content sections
  const getProjectHighlights = (project: Project): string[] => {
    const highlights: string[] = [];

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

    if (highlights.length < 2 && project.contentSections) {
      project.contentSections.slice(0, 4).forEach((s) => {
        if (s.title && !highlights.includes(s.title)) highlights.push(s.title);
      });
    }

    return highlights.slice(0, 4);
  };

  const featuredHighlights = featuredProject ? getProjectHighlights(featuredProject) : [];

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>SELECTED WORK &amp; CASE STUDIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Featured &amp; Other Projects
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            A showcase of digital products, user experience case studies, AI workflows, and software solutions.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 1. LARGE HERO-GRADE FEATURED PROJECT SHOWCASE (Only if featured === true) */}
        {/* ========================================================= */}
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
                    <span>View Case Study</span>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </SpotlightCard>
        )}

        {/* ========================================================= */}
        {/* 2. OTHER PROJECTS — HORIZONTAL SCROLLABLE CAROUSEL */}
        {/* ========================================================= */}
        {otherProjects.length > 0 && (
          <div className="space-y-6 pt-4">
            
            {/* Header with Title, Category Filters, and Carousel Arrows */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Other Projects
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                    {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Explore additional digital interfaces, design systems, and software solutions.
                </p>
              </div>

              {/* Controls: Category Filter Chips & Navigation Arrows */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Category Filter Pills (if multiple categories exist) */}
                {categories.length > 2 && (
                  <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Carousel Previous / Next Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleScroll('left')}
                    disabled={!canScrollLeft}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                    aria-label="Previous projects"
                    title="Previous projects"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScroll('right')}
                    disabled={!canScrollRight}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                    aria-label="Next projects"
                    title="Next projects"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Carousel Track */}
            {filteredProjects.length > 0 ? (
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-4 px-1 -mx-1 scroll-smooth"
                  tabIndex={0}
                  aria-label="Other projects carousel"
                >
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="w-[82vw] sm:w-[320px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[280px] max-w-[400px] shrink-0 snap-start flex flex-col"
                    >
                      <SpotlightCard
                        onClick={() => onSelectProject(project)}
                        className="p-5 sm:p-6 rounded-3xl bg-[#0E1322]/85 border border-slate-800/90 hover:border-blue-500/40 flex flex-col justify-between h-full group cursor-pointer space-y-4 transition-all duration-300"
                      >
                        <div className="space-y-3.5">
                          {/* Card Thumbnail */}
                          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 flex items-center justify-center relative">
                            {project.thumbnail ? (
                              <img
                                src={project.thumbnail}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-slate-500 space-y-1.5 p-4 text-center">
                                <ImageIcon className="w-8 h-8 text-slate-600" />
                                <span className="text-[11px] font-mono text-slate-400">{project.category}</span>
                              </div>
                            )}

                            {/* Category Badge on Image */}
                            <div className="absolute top-2.5 left-2.5">
                              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-blue-300 border border-blue-500/30 text-[10px] font-mono font-semibold">
                                {project.category}
                              </span>
                            </div>

                            {/* Status Badge */}
                            {project.status && (
                              <div className="absolute top-2.5 right-2.5">
                                <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-slate-300 border border-slate-700 text-[10px] font-mono">
                                  {project.status}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Title & Subtitle */}
                          <div className="space-y-1">
                            <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">
                              {project.title}
                            </h4>
                            {project.subtitle && (
                              <p className="text-[11px] font-mono text-slate-400 truncate">
                                {project.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Short Description */}
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {project.shortDescription}
                          </p>

                          {/* Tools Chips */}
                          {project.tools && project.tools.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {project.tools.slice(0, 3).map((tool) => (
                                <span
                                  key={tool}
                                  className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                                >
                                  {tool}
                                </span>
                              ))}
                              {project.tools.length > 3 && (
                                <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                                  +{project.tools.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Bottom CTA */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                          <span>View Project</span>
                          <div className="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400 transition-colors">
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <Filter className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No projects in this category yet</h4>
                <p className="text-xs text-slate-400">
                  Try selecting &ldquo;All&rdquo; to view all available projects.
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
