import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, CheckCircle2, Compass, Palette, Wrench, Code2 } from 'lucide-react';
import { IconFigma, IconGithub } from '../ui/BrandIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { SpotlightCard } from '../ui/SpotlightCard';

export const SkillsTools: React.FC = () => {
  const { skillGroups, tools } = usePortfolio();

  // Fallback / standard categories if skillGroups not customized
  const defaultCategories = [
    {
      id: 'group-ux-default',
      category: 'UX DESIGN',
      icon: <Compass className="w-5 h-5 text-blue-400" />,
      tagline: 'Research, flows & architecture',
      items: [
        'User Research',
        'User Flows',
        'Information Architecture',
        'Wireframing',
        'Usability Testing',
      ],
    },
    {
      id: 'group-ui-default',
      category: 'UI DESIGN',
      icon: <Palette className="w-5 h-5 text-indigo-400" />,
      tagline: 'Visual systems & prototyping',
      items: [
        'Visual Design',
        'Design Systems',
        'Responsive Design',
        'Interaction Design',
        'Prototyping',
      ],
    },
    {
      id: 'group-tools-default',
      category: 'TOOLS',
      icon: <Wrench className="w-5 h-5 text-sky-400" />,
      tagline: 'Design & frontend software',
      items: [
        'Figma',
        'FigJam',
        'HTML/CSS',
        'GitHub',
      ],
    },
  ];

  // Map dynamic skillGroups if available, or use the clean default categories
  const displayGroups = skillGroups && skillGroups.length > 0 ? skillGroups : defaultCategories;

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toUpperCase();
    if (name.includes('UX')) return <Compass className="w-5 h-5 text-blue-400" />;
    if (name.includes('UI')) return <Palette className="w-5 h-5 text-indigo-400" />;
    return <Wrench className="w-5 h-5 text-sky-400" />;
  };

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SKILLS &amp; TOOLS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Skills &amp; Capabilities
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            Core user experience design methods, visual interface design principles, and practical software tools.
          </p>
        </div>

        {/* Clean 3-Column Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayGroups.map((group, idx) => (
            <SpotlightCard
              key={group.id || idx}
              className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/80 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between h-full space-y-6"
            >
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                      {getCategoryIcon(group.category)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        {group.category}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {group.items.length} Core Areas
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills Item List */}
                <ul className="space-y-3 pt-2">
                  {group.items.map((skill, sIdx) => (
                    <li
                      key={sIdx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-blue-500/30 transition-all group"
                    >
                      <span className="text-xs sm:text-sm text-slate-200 font-medium group-hover:text-blue-200 transition-colors">
                        {skill}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/80 shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          ))}
        </div>

      </div>
    </section>
  );
};
