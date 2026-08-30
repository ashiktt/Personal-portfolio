import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, ArrowUpRight, Sparkles, Shield } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface NavbarProps {
  onResumeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onResumeClick }) => {
  const { profile, isAdminAuthenticated } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['home', 'about', 'skills', 'projects', 'certificates', 'contact'];
      const scrollPosition = window.scrollY + 200;

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

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Certificates', href: '#certificates', id: 'certificates' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-[#090A0F]/80 backdrop-blur-xl border-b border-white/[0.07] shadow-xl shadow-black/40'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Live Status */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="group flex items-center gap-3"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 text-white font-bold text-base shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            AR
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors tracking-tight text-sm sm:text-base">
              {profile.name}
            </span>
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {profile.role}
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

        {/* Right CTA Actions */}
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

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#121624]/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-slate-800 bg-[#090A0F]/95 backdrop-blur-2xl overflow-hidden px-4 py-6"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onResumeClick();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-sm shadow-lg shadow-blue-600/30"
                >
                  <FileText className="w-4 h-4" />
                  View & Download Resume
                </button>

                {isAdminAuthenticated && (
                  <a
                    href="/admin"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-sm font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
