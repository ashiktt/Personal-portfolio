import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Download, 
  FileText, 
  Eye, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { IconLinkedin, IconGithub } from '../ui/BrandIcons';
import { usePortfolio } from '../../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { profile, publishedProjects, certificates, tools, skillGroups } = usePortfolio();
  const [viewMode, setViewMode] = useState<'interactive' | 'pdf'>('interactive');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const hasUploadedResume = Boolean(profile.resumeUrl && profile.resumeUrl.trim().length > 0 && profile.resumeUrl !== '#resume');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:p-0 print:static">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md print:hidden"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0F131D] border border-slate-700/80 shadow-2xl shadow-black/90 z-10 text-slate-100 print:max-w-none print:max-h-none print:border-none print:bg-white print:text-black print:overflow-visible"
        >
          {/* Top Bar Action Controls */}
          <div className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3.5 bg-[#0F131D]/95 backdrop-blur-xl border-b border-slate-800 print:hidden">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Resume Preview</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  {profile.name}
                </span>
              </div>

              {/* Toggle View Mode if custom resume file exists */}
              {hasUploadedResume && (
                <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <button
                    onClick={() => setViewMode('interactive')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      viewMode === 'interactive'
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Interactive
                  </button>
                  <button
                    onClick={() => setViewMode('pdf')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      viewMode === 'pdf'
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Official PDF
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {/* Direct Download Button for Official Uploaded PDF */}
              {hasUploadedResume ? (
                <a
                  href={profile.resumeUrl}
                  download={profile.resumeFileName || 'Ashikur_Rahman_Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official PDF</span>
                </a>
              ) : (
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              )}

              {hasUploadedResume && (
                <button
                  onClick={handlePrint}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Print view"
                >
                  <Printer className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Close resume modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conditional View: Embedded Official PDF or Interactive Case Study Resume */}
          {hasUploadedResume && viewMode === 'pdf' ? (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs text-blue-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Official Document: {profile.resumeFileName || 'Ashikur_Rahman_Resume.pdf'}</span>
                </span>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white flex items-center gap-1"
                >
                  <span>Open Fullscreen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="w-full h-[70vh] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <iframe
                  src={profile.resumeUrl}
                  title="Official Resume PDF"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          ) : (
            /* Interactive Resume Body */
            <div className="p-6 sm:p-10 space-y-8 print:p-0 print:text-black">
              {/* Header / Brand */}
              <div className="border-b border-slate-800 pb-6 print:border-gray-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white print:text-black tracking-tight">
                      {profile.name}
                    </h1>
                    <p className="text-lg font-medium text-blue-400 print:text-blue-700 mt-1">
                      {profile.role}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-slate-300 print:text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400 print:text-black" />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400 print:text-black" />
                      {profile.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 print:text-black" />
                      {profile.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Narrative / Professional Profile */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-800">
                  Professional Profile
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 print:text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.aboutText}
                </p>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Education
                </h2>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 print:bg-gray-50 print:border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-semibold text-white print:text-black">
                      {profile.educationDegree || 'B.Tech in Computer Science & Engineering'}
                    </h3>
                    <span className="text-xs text-slate-400 print:text-gray-600 font-mono">
                      {profile.educationYear || '2023–2027'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-300 print:text-blue-700 mt-1">
                    {profile.educationInstitute || 'Gulzar Group of Institutes'} • {profile.location}
                  </p>
                  <p className="text-xs text-slate-300 print:text-gray-700 mt-2 leading-relaxed">
                    Developing foundational knowledge in Computer Science &amp; Engineering while actively building user flows, wireframes, and prototypes for digital products.
                  </p>
                </div>
              </div>

              {/* Core Skills & Tools */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-800">
                  Core Competencies &amp; Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 print:bg-transparent print:border-gray-300">
                    <div className="font-semibold text-white print:text-black mb-1">Design &amp; Engineering Stack</div>
                    <div className="text-slate-300 print:text-gray-700">
                      {tools.map((t) => t.name).join(', ')}
                    </div>
                  </div>
                  {skillGroups.map((g) => (
                    <div key={g.id} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 print:bg-transparent print:border-gray-300">
                      <div className="font-semibold text-white print:text-black mb-1">{g.category}</div>
                      <div className="text-slate-300 print:text-gray-700">
                        {g.items.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Case Studies */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  Featured UI/UX Case Studies
                </h2>
                <div className="space-y-3">
                  {publishedProjects.slice(0, 3).map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 print:bg-gray-50 print:border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="font-semibold text-white print:text-black text-sm">{proj.title}</div>
                        <span className="text-[11px] text-blue-300 print:text-blue-700 font-mono">{proj.category}</span>
                      </div>
                      <p className="text-xs text-slate-300 print:text-gray-700 mt-1 leading-relaxed">
                        {proj.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {proj.tools.map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 print:bg-gray-200 print:text-black">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {certificates.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Certifications &amp; Credentials
                  </h2>
                  <div className="space-y-2 text-xs">
                    {certificates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-slate-800/40 print:border-gray-200">
                        <div>
                          <span className="font-semibold text-white print:text-black">{c.title}</span>
                          <span className="text-slate-400 print:text-gray-600"> — {c.issuer}</span>
                        </div>
                        <span className="text-slate-400 print:text-gray-500 font-mono text-[11px]">{c.issueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
