import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Copy, Check, Sparkles, Clock } from 'lucide-react';
import { IconLinkedin, IconGithub } from '../ui/BrandIcons';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLiveTime } from '../../hooks/useLiveTime';
import { SpotlightCard } from '../ui/SpotlightCard';
import { insertContactMessage } from '../../lib/supabase';

interface ContactProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const { profile, addMessage } = usePortfolio();
  const { timeString } = useLiveTime('Asia/Kolkata');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopiedEmail, setIsCopiedEmail] = useState(false);
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setIsCopiedEmail(true);
      setTimeout(() => setIsCopiedEmail(false), 2000);
      onShowToast('success', 'Email Copied to Clipboard!', text);
    } else {
      setIsCopiedPhone(true);
      setTimeout(() => setIsCopiedPhone(false), 2000);
      onShowToast('success', 'Phone Number Copied!', text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      onShowToast('error', 'Missing Information', 'Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Immediately store in Supabase Cloud Database (for online Admin Inbox)
      await insertContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Portfolio Inquiry',
        message: formData.message.trim(),
      });

      // 2. Store in local state
      addMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Portfolio Inquiry',
        message: formData.message.trim(),
      });

      // 3. Direct Email Dispatch to your Gmail address
      const targetEmail = profile.email || 'tusarashikur@gmail.com';
      try {
        await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            _subject: `New Portfolio Message from ${formData.name.trim()}: ${formData.subject.trim() || 'Inquiry'}`,
            Name: formData.name.trim(),
            Email: formData.email.trim(),
            Subject: formData.subject.trim() || 'Portfolio Inquiry',
            Message: formData.message.trim(),
            _template: 'table',
          }),
        });
      } catch (mailErr) {
        console.warn('Direct email dispatch note:', mailErr);
      }

      // 4. Optional EmailJS backup if configured
      const { serviceId, templateId, publicKey } = profile.emailJsConfig || {};
      const isEmailJsConfigured =
        serviceId &&
        templateId &&
        publicKey &&
        serviceId !== 'service_contact' &&
        publicKey !== 'user_public_key';

      if (isEmailJsConfigured) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              from_name: formData.name,
              reply_to: formData.email,
              subject: formData.subject || 'Portfolio Inquiry',
              message: formData.message,
              to_name: profile.name,
            },
            publicKey
          );
        } catch (ejErr) {
          console.warn('EmailJS backup error:', ejErr);
        }
      }

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#60a5fa', '#38bdf8', '#818cf8'],
      });

      onShowToast(
        'success',
        'Message Sent Successfully!',
        `Thank you ${formData.name}. Your inquiry is recorded in Ashikur's inbox.`
      );

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      console.error('Contact Form Submission Error:', err);
      onShowToast(
        'error',
        'Failed to Send Message',
        'Please email directly at tusarashikur@gmail.com.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <Mail className="w-3.5 h-3.5" />
            <span>LET&apos;S CONNECT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Get In Touch
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            Currently open to Product Design internships, freelance UI/UX projects, and design systems collaboration.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Contact Details & Socials */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Email Card */}
            <SpotlightCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono">Direct Email</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-blue-400 transition-colors mt-0.5 block break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(profile.email, 'email')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Copy email"
                  aria-label="Copy email to clipboard"
                >
                  {isCopiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </SpotlightCard>

            {/* Phone Card */}
            <SpotlightCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono">Phone Number</div>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-emerald-400 transition-colors mt-0.5 block font-mono"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(profile.phone, 'phone')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Copy phone"
                  aria-label="Copy phone number to clipboard"
                >
                  {isCopiedPhone ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </SpotlightCard>

            {/* Location & Timezone Card */}
            <SpotlightCard className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">Location &amp; Base</div>
                  <div className="text-sm sm:text-base font-semibold text-white mt-0.5">
                    {profile.location}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>IST (UTC+5:30) • {timeString || 'Live'}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Social Network Cards */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-[#0E1322]/70 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-850 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-blue-600/10 text-[#0A66C2] group-hover:scale-110 transition-transform">
                  <IconLinkedin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">Connect</div>
                  <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    LinkedIn
                  </div>
                </div>
              </a>

              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-[#0E1322]/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-850 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-slate-800 text-white group-hover:scale-110 transition-transform">
                  <IconGithub className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">Explore Code</div>
                  <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    GitHub
                  </div>
                </div>
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl shadow-black/60 relative overflow-hidden">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Send a Message</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Have a design opportunity, questions about a case study, or looking for an intern? Send a message below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Your Name <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Email Address <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UI/UX Internship Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Message <span className="text-blue-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your project, timeline, or team goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
