import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { IconLinkedin, IconGithub } from '../ui/BrandIcons';
import { usePortfolio } from '../../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-[#07080C] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Copyright (Strict: © 2026 Ashikur Rahman, no Lovable) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20">
              AR
            </div>
            <span className="text-sm font-semibold text-slate-200">{profile.name}</span>
          </div>
          <span className="hidden sm:inline text-slate-700">•</span>
          <p className="text-xs text-slate-400 font-normal">
            &copy; 2026 Ashikur Rahman. All rights reserved.
          </p>
        </div>

        {/* Social Links & Back to Top */}
        <div className="flex items-center gap-4">
          <a
            href={profile.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-slate-800 transition-all"
            aria-label="LinkedIn Profile"
          >
            <IconLinkedin className="w-4 h-4" />
          </a>

          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800 transition-all"
            aria-label="GitHub Profile"
          >
            <IconGithub className="w-4 h-4" />
          </a>

          {/* Discreet Admin Entrance (Visible unless hidden by owner in settings) */}
          {!profile.hideAdminFooterLink && (
            <a
              href="/admin/login"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all"
              title="Owner Portal"
              aria-label="Admin Login"
            >
              <Lock className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
