import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Award, Calendar, CheckCircle } from 'lucide-react';
import { Certificate } from '../../types';
import { Badge } from '../ui/Badge';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (certificate) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#0C1019] border border-slate-700/80 shadow-2xl shadow-black/80 z-10 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0C1019]/90">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white">Verified Credential</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Certificate Preview Image */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[16/10] relative shadow-lg">
              <img
                src={certificate.image}
                alt={certificate.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{certificate.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="font-semibold text-blue-300">{certificate.issuer}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {certificate.issueDate}
                  </span>
                </div>
              </div>

              {certificate.skills && certificate.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Skills Validated
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {certificate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" size="sm" icon={<CheckCircle className="w-3 h-3 text-emerald-400" />}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {certificate.credentialUrl && (
                <div className="pt-2">
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-colors"
                  >
                    <span>View Official Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
