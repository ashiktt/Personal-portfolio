import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit2, 
  Award, 
  Settings, 
  LogOut, 
  Eye, 
  Mail, 
  Cpu,
  Inbox,
  ShieldCheck,
  RefreshCw,
  Download,
  Copy,
  X,
  FileCode,
  Database
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SUPABASE_SETUP_SQL } from '../../lib/supabase';
import { ProjectManager } from './ProjectManager';
import { CertificateManager } from './CertificateManager';
import { SkillsManager } from './SkillsManager';
import { SettingsManager } from './SettingsManager';
import { MessagesManager } from './MessagesManager';

interface AdminLayoutProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onShowToast }) => {
  const { 
    projects, 
    certificates, 
    messages, 
    tools, 
    skillGroups, 
    publishedProjects, 
    logoutAdmin, 
    profile,
    cloudSyncStatus,
    cloudSyncError,
    publishToLiveWebsite,
    generateInitialDataTsCode,
  } = usePortfolio();
  
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'skills' | 'messages' | 'settings'>('projects');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const navigate = useNavigate();

  const unreadMessagesCount = messages.filter((m) => !m.read).length;
  const totalSkillsCount = skillGroups.reduce((acc, g) => acc + g.items.length, 0);

  const handleLogout = () => {
    logoutAdmin();
    onShowToast('info', 'Logged Out', 'You have been logged out of the admin panel.');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-[#0C1019]/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo / Admin Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/20">
              AR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base">Portfolio Admin</span>
                {cloudSyncStatus === 'connected' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono flex items-center gap-1" title="Connected to Supabase. Live updates sync automatically to all visitors.">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Cloud Synced
                  </span>
                )}
                {cloudSyncStatus === 'syncing' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 text-[10px] font-mono flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Syncing...
                  </span>
                )}
                {(cloudSyncStatus === 'disconnected' || cloudSyncStatus === 'error') && (
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-[10px] font-mono flex items-center gap-1 transition-colors"
                    title="Changes saved in local browser only. Click to connect Supabase or publish to code."
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Local Storage (Click to Sync)
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Secure management for {profile.name}
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={async () => {
                setIsPublishing(true);
                const res = await publishToLiveWebsite();
                setIsPublishing(false);
                if (res.success) {
                  onShowToast('success', 'Live Website Updated!', res.message);
                } else if (res.tableMissing) {
                  onShowToast('error', 'Supabase Database Setup Required', res.message);
                  setShowSqlModal(true);
                } else {
                  onShowToast('info', 'Live Update Guide', res.message);
                  setShowPublishModal(true);
                }
              }}
              disabled={isPublishing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
              title="Save changes so your live website updates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPublishing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Save to Live Website</span>
              <span className="sm:hidden">Save</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Preview Public Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-medium text-rose-300 transition-colors"
              title="Log out of admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('projects')}
            className="p-5 rounded-2xl bg-[#0E1322]/80 border border-slate-800/80 hover:border-blue-500/30 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Projects</div>
              <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">{publishedProjects.length} Published live</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('skills')}
            className="p-5 rounded-2xl bg-[#0E1322]/80 border border-slate-800/80 hover:border-blue-500/30 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tools &amp; Skills</div>
              <div className="text-2xl font-bold text-white mt-1">{tools.length} Tools</div>
              <div className="text-[11px] text-sky-400 mt-0.5">{totalSkillsCount} Skill Competencies</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('certificates')}
            className="p-5 rounded-2xl bg-[#0E1322]/80 border border-slate-800/80 hover:border-blue-500/30 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Certificates</div>
              <div className="text-2xl font-bold text-white mt-1">{certificates.length}</div>
              <div className="text-[11px] text-indigo-400 mt-0.5">Verified Credentials</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('messages')}
            className="p-5 rounded-2xl bg-[#0E1322]/80 border border-slate-800/80 hover:border-blue-500/30 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Messages Inbox</div>
              <div className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                <span>{messages.length}</span>
                {unreadMessagesCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500 text-white font-mono">
                    {unreadMessagesCount} new
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Direct form inquiries</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Inbox className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Skills &amp; Tools ({tools.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
              activeTab === 'certificates'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all relative ${
              activeTab === 'messages'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Messages Inbox</span>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-sky-400 text-slate-950 font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profile &amp; Security</span>
          </button>
        </div>

        {/* Tab View Content */}
        <div className="space-y-6">
          {activeTab === 'projects' && <ProjectManager onShowToast={onShowToast} />}
          {activeTab === 'skills' && <SkillsManager onShowToast={onShowToast} />}
          {activeTab === 'certificates' && <CertificateManager onShowToast={onShowToast} />}
          {activeTab === 'messages' && <MessagesManager onShowToast={onShowToast} />}
          {activeTab === 'settings' && <SettingsManager onShowToast={onShowToast} />}
        </div>

      </main>

      {/* Save to Live Website / Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0E1322] border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">How Live Updates Work</h3>
                  <p className="text-xs text-slate-400">Update your live deployed portfolio</p>
                </div>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                <span className="font-bold text-blue-300 block text-sm">Option 1: Connect Supabase (0 Code / Instant)</span>
                <p className="text-slate-400 leading-relaxed">
                  Connect your free Supabase database in Settings. Every project, tool, and certificate you add will immediately appear on your live website for all visitors worldwide without touching code!
                </p>
                <button
                  onClick={() => {
                    setShowPublishModal(false);
                    setActiveTab('settings');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs mt-1"
                >
                  Configure Supabase Cloud in Settings →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block text-sm">Option 2: Git Commit &amp; Deploy</span>
                <p className="text-slate-400 leading-relaxed">
                  Download or copy your updated <code className="text-sky-300">initialData.ts</code>, place it into <code className="text-slate-200">src/data/initialData.ts</code>, and push to GitHub. Netlify/Vercel will redeploy your live website with the updated content!
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      const code = generateInitialDataTsCode();
                      const blob = new Blob([code], { type: 'text/typescript' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'initialData.ts';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      onShowToast('success', 'Downloaded initialData.ts', 'Replace src/data/initialData.ts and git push.');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>Download initialData.ts</span>
                  </button>

                  <button
                    onClick={() => {
                      const code = generateInitialDataTsCode();
                      navigator.clipboard.writeText(code);
                      onShowToast('success', 'Copied to Clipboard!', 'Paste into src/data/initialData.ts');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy Code</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supabase SQL Setup Modal (appears if table 'portfolio_settings' is missing) */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#0E1322] border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">One-Time Supabase Database Setup</h3>
                  <p className="text-xs text-slate-400">Table &ldquo;portfolio_settings&rdquo; needs to be created</p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p className="text-slate-300 leading-relaxed">
                Your portfolio connected to Supabase successfully, but the required table has not been created yet in your Supabase project.
              </p>
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="font-semibold text-white block">2 Simple Steps:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
                  <li>Click <span className="text-white font-medium">&ldquo;Copy SQL Script&rdquo;</span> below.</li>
                  <li>Go to your Supabase Dashboard &rarr; <b>SQL Editor</b> &rarr; paste the code and click <b>Run</b>!</li>
                </ol>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
                      onShowToast('success', 'SQL Copied!', 'Paste into your Supabase SQL Editor and click Run.');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Script</span>
                  </button>

                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                  >
                    <span>Open Supabase Dashboard &rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
