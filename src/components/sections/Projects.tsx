import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, ArrowUpRight, Sparkles, Plane, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { SpotlightCard } from '../ui/SpotlightCard';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const { publishedProjects } = usePortfolio();

  // Find the primary featured project (Travel Booking App)
  const featuredProject = publishedProjects.find((p) => p.featured) || publishedProjects[0];
  const otherProjects = publishedProjects.filter((p) => p.id !== featuredProject?.id);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>FEATURED CASE STUDY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Featured Project
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            A deep-dive mobile product case study designed with user research, structured flows, and mobile interface design.
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
                    {featuredProject.subtitle || 'UI/UX Design • Mobile App • Case Study'}
                  </span>

                  {featuredProject.statusBadge && (
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {featuredProject.statusBadge}
                    </span>
                  )}
                </div>

                {/* Title & Tagline */}
                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                    {featuredProject.title}
                  </h3>
                  <div className="text-sm sm:text-base font-medium text-blue-300/90 font-mono">
                    UI/UX Design • Mobile App • Case Study
                  </div>
                </div>

                {/* Project Description */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  &ldquo;{featuredProject.shortDescription}&rdquo;
                </p>

                {/* Key Process Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>7-step progressive flight booking user flow</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Thumb-zone optimized wireframe hierarchy</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Transparent pricing &amp; seat selection matrix</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Component architecture designed in Figma</span>
                  </div>
                </div>

                {/* Tools Tags */}
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

              {/* Right Column: Custom Mobile App UI Mockup Preview (No stock desks/laptops) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-[32px] p-3 bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-700 shadow-2xl shadow-blue-900/40 group-hover:scale-[1.02] transition-transform duration-500">
                  
                  {/* Outer Mobile Frame Bezel */}
                  <div className="relative rounded-[26px] bg-[#0A0D14] overflow-hidden border border-slate-800 space-y-3 p-4">
                    
                    {/* Top Status Bar Mock */}
                    <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400 font-mono">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>5G</span>
                      </div>
                    </div>

                    {/* Flight App Header Mockup */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-blue-100">
                        <span>Round Trip</span>
                        <span>Economy Class</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-extrabold tracking-tight">DEL</div>
                          <div className="text-[10px] text-blue-200">New Delhi</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <Plane className="w-4 h-4 text-white rotate-45" />
                          <div className="w-12 h-0.5 bg-blue-300/40 my-0.5" />
                          <div className="text-[9px] text-blue-200">Non-stop • 2h 15m</div>
                        </div>
                        <div>
                          <div className="text-xl font-extrabold tracking-tight">BOM</div>
                          <div className="text-[10px] text-blue-200">Mumbai</div>
                        </div>
                      </div>
                    </div>

                    {/* Flight Result Card Mockup */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">IndiGo • 6E 204</span>
                        <span className="font-bold text-emerald-400">₹4,850</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>06:00 AM — 08:15 AM</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px]">Best Value</span>
                      </div>
                    </div>

                    {/* Seat Picker Visual Mini Mockup */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium">Seat Selection</span>
                        <span className="text-blue-400 font-mono text-[10px]">12A (Window)</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 pt-1">
                        {['10A', '10B', '10C', '10D', '10E', '10F', '11A', '11B', '11C', '11D', '11E', '11F', '12A', '12B', '12C', '12D', '12E', '12F'].map((seat, i) => (
                          <div
                            key={seat}
                            className={`h-5 rounded text-[8px] font-mono flex items-center justify-center ${
                              seat === '12A'
                                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500'
                                : i % 3 === 0
                                ? 'bg-slate-800 text-slate-500'
                                : 'bg-slate-800/60 text-slate-400'
                            }`}
                          >
                            {seat}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA prompt inside mockup */}
                    <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-center text-xs font-semibold text-blue-300 flex items-center justify-center gap-1.5">
                      <span>Interactive Mobile Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </SpotlightCard>
        )}

        {/* 2. Additional Future Real Projects Grid (Modular & Scalable) */}
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
                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h5 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-medium">
                    <span>View Case Study</span>
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
