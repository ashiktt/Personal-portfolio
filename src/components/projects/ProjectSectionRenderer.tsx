import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowDown, 
  Clock, 
  Quote as QuoteIcon, 
  ExternalLink, 
  Copy, 
  Check, 
  Play, 
  Sparkles,
  Layers,
  Code2,
  Image as ImageIcon
} from 'lucide-react';
import { ProjectSection, ProjectSectionItem, ProjectSectionImage } from '../../types';

interface ProjectSectionRendererProps {
  section: ProjectSection;
  index: number;
}

export const ProjectSectionRenderer: React.FC<ProjectSectionRendererProps> = ({ section, index }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!section.visible) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Helper to format section index number (e.g., 01, 02)
  const indexFormatted = String(index + 1).padStart(2, '0');

  return (
    <section id={`section-${section.id}`} className="space-y-4 pt-4 border-t border-slate-800/80">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
            {indexFormatted} — {section.subtitle || section.title}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {section.title}
        </h3>
      </div>

      {/* Main Content Paragraph (if present) */}
      {section.content && (
        <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
          {section.content}
        </div>
      )}

      {/* Render Sub-Layout Based on Section Type */}

      {/* 1. Bullet List */}
      {section.type === 'bullet-list' && section.items && section.items.length > 0 && (
        <ul className="space-y-3 pt-2">
          {section.items.map((item, iIdx) => {
            const text = typeof item === 'string' ? item : item.title || item.desc || '';
            return (
              <li key={iIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">{text}</span>
              </li>
            );
          })}
        </ul>
      )}

      {/* 2. Numbered List */}
      {section.type === 'numbered-list' && section.items && section.items.length > 0 && (
        <div className="space-y-3 pt-2">
          {section.items.map((item, iIdx) => {
            const title = typeof item === 'string' ? item : item.title;
            const desc = typeof item === 'object' ? item.desc : null;
            return (
              <div key={iIdx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70">
                <span className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                  {iIdx + 1}
                </span>
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-semibold text-white">{title}</span>
                  {desc && <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. User Flow (Visual Stepper) */}
      {section.type === 'user-flow' && section.items && section.items.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-start gap-2.5 overflow-x-auto py-2">
            {section.items.map((item, iIdx, arr) => {
              const label = typeof item === 'string' ? item : item.title || `Step ${iIdx + 1}`;
              return (
                <React.Fragment key={iIdx}>
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-xs font-semibold text-blue-200 shrink-0 shadow-sm">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {iIdx + 1}
                    </span>
                    <span>{label}</span>
                  </div>
                  {iIdx < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden md:block" />
                  )}
                  {iIdx < arr.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-slate-500 shrink-0 md:hidden" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Process & Low-Fi / Wireframe Cards */}
      {section.type === 'process' && section.items && section.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {section.items.map((item, iIdx) => {
            const itemObj: ProjectSectionItem = typeof item === 'string' ? { title: item } : item;
            return (
              <div key={iIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold">
                  <span>STEP {iIdx + 1}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">{itemObj.title}</h4>
                {itemObj.desc && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{itemObj.desc}</p>
                )}
                {itemObj.image && (
                  <img
                    src={itemObj.image}
                    alt={itemObj.title}
                    className="w-full h-40 object-cover rounded-xl border border-slate-800 mt-2"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Feature List / Design Decisions */}
      {section.type === 'feature-list' && section.items && section.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {section.items.map((item, iIdx) => {
            const itemObj: ProjectSectionItem = typeof item === 'string' ? { title: item } : item;
            return (
              <div key={iIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/30 transition-all space-y-2">
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {itemObj.title}
                </h4>
                {itemObj.desc && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{itemObj.desc}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Timeline / Project Stages */}
      {section.type === 'timeline' && section.items && section.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {section.items.map((item, iIdx) => {
            const itemObj: ProjectSectionItem = typeof item === 'string' ? { title: item } : item;
            const status = itemObj.status || 'Completed';
            return (
              <div key={iIdx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">{itemObj.title}</span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    status === 'Completed'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : status === 'In Progress'
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. Statistics / Metrics Cards */}
      {section.type === 'statistics' && section.items && section.items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {section.items.map((item, iIdx) => {
            const itemObj: ProjectSectionItem = typeof item === 'string' ? { value: item } : item;
            return (
              <div key={iIdx} className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/20 to-indigo-900/10 border border-blue-500/20 text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
                  {itemObj.value || itemObj.title}
                </div>
                <div className="text-xs text-slate-300 font-medium">{itemObj.label || itemObj.desc}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* 8. Comparison (Before / After or Options) */}
      {section.type === 'comparison' && section.items && section.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {section.items.map((item, iIdx) => {
            const itemObj: ProjectSectionItem = typeof item === 'string' ? { title: item } : item;
            const isFirst = iIdx === 0;
            return (
              <div
                key={iIdx}
                className={`p-5 rounded-2xl border ${
                  isFirst
                    ? 'bg-rose-500/5 border-rose-500/20 text-rose-200'
                    : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200'
                } space-y-2`}
              >
                <div className="text-xs font-mono font-bold uppercase tracking-wider">
                  {isFirst ? 'Problem / Before' : 'Solution / After'}
                </div>
                <h4 className="text-base font-bold text-white">{itemObj.title}</h4>
                {itemObj.desc && <p className="text-xs sm:text-sm text-slate-300">{itemObj.desc}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* 9. Code Snippet */}
      {section.type === 'code' && (section.content || section.embedUrl) && (
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-slate-400">
            <span>{section.codeLanguage || 'code'}</span>
            <button
              onClick={() => handleCopyCode(section.content || '')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
            <code>{section.content}</code>
          </pre>
        </div>
      )}

      {/* 10. Quote Block */}
      {section.type === 'quote' && section.content && (
        <div className="p-6 rounded-2xl bg-blue-500/5 border-l-4 border-blue-500 text-slate-200 italic space-y-2">
          <QuoteIcon className="w-6 h-6 text-blue-400 opacity-60" />
          <p className="text-sm sm:text-base leading-relaxed">&ldquo;{section.content}&rdquo;</p>
        </div>
      )}

      {/* 11. Image Gallery */}
      {section.type === 'gallery' && section.images && section.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {section.images.map((img, imgIdx) => {
            const imgObj: ProjectSectionImage = typeof img === 'string' ? { url: img } : img;
            return (
              <div
                key={imgIdx}
                className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer shadow-lg"
                onClick={() => setSelectedImage(imgObj.url)}
              >
                <img
                  src={imgObj.url}
                  alt={imgObj.caption || section.title}
                  className="w-full h-52 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {imgObj.caption && (
                  <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-xs text-slate-300 text-center">
                    {imgObj.caption}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 12. Single Image */}
      {section.type === 'image' && section.images && section.images.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
          <img
            src={typeof section.images[0] === 'string' ? section.images[0] : section.images[0].url}
            alt={section.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* 13. Embedded Prototype / Video Embed */}
      {(section.type === 'prototype' || section.type === 'video') && section.embedUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video w-full">
          <iframe
            src={section.embedUrl}
            title={section.title}
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      )}

      {/* 14. Custom Link Card */}
      {section.type === 'link' && section.embedUrl && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">{section.title}</h4>
            {section.content && <p className="text-xs text-slate-300 mt-1">{section.content}</p>}
          </div>
          <a
            href={section.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition-colors shrink-0"
          >
            <span>Open Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Lightbox / Zoom Modal for Gallery Images */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged preview"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-slate-700"
          />
        </div>
      )}
    </section>
  );
};
