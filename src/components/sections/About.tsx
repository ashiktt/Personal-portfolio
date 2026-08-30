import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Cpu, Compass, GraduationCap, Calendar, MapPin, BookOpen } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SpotlightCard } from '../ui/SpotlightCard';

export const About: React.FC = () => {
  const { profile } = usePortfolio();

  const principles = [
    {
      icon: <Compass className="w-5 h-5 text-blue-400" />,
      title: 'User-Centered Design',
      description: 'Understanding real user needs and crafting clear user flows, wireframes, and intuitive interaction models.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-sky-400" />,
      title: 'CSE + Design Foundations',
      description: 'Applying Computer Science fundamentals to create practical, implementable digital interfaces and design assets.',
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      title: 'Clean Visual Systems',
      description: 'Designing component-driven interfaces in Figma with clear typography, consistent spacing, and responsive layouts.',
    },
  ];

  const degree = profile.educationDegree || 'B.Tech in Computer Science & Engineering';
  const institute = profile.educationInstitute || 'Gulzar Group of Institutes';
  const year = profile.educationYear || '2023–2027';

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Title Header */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT ME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            About Me
          </h2>
        </div>

        {/* Narrative & Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#0E1322]/75 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                I'm currently pursuing a B.Tech in Computer Science &amp; Engineering at Gulzar Group of Institutes (2023–2027), while building my skills in UI/UX design, interaction design, and frontend development.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                I enjoy turning complex problems into clear, intuitive digital experiences through user flows, wireframing, prototyping, and visual design.
              </p>
            </div>
            
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-200 font-medium">UI/UX Design</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-slate-200 font-medium">Interaction Design</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-slate-200 font-medium">Frontend Development</span>
              </div>
            </div>
          </div>

          {/* Education & University Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111827]/90 to-[#0A0D17]/90 border border-blue-500/25 backdrop-blur-xl shadow-xl space-y-6 relative overflow-hidden">
            {/* Ambient Background Glow Accent */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>CURRENT EDUCATION</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Undergraduate</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {degree}
                </h3>
                <p className="text-sm font-semibold text-blue-400 mt-1">
                  {institute}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Building foundational knowledge in Computer Science &amp; Engineering while developing practical skills in user-centered design, prototyping, and modern interface development.
              </p>
            </div>

            {/* University Metadata Chips */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Duration</div>
                  <div className="font-semibold text-white">{year}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Location</div>
                  <div className="font-semibold text-white truncate">{profile.location || 'Ludhiana, Punjab, India'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Design Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((p, idx) => (
            <SpotlightCard key={idx} className="p-6 sm:p-7">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 shadow-md">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};
