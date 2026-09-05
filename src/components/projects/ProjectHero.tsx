import React from 'react';
import { Clock, Calendar, User, Users, CheckCircle2, Sparkles, Folder } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';

interface ProjectHeroProps {
  project: Project;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      {/* Category & Status Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge variant="primary" size="sm">
          {project.category || 'Project'}
        </Badge>

        {project.projectType && (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
            {project.projectType}
          </span>
        )}

        {project.status && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${
              project.status === 'Completed'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                : project.status === 'In Progress'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                : project.status === 'Planning'
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/25'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {project.statusBadge || project.status}
          </span>
        )}
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-3">
        {project.subtitle && (
          <p className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
            {project.subtitle}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          {project.title}
        </h1>
        {project.shortDescription && (
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl pt-1">
            {project.shortDescription}
          </p>
        )}
      </div>

      {/* Metadata Info Card (Role, Duration, Date, Team) */}
      {(project.role || project.duration || project.date || project.team) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {project.role && (
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Role
              </span>
              <p className="font-semibold text-white truncate">{project.role}</p>
            </div>
          )}

          {project.duration && (
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Duration
              </span>
              <p className="font-semibold text-white truncate">{project.duration}</p>
            </div>
          )}

          {project.date && (
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Date
              </span>
              <p className="font-semibold text-white truncate">{project.date}</p>
            </div>
          )}

          {project.team && (
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Team
              </span>
              <p className="font-semibold text-white truncate">{project.team}</p>
            </div>
          )}
        </div>
      )}

      {/* Tools & Tags */}
      {project.tools && project.tools.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20"
            >
              {tool}
            </span>
          ))}
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
