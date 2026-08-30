import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certificate } from '../../types';
import { SpotlightCard } from '../ui/SpotlightCard';

interface CertificatesProps {
  onSelectCertificate: (cert: Certificate) => void;
}

export const Certificates: React.FC<CertificatesProps> = ({ onSelectCertificate }) => {
  const { certificates } = usePortfolio();

  return (
    <section id="certificates" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>CREDENTIALS &amp; LEARNING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Certifications &amp; Accreditations
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            Continuous professional validation in UX research, human-computer interaction, and design systems from recognized global institutions.
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0E1322]/40 border border-slate-800 text-center text-slate-400">
            No certificates added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
              >
                <SpotlightCard
                  onClick={() => onSelectCertificate(cert)}
                  className="flex flex-col justify-between h-full group cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Certificate Thumbnail Preview */}
                    <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border-b border-slate-800">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E121D] via-transparent to-transparent opacity-60" />

                      {/* Verified Badge */}
                      <div className="absolute top-3.5 right-3.5">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090A0F]/85 backdrop-blur-md border border-emerald-500/30 text-[11px] font-medium text-emerald-300 shadow-md">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-blue-400 font-mono">
                          {cert.issuer}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mt-1">
                          {cert.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Issued {cert.issueDate}</span>
                      </div>

                      {/* Skills Validated Preview */}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {cert.skills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-900/80 text-slate-300 border border-slate-800"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300">
                      View Credential
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
