import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, ArrowUpRight, Shield, Sparkles, Compass, Layers, FolderGit2, Award, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface NavbarProps {
  onResumeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onResumeClick }) => {
  const { profile, isAdminAuthenticated } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Track active section and scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'skills', 'projects', 'certificates', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home', icon: <Sparkles className="w-4 h-4 text-blue-400" /> },
    { name: 'About', href: '#about', id: 'about', icon: <Compass className="w-4 h-4 text-sky-400" /> },
    { name: 'Skills', href: '#skills', id: 'skills', icon: <Layers className="w-4 h-4 text-indigo-400" /> },
    { name: 'Projects', href: '#projects', id: 'projects', icon: <FolderGit2 className="w-4 h-4 text-emerald-400" /> },
    { name: 'Certificates', href: '#certificates', id: 'certificates', icon: <Award className="w-4 h-4 text-amber-400" /> },
    { name: 'Contact', href: '#contact', id: 'contact', icon: <Mail className="w-4 h-4 text-rose-400" /> },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navHeight = 74;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#090A0F]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-xl shadow-black/60'
          : 'py-4 sm:py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="group flex items-center gap-2.5 sm:gap-3 shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            AR
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors tracking-tight text-sm sm:text-base leading-tight">
              {profile.name}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center gap-1.5 leading-tight mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {profile.role.split('•')[0].trim()}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121624]/70 border border-white/[0.08] px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner shadow-white/[0.02]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`relative px-4 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full -z-10 shadow-sm shadow-blue-500/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right Desktop CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAdminAuthenticated && (
            <a
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </a>
          )}

          <button
            onClick={onResumeClick}
            className="group relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-blue-400/30"
          >
            <FileText className="w-3.5 h-3.5 text-blue-200 group-hover:rotate-6 transition-transform" />
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger / Close Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              mobileMenuOpen
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30'
                : 'bg-[#121624]/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Full Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[60px] sm:top-[70px] bg-black/80 backdrop-blur-md z-30 md:hidden"
            />

            {/* Slide Down Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-[60px] sm:top-[70px] left-0 right-0 bg-[#0A0D17]/98 border-b border-slate-800/90 backdrop-blur-2xl z-40 md:hidden max-h-[calc(100vh-80px)] overflow-y-auto px-4 py-5 shadow-2xl shadow-black/90"
            >
              <div className="flex flex-col gap-1.5 max-w-lg mx-auto">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.href)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                          : 'text-slate-200 hover:bg-slate-800/60 active:bg-slate-800/80 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                          {link.icon}
                        </span>
                        <span className="font-semibold">{link.name}</span>
                      </div>
                      {isActive && (
                        <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-4 mt-2 border-t border-slate-800/90 flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onResumeClick();
                    }}
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all border border-blue-400/30"
                  >
                    <FileText className="w-4 h-4 text-blue-200" />
                    <span>View &amp; Download Resume</span>
                    <ArrowUpRight className="w-4 h-4 text-blue-200" />
                  </button>

                  {isAdminAuthenticated && (
                    <a
                      href="/admin"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-sm font-medium active:bg-indigo-500/20 transition-all"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
