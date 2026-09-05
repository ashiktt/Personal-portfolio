import React from 'react';
import { ExternalLink, Globe, FileText, Play } from 'lucide-react';
import { IconFigma, IconGithub } from '../ui/BrandIcons';
import { ProjectLinks as ProjectLinksType } from '../../types';

interface ProjectLinksProps {
  links?: ProjectLinksType;
  className?: string;
}

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ links, className = '' }) => {
  if (!links) return null;

  const hasAnyLink = Boolean(
    links.liveDemo ||
    links.prototype ||
    links.github ||
    links.figma ||
    links.behance ||
    links.documentation ||
    (links.customLinks && links.customLinks.length > 0)
  );

  if (!hasAnyLink) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 pt-2 ${className}`}>
      {/* Live Demo / Application */}
      {links.liveDemo && (
        <a
          href={links.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <Globe className="w-4 h-4" />
          <span>Live Demo</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      )}

      {/* Interactive Prototype */}
      {links.prototype && (
        <a
          href={links.prototype}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/15 text-purple-300 border border-purple-500/30 font-semibold text-xs sm:text-sm hover:bg-purple-600/25 transition-all hover:scale-[1.02]"
        >
          <Play className="w-4 h-4 text-purple-400" />
          <span>Interactive Prototype</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      )}

      {/* Figma File / Workspace */}
      {links.figma && (
        <a
          href={links.figma}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F24E1E]/15 text-[#ff744c] border border-[#F24E1E]/30 font-semibold text-xs sm:text-sm hover:bg-[#F24E1E]/25 transition-all hover:scale-[1.02]"
        >
          <IconFigma className="w-4 h-4" />
          <span>View in Figma</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      )}

      {/* GitHub Repository */}
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-xs sm:text-sm hover:border-slate-700 hover:bg-slate-800/80 transition-all hover:scale-[1.02]"
        >
          <IconGithub className="w-4 h-4" />
          <span>GitHub Repo</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      )}

      {/* Behance Showcase */}
      {links.behance && (
        <a
          href={links.behance}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/25 font-semibold text-xs sm:text-sm hover:bg-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <span>Behance</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      )}

      {/* Documentation / Case Study Readme */}
      {links.documentation && (
        <a
          href={links.documentation}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs sm:text-sm hover:border-slate-700 transition-all"
        >
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Documentation</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      )}

      {/* Custom Dynamic Links */}
      {links.customLinks?.map((custom, idx) => (
        <a
          key={idx}
          href={custom.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs sm:text-sm hover:border-slate-700 transition-all"
        >
          <span>{custom.label || 'Link'}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      ))}
    </div>
  );
};
