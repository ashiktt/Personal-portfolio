import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FileText, Sparkles, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';
import { IconLinkedin, IconGithub } from '../ui/BrandIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { DEFAULT_FALLBACK_AVATAR } from '../../lib/supabase';

interface HeroProps {
  onResumeClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onResumeClick }) => {
  const { profile } = usePortfolio();

  // 3D Tilt Motion Values
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 260,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 260,
    damping: 20,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const currentMouseX = e.clientX - rect.left;
    const currentMouseY = e.clientY - rect.top;

    // Normalized from -0.5 to 0.5
    mouseX.set((currentMouseX / width) - 0.5);
    mouseY.set((currentMouseY / height) - 0.5);

    setSpotlightPos({ x: currentMouseX, y: currentMouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Heading, Role, Intro, Socials, Resume */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start space-y-6 text-left"
        >
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs sm:text-sm font-medium backdrop-blur-md shadow-sm shadow-blue-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{profile.availability}</span>
          </div>

          {/* Main Headings */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              {profile.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                {profile.role}
              </span>
            </div>
          </div>

          {/* Hero Headline */}
          <p className="text-base sm:text-xl lg:text-2xl font-medium text-slate-200 leading-snug max-w-2xl">
            &ldquo;{profile.heroHeadline}&rdquo;
          </p>

          {/* Hero Short Intro */}
          <p className="text-xs sm:text-base text-slate-400 leading-relaxed max-w-xl">
            {profile.heroIntro}
          </p>

          {/* Action Buttons: Resume + LinkedIn & GitHub */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
            <button
              onClick={onResumeClick}
              className="group flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all border border-blue-400/30"
            >
              <FileText className="w-4 h-4 text-blue-100 group-hover:rotate-6 transition-transform" />
              <span>View &amp; Download Resume</span>
              <ArrowUpRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <div className="flex items-center gap-3">
              {/* LinkedIn Button */}
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 hover:bg-slate-850 transition-all font-medium text-sm shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <IconLinkedin className="w-4 h-4 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </a>

              {/* GitHub Button */}
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition-all font-medium text-sm shadow-sm"
                aria-label="GitHub Profile"
              >
                <IconGithub className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics / Focus Area Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              UI / UX Design
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Product Prototyping
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Design Systems
            </span>
          </div>
        </motion.div>

        {/* Right Column: Interactive 3D Animated Profile Photo Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center lg:justify-end relative perspective-[1200px]"
        >
          <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
            
            {/* Ambient Background Aura Glow (Reacts to Hover) */}
            <motion.div
              animate={{
                scale: isHovered ? 1.15 : 1,
                opacity: isHovered ? 0.95 : 0.65,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-blue-600/35 via-indigo-600/25 to-sky-400/25 blur-2xl -z-10"
            />

            {/* 3D Interactive Container */}
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative rounded-3xl bg-[#0E1322]/85 border border-slate-700/60 hover:border-blue-500/50 p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/80 transition-colors duration-300 group cursor-pointer overflow-hidden"
            >
              {/* Pointer Follow Spotlight Layer */}
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-30"
                style={{
                  opacity: isHovered ? 1 : 0,
                  background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(59, 130, 246, 0.18), transparent 70%)`,
                }}
              />

              {/* Light Sweep Reflection Angle Glint */}
              <div
                className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden rounded-3xl"
              >
                <div
                  className="w-[200%] h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.08) 46%, rgba(96, 165, 250, 0.16) 50%, transparent 56%)',
                  }}
                />
              </div>
              
              {/* Profile Avatar Frame with Smooth Zoom & Parallax */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/4.4] bg-gradient-to-b from-[#161D31] to-[#0A0D17] border border-slate-700/50 group-hover:border-blue-500/40 flex items-center justify-center transition-all duration-500 shadow-inner">
                
                {/* Photo Image */}
                <img
                  src={profile.avatarUrl || DEFAULT_FALLBACK_AVATAR}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-95 group-hover:contrast-[1.08] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Subtle Dynamic Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1322] via-black/20 to-transparent opacity-85 group-hover:opacity-75 transition-opacity duration-500" />

                {/* Floating Interactive Role Pill */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-[#0A0D17]/85 group-hover:bg-[#0A0D17]/95 backdrop-blur-md border border-white/10 group-hover:border-blue-400/40 shadow-xl group-hover:shadow-blue-500/20 group-hover:-translate-y-1 transition-all duration-300 z-10">
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                      <span>{profile.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[11px] text-blue-400 group-hover:text-blue-300 font-mono transition-colors">
                      {profile.role}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300 group-hover:text-blue-200 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
