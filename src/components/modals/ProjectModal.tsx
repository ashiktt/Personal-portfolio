import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Layers, 
  Target, 
  Lightbulb, 
  Sparkles, 
  Plane, 
  Users, 
  Layout, 
  Palette, 
  Smartphone, 
  Compass, 
  BookOpen,
  ArrowDown
} from 'lucide-react';
import { IconFigma, IconGithub } from '../ui/BrandIcons';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';

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

  const cs = project.caseStudy;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
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
                {project.category}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">Case Study</span>
              {project.statusBadge && (
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-mono border border-amber-500/20">
                  {project.statusBadge}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close case study modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-10 space-y-12">
            
            {/* Title, Subtitle, & Tagline */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  {project.subtitle || 'UI/UX Design • Mobile App • Case Study'}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  {project.title}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
                {project.shortDescription}
              </p>

              {/* Tools Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual Project Status Tracker (Research to Usability Testing) */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Project Status &amp; Stage Progress
                </h3>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Active In-Progress Project
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { stage: '01. Research & Discovery', status: 'Completed' },
                  { stage: '02. User Flow Architecture', status: 'Completed' },
                  { stage: '03. Low-Fi Wireframes', status: 'Completed' },
                  { stage: '04. High-Fidelity UI Design', status: 'In Progress' },
                  { stage: '05. Interactive Prototyping', status: 'In Progress' },
                  { stage: '06. Usability Testing', status: 'Planned' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-slate-300">{item.stage}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        item.status === 'Completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'In Progress'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Links */}
            {cs?.figmaUrl && (
              <div className="flex flex-wrap gap-3">
                <a
                  href={cs.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F24E1E]/15 text-[#ff744c] border border-[#F24E1E]/30 font-medium text-xs sm:text-sm hover:bg-[#F24E1E]/25 transition-colors"
                >
                  <IconFigma className="w-4 h-4" />
                  <span>View in Figma</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {cs.githubUrl && (
                  <a
                    href={cs.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium text-xs sm:text-sm hover:border-slate-700 transition-colors"
                  >
                    <IconGithub className="w-4 h-4" />
                    <span>Project Repository</span>
                  </a>
                )}
              </div>
            )}

            {/* Structured 10-Point Case Study Content */}
            <div className="space-y-12 pt-4 border-t border-slate-800">
              
              {/* 01 — Overview */}
              <section className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                  01 — Overview
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Project Overview</h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {cs?.overview || 'The Travel Booking App is a mobile experience designed to simplify searching, comparing, and booking flights through a clean, intuitive, and sequential user flow.'}
                </p>
              </section>

              {/* 02 — Problem & 03 — Goal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 02 — Problem */}
                <section className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    02 — The Problem
                  </div>
                  <h4 className="text-lg font-bold text-white">Friction in Flight Booking</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {cs?.problem || 'Many mobile flight booking apps suffer from cluttered filters, confusing layout steps, and hidden fees at final checkout, leading to user fatigue and booking drop-offs.'}
                  </p>
                </section>

                {/* 03 — Goal */}
                <section className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    03 — Project Goal
                  </div>
                  <h4 className="text-lg font-bold text-white">Seamless 7-Step Journey</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {cs?.goal || 'Design an intuitive mobile user journey that makes flight discovery transparent, simplifies cabin seat selection, and facilitates checkout in 7 clear steps.'}
                  </p>
                </section>
              </div>

              {/* 04 — Target Users */}
              <section className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  04 — Target Users
                </div>
                <h3 className="text-xl font-bold text-white">Who We Are Designing For</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-white text-sm">Students &amp; Budget Travelers</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Need transparent price comparisons, clear luggage rules, and quick date flexibility without confusing upsells.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-white text-sm">Frequent Mobile Bookers</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Value speed, saved passenger profiles, rapid seat selection, and instant digital boarding passes.
                    </p>
                  </div>
                </div>
              </section>

              {/* 05 — User Flow */}
              <section className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  05 — User Flow
                </div>
                <h3 className="text-xl font-bold text-white">7-Step Sequential Booking Flow</h3>
                
                {/* Horizontal / Vertical Stepper Diagram */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2 overflow-x-auto py-2">
                    {[
                      'Search',
                      'Results',
                      'Flight Details',
                      'Booking Details',
                      'Seat Selection',
                      'Payment',
                      'Confirmation',
                    ].map((step, idx, arr) => (
                      <React.Fragment key={step}>
                        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-xs font-semibold text-blue-200 shrink-0 shadow-sm">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                        {idx < arr.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden md:block" />
                        )}
                        {idx < arr.length - 1 && (
                          <ArrowDown className="w-4 h-4 text-slate-500 shrink-0 md:hidden" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-2">
                    Each stage maintains a continuous progress breadcrumb so users always understand where they are in the booking lifecycle.
                  </p>
                </div>
              </section>

              {/* 06 — Wireframes */}
              <section className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  06 — Low-Fidelity Wireframes
                </div>
                <h3 className="text-xl font-bold text-white">Layout Structure &amp; Information Hierarchy</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: '1. Search & City Selector',
                      desc: 'Origin/destination swap button, calendar bottom-sheet trigger, and passenger counter placed in prime thumb reach.',
                    },
                    {
                      title: '2. Comparison Results List',
                      desc: 'Flight cards displaying airline, departure/arrival timestamps, layovers, and bold total fares.',
                    },
                    {
                      title: '3. Interactive Seat Map',
                      desc: 'Vertical 6-across cabin layout with standard, extra-legroom, and exit-row color coding.',
                    },
                    {
                      title: '4. Summary & Ticket Confirmation',
                      desc: 'Review breakdown, payment methods, and clean digital boarding pass with scannable barcode.',
                    },
                  ].map((wf, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2"
                    >
                      <div className="text-xs font-bold text-blue-300">{wf.title}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{wf.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 07 — Design Decisions */}
              <section className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  07 — Design Decisions
                </div>
                <h3 className="text-xl font-bold text-white">Key UX &amp; Visual Choices</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Thumb-Zone Optimization',
                      desc: 'Positioned all primary CTA buttons in the bottom 30% of the screen for natural one-handed mobile ergonomics.',
                    },
                    {
                      title: 'Price Transparency',
                      desc: 'Displayed total fares including mandatory taxes from the search results screen to avoid drop-offs during payment.',
                    },
                    {
                      title: 'Scannable Flight Timelines',
                      desc: 'Used visual horizontal connector lines between airport codes to make non-stop vs layover flights instantly distinguishable.',
                    },
                    {
                      title: 'Accessible Touch Targets',
                      desc: 'Enforced minimum 44×44pt tap targets across calendar dates, seat buttons, and filter toggles.',
                    },
                  ].map((dd, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2"
                    >
                      <div className="text-xs font-bold text-white">{dd.title}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{dd.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 08 — High-Fidelity UI (In Progress) */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    08 — High-Fidelity UI Screens
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-xs font-mono border border-blue-500/20">
                    In Progress in Figma
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Visual Interface Mockups</h3>

                {/* Mobile UI Screen Mockup Showcase Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Flight Search Screen',
                      desc: 'Departure & return city selector, interactive calendar, class selector, and recent search tags.',
                    },
                    {
                      title: 'Flight Results & Filter Sheet',
                      desc: 'Scannable airline cards with duration badges, direct flight badges, and price sorting.',
                    },
                    {
                      title: 'Aircraft Seat Selector',
                      desc: 'Visual plane cabin map with color-coded seat tiers and real-time total price counter.',
                    },
                    {
                      title: 'Boarding Pass Confirmation',
                      desc: 'Digital ticket view with passenger name, seat number, gate details, and QR barcode.',
                    },
                  ].map((screen, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{screen.title}</span>
                        <span className="text-[10px] font-mono text-blue-400">Mobile Screen {idx + 1}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{screen.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 09 — Prototype (In Progress) */}
              <section className="space-y-3 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase tracking-wider text-blue-300 font-bold">
                    09 — Interactive Prototype
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-mono">
                    In Progress
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Figma Prototype &amp; Micro-Interactions</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Currently linking smart-animate transitions in Figma for city swapping, date-picker slide-ins, seat selection haptics, and payment confirmation animations.
                </p>
              </section>

              {/* 10 — Learnings */}
              <section className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  10 — Key Learnings
                </div>
                <h3 className="text-xl font-bold text-white">Reflections &amp; Insights</h3>

                <div className="space-y-3">
                  {[
                    'Designing for mobile viewports requires ruthless prioritization of information to prevent cognitive overload during multi-step tasks.',
                    'Complex transactional forms feel faster and more approachable when broken down into sequential, progressive disclosure steps.',
                    'Building modular auto-layout component variants (FlightCard, SeatMatrix, PriceSummary) in Figma ensures consistent design systems and smooth developer handoff.',
                  ].map((learning, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs sm:text-sm text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{learning}</span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
