import React, { useState } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Key, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  FileCode, 
  Image as ImageIcon, 
  User, 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { IconLinkedin, IconGithub } from '../ui/BrandIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { uploadProfilePhoto, isSupabaseConfigured, DEFAULT_FALLBACK_AVATAR } from '../../lib/supabase';

interface SettingsManagerProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ onShowToast }) => {
  const { profile, updateProfile, changeAdminPasscode, exportData, importData, resetToDefaults } = usePortfolio();

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    name: profile.name,
    role: profile.role,
    availability: profile.availability,
    heroHeadline: profile.heroHeadline,
    heroIntro: profile.heroIntro,
    aboutText: profile.aboutText,
    avatarUrl: profile.avatarUrl || '',
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    timezone: profile.timezone,
    educationDegree: profile.educationDegree || 'B.Tech in Computer Science & Engineering',
    educationInstitute: profile.educationInstitute || 'Gulzar Group of Institutes',
    educationYear: profile.educationYear || '2023 – 2027',
    linkedInUrl: profile.linkedInUrl,
    githubUrl: profile.githubUrl,
    dribbbleUrl: profile.dribbbleUrl || '',
    resumeUrl: profile.resumeUrl || '',
    resumeFileName: profile.resumeFileName || '',
    resumeLastUpdated: profile.resumeLastUpdated || '',
    serviceId: profile.emailJsConfig?.serviceId || '',
    templateId: profile.emailJsConfig?.templateId || '',
    publicKey: profile.emailJsConfig?.publicKey || '',
    hideAdminFooterLink: !!profile.hideAdminFooterLink,
    adminSecretHint: profile.adminSecretHint || '',
  });

  // Passcode Changer State
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscodeForm, setShowPasscodeForm] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  // Synchronize form when profile state changes
  React.useEffect(() => {
    setFormData({
      name: profile.name,
      role: profile.role,
      availability: profile.availability,
      heroHeadline: profile.heroHeadline,
      heroIntro: profile.heroIntro,
      aboutText: profile.aboutText,
      avatarUrl: profile.avatarUrl || '',
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      timezone: profile.timezone,
      educationDegree: profile.educationDegree || 'B.Tech in Computer Science & Engineering',
      educationInstitute: profile.educationInstitute || 'Gulzar Group of Institutes',
      educationYear: profile.educationYear || '2023 – 2027',
      linkedInUrl: profile.linkedInUrl,
      githubUrl: profile.githubUrl,
      dribbbleUrl: profile.dribbbleUrl || '',
      resumeUrl: profile.resumeUrl || '',
      resumeFileName: profile.resumeFileName || '',
      resumeLastUpdated: profile.resumeLastUpdated || '',
      serviceId: profile.emailJsConfig?.serviceId || '',
      templateId: profile.emailJsConfig?.templateId || '',
      publicKey: profile.emailJsConfig?.publicKey || '',
      hideAdminFooterLink: !!profile.hideAdminFooterLink,
      adminSecretHint: profile.adminSecretHint || '',
    });
  }, [profile]);

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so choosing the same file again triggers onChange
    e.target.value = '';

    // File validation: jpg, jpeg, png, webp
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validExts = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validMimes.includes(file.type) && !validExts.includes(fileExt)) {
      onShowToast('error', 'Invalid File Type', 'Please select a JPG, JPEG, PNG, or WEBP photo.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onShowToast('error', 'Image Too Large', 'Please select a photo smaller than 5MB.');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      if (isSupabaseConfigured()) {
        const result = await uploadProfilePhoto(file);
        if (result.success && result.publicUrl) {
          setFormData((prev) => ({ ...prev, avatarUrl: result.publicUrl! }));
          updateProfile({ avatarUrl: result.publicUrl });
          onShowToast(
            'success',
            'Profile Photo Saved!',
            'Uploaded to Supabase Storage & updated in database. Persists across all devices.'
          );
        } else {
          onShowToast(
            'error',
            'Upload Failed',
            result.error || 'Failed to upload photo to Supabase.'
          );
        }
      } else {
        // Fallback for local preview if Supabase env vars are not set
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const dataUrl = event.target.result as string;
            setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
            updateProfile({ avatarUrl: dataUrl });
            onShowToast(
              'info',
              'Local Preview Updated',
              'To save permanently in cloud, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.'
            );
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('Error during avatar file upload:', err);
      onShowToast('error', 'Upload Error', err?.message || 'An unexpected error occurred.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        onShowToast('error', 'File Too Large', 'Please select a resume file smaller than 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          setFormData((prev) => ({
            ...prev,
            resumeUrl: event.target!.result as string,
            resumeFileName: file.name,
            resumeLastUpdated: nowStr,
          }));
          onShowToast('success', 'Resume PDF Loaded', `"${file.name}" loaded! Click "Save All Settings" to apply.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearResume = () => {
    setFormData((prev) => ({
      ...prev,
      resumeUrl: '',
      resumeFileName: '',
      resumeLastUpdated: '',
    }));
    onShowToast('info', 'Resume Cleared', 'Custom resume removed. Click "Save All Settings" to apply.');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      name: formData.name,
      role: formData.role,
      availability: formData.availability,
      heroHeadline: formData.heroHeadline,
      heroIntro: formData.heroIntro,
      aboutText: formData.aboutText,
      avatarUrl: formData.avatarUrl,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      timezone: formData.timezone,
      educationDegree: formData.educationDegree,
      educationInstitute: formData.educationInstitute,
      educationYear: formData.educationYear,
      linkedInUrl: formData.linkedInUrl,
      githubUrl: formData.githubUrl,
      dribbbleUrl: formData.dribbbleUrl,
      resumeUrl: formData.resumeUrl,
      resumeFileName: formData.resumeFileName,
      resumeLastUpdated: formData.resumeLastUpdated,
      emailJsConfig: {
        serviceId: formData.serviceId,
        templateId: formData.templateId,
        publicKey: formData.publicKey,
      },
      hideAdminFooterLink: formData.hideAdminFooterLink,
      adminSecretHint: formData.adminSecretHint,
    });

    onShowToast('success', 'Settings Saved', 'Profile, resume, education, and security settings saved successfully.');
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode !== confirmPasscode) {
      onShowToast('error', 'Mismatch Error', 'New passcode and confirmation do not match.');
      return;
    }

    const result = changeAdminPasscode(currentPasscode, newPasscode);
    if (result.success) {
      onShowToast('success', 'Passcode Updated', result.message);
      setCurrentPasscode('');
      setNewPasscode('');
      setConfirmPasscode('');
      setShowPasscodeForm(false);
    } else {
      onShowToast('error', 'Update Failed', result.message);
    }
  };

  const handleExportBackup = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ashikur-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('success', 'Backup Exported', 'Downloaded complete portfolio database JSON.');
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) return;
    const result = importData(importJsonText);
    if (result.success) {
      onShowToast('success', 'Import Successful', result.message);
      setShowImportBox(false);
      setImportJsonText('');
    } else {
      onShowToast('error', 'Import Failed', result.message);
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all portfolio data back to default authentic seed data?'
      )
    ) {
      resetToDefaults();
      onShowToast('info', 'Reset Completed', 'Portfolio restored to default initial state.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with quick save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Profile, Resume &amp; Security Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your real resume PDF, personal photo, branding, contact channels, EmailJS keys, and admin security.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Real Resume PDF & Document Manager Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/90 border border-blue-500/30 space-y-6 shadow-xl shadow-blue-500/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Real Resume PDF &amp; Document Manager
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Direct PDF Download &amp; Viewer
            </span>
          </div>

          {/* Current Resume Status Banner */}
          {formData.resumeUrl ? (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{formData.resumeFileName || 'Official Resume Document'}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {formData.resumeLastUpdated ? `Last updated: ${formData.resumeLastUpdated}` : 'Custom Resume Linked'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={formData.resumeFileName || 'Ashikur_Rahman_Resume.pdf'}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-md shadow-blue-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Preview</span>
                </a>

                <button
                  type="button"
                  onClick={handleClearResume}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                  title="Remove uploaded resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              No custom resume file uploaded yet. Uploading a PDF below will let recruiters and visitors download and view your official resume directly.
            </div>
          )}

          {/* Upload & Link Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* File Upload Option */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                Upload Real Resume File from Computer (.pdf, .doc)
              </label>
              <div className="flex items-center gap-2">
                <label className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer flex items-center gap-2 text-xs font-medium shadow-md shadow-blue-600/30 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Choose Resume PDF</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-500">Max size: 10MB</span>
              </div>
            </div>

            {/* URL Option */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                Or Paste Cloud Resume URL (Google Drive, Dropbox, Cloud PDF)
              </label>
              <input
                type="text"
                placeholder="https://drive.google.com/... or /resume.pdf"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Profile Photo Uploader Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Photo &amp; Avatar
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Hero Section Display Photo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Photo Preview Frame */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-40 h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-xl group">
                <img
                  src={formData.avatarUrl || DEFAULT_FALLBACK_AVATAR}
                  alt="Profile Preview"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  Live Hero Preview
                </div>
              </div>
            </div>

            {/* Upload Options */}
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Upload Photo from Computer (.jpg, .jpeg, .png, .webp)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    className={`px-5 py-2.5 rounded-xl text-white flex items-center gap-2 text-xs font-medium shadow-md transition-all ${
                      isUploadingAvatar
                        ? 'bg-blue-800 cursor-not-allowed opacity-80'
                        : 'bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-blue-600/30'
                    }`}
                  >
                    {isUploadingAvatar ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Choose Photo File</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleAvatarFileUpload}
                          disabled={isUploadingAvatar}
                          className="hidden"
                        />
                      </>
                    )}
                  </label>
                  <span className="text-[11px] text-slate-500">Max size: 5MB</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Or Paste Photo / Avatar Cloud URL
                </label>
                <input
                  type="text"
                  placeholder="https://... or Supabase public URL"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand & Hero Identity Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/90 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Brand &amp; Hero Content
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Display Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Primary Role</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Availability Status</label>
              <input
                type="text"
                required
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Hero Headline</label>
            <input
              type="text"
              required
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Hero Short Intro</label>
            <textarea
              rows={2}
              value={formData.heroIntro}
              onChange={(e) => setFormData({ ...formData, heroIntro: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">About Me Full Narrative</label>
            <textarea
              rows={4}
              value={formData.aboutText}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Academic Education Details */}
          <div className="pt-4 border-t border-slate-800/80 space-y-4">
            <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Academic Background &amp; Current Degree
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Degree Title</label>
                <input
                  type="text"
                  value={formData.educationDegree}
                  onChange={(e) => setFormData({ ...formData, educationDegree: e.target.value })}
                  placeholder="B.Tech in Computer Science & Engineering"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">University / Institute</label>
                <input
                  type="text"
                  value={formData.educationInstitute}
                  onChange={(e) => setFormData({ ...formData, educationInstitute: e.target.value })}
                  placeholder="Gulzar Group of Institutes"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Study Duration / Years</label>
                <input
                  type="text"
                  value={formData.educationYear}
                  onChange={(e) => setFormData({ ...formData, educationYear: e.target.value })}
                  placeholder="2023 – 2027"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/90 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contact Details &amp; Social Channels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Direct Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Location Base</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Timezone</label>
              <input
                type="text"
                required
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <IconLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={formData.linkedInUrl}
                onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <IconGithub className="w-3.5 h-3.5 text-white" />
                <span>GitHub URL</span>
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* EmailJS Credentials */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4" />
              EmailJS Service Integration
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Form Mail Forwarding
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">EmailJS Service ID</label>
              <input
                type="text"
                placeholder="service_xxx"
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">EmailJS Template ID</label>
              <input
                type="text"
                placeholder="template_xxx"
                value={formData.templateId}
                onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">EmailJS Public Key</label>
              <input
                type="text"
                placeholder="public_xxx"
                value={formData.publicKey}
                onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Protection Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Admin Security &amp; Access Controls
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Brute Force Protected
            </span>
          </div>

          <div className="space-y-4">
            {/* Discreet Link Option */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <input
                type="checkbox"
                id="hideAdminFooterLink"
                checked={formData.hideAdminFooterLink}
                onChange={(e) =>
                  setFormData({ ...formData, hideAdminFooterLink: e.target.checked })
                }
                className="mt-1 w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="hideAdminFooterLink" className="text-xs text-slate-300 cursor-pointer">
                <span className="font-semibold text-white block">
                  Discreet Access Mode: Hide the Admin Lock Button from Public Footer
                </span>
                <span className="text-slate-400 mt-0.5 block">
                  When enabled, visitors will see no link to the admin panel. Only you can access it by navigating directly to <code className="text-blue-400">/admin/login</code>.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save All General Settings */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* Passcode Changer Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/90 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              Change Admin Secret Passcode
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ensure only you can log into and manage this portfolio.
            </p>
          </div>

          {!showPasscodeForm && (
            <button
              onClick={() => setShowPasscodeForm(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-white"
            >
              Update Passcode
            </button>
          )}
        </div>

        {showPasscodeForm && (
          <form onSubmit={handleChangePasscode} className="space-y-4 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Current Passcode</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    placeholder="Current passcode"
                    value={currentPasscode}
                    onChange={(e) => setCurrentPasscode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-slate-500"
                  >
                    {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">New Passcode (min 6 chars)</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="New secret passcode"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-slate-500"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Confirm New Passcode</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new passcode"
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/20"
              >
                Apply New Passcode
              </button>
              <button
                type="button"
                onClick={() => setShowPasscodeForm(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Backup & Database Maintenance Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322]/80 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          Backup, Export &amp; Reset
        </h3>

        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Database JSON</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import Database JSON</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-xs font-medium text-rose-300 transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Authentic Defaults</span>
          </button>
        </div>

        {showImportBox && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-xs font-medium text-slate-300">
              Paste JSON Backup Content Below:
            </label>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"version": "2.0", "profile": { ... }, "projects": [ ... ]}'
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
            />
            <div className="flex gap-2">
              <button
                onClick={handleImportJson}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium"
              >
                Apply Import
              </button>
              <button
                onClick={() => setShowImportBox(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
