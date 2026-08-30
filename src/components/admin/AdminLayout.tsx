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
  ShieldCheck
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
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
    profile 
  } = usePortfolio();
  
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'skills' | 'messages' | 'settings'>('projects');
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
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Secure management for {profile.name}
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Preview Public Site</span>
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
    </div>
  );
};
