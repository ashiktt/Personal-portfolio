import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { ProjectView } from '../projects/ProjectView';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0C1019] border border-slate-700/80 shadow-2xl shadow-black/90 z-10 text-slate-100"
        >
          {/* Sticky Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0C1019]/95 backdrop-blur-xl border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Badge variant="primary" size="sm">
                {project.category || 'Project'}
              </Badge>
              {project.projectType && (
                <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
                  {project.projectType}
                </span>
              )}
              {project.statusBadge && (
                <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-mono border border-amber-500/20">
                  {project.statusBadge}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body with Dynamic Project View */}
          <div className="p-6 sm:p-10">
            <ProjectView project={project} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
