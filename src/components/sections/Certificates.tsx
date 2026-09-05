import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certificate } from '../../types';
import { SpotlightCard } from '../ui/SpotlightCard';

interface CertificatesProps {
  onSelectCertificate: (cert: Certificate) => void;
}

export const Certificates: React.FC<CertificatesProps> = ({ onSelectCertificate }) => {
  const { certificates } = usePortfolio();

  // Carousel ref & scroll state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to update arrow disabled states
  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    // Buffer of 6px for subpixel rounding
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    updateScrollState();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [certificates]);

  // Scroll navigation handlers (scrolls by approximately one card width or viewport step)
  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="certificates" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header with Title, Dynamic Count, and Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono w-fit">
              <Award className="w-3.5 h-3.5" />
              <span>CREDENTIALS &amp; LEARNING</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Certificates &amp; Certifications
              </h2>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs sm:text-sm font-mono text-slate-300 font-semibold shadow-sm">
                {certificates.length} {certificates.length === 1 ? 'Certificate' : 'Certificates'}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              Professional learning, certifications, and credentials.
            </p>
          </div>

          {/* Carousel Previous / Next Navigation Arrows */}
          {certificates.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                aria-label="Previous certificate"
                title="Previous certificate"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                aria-label="Next certificate"
                title="Next certificate"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Unified Horizontal Carousel Row */}
        {certificates.length > 0 ? (
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-4 px-1 -mx-1 scroll-smooth"
              tabIndex={0}
              aria-label="Certificates carousel"
            >
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="w-[82vw] sm:w-[320px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-[280px] max-w-[400px] shrink-0 snap-start flex flex-col"
                >
                  <SpotlightCard
                    onClick={() => onSelectCertificate(cert)}
                    className="p-5 sm:p-6 rounded-3xl bg-[#0E1322]/85 border border-slate-800/90 hover:border-blue-500/40 flex flex-col justify-between h-full group cursor-pointer space-y-4 transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-blue-500/10"
                  >
                    <div className="space-y-3.5">
                      {/* Certificate Image Preview */}
                      <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 flex items-center justify-center relative">
                        {cert.image ? (
                          <img
                            src={cert.image}
                            alt={cert.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-500 space-y-1.5 p-4 text-center">
                            <ImageIcon className="w-8 h-8 text-slate-600" />
                            <span className="text-[11px] font-mono text-slate-400">{cert.issuer}</span>
                          </div>
                        )}

                        {/* Issuer Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-blue-300 border border-blue-500/30 text-[10px] font-mono font-semibold">
                            {cert.issuer}
                          </span>
                        </div>

                        {/* Verified Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono font-medium text-emerald-300 shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Verified
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight line-clamp-2">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Issue Date */}
                      {cert.issueDate && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Issued {cert.issueDate}</span>
                        </div>
                      )}

                      {/* Skills Validated Chips */}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cert.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {cert.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                              +{cert.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Bottom CTA */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                      <span>{cert.credentialUrl ? 'View Credential' : 'View Certificate'}</span>
                      <div className="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400 transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <Award className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-semibold text-white">No certificates added yet</h4>
            <p className="text-xs text-slate-400">
              Certifications and learning credentials will appear here once published.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
