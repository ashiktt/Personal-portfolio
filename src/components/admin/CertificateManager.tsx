import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Upload, Award, Calendar, Check, X, ExternalLink, Save, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certificate } from '../../types';

interface CertificateManagerProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const CertificateManager: React.FC<CertificateManagerProps> = ({ onShowToast }) => {
  const { certificates, addCertificate, updateCertificate, deleteCertificate } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    image: '',
    credentialUrl: '',
    skillsString: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      image: '',
      credentialUrl: '',
      skillsString: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleStartEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      image: cert.image,
      credentialUrl: cert.credentialUrl || '',
      skillsString: cert.skills?.join(', ') || '',
    });
    setIsEditing(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onShowToast('error', 'Image Too Large', 'Please select an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, image: event.target!.result as string }));
          onShowToast('success', 'Image Uploaded', 'Certificate preview image ready.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.issuer.trim() || !formData.issueDate.trim()) {
      onShowToast('error', 'Validation Error', 'Title, Issuer, and Issue Date are required.');
      return;
    }

    const skills = formData.skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const defaultImg =
      formData.image.trim() ||
      'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1000&q=80';

    const certData = {
      title: formData.title,
      issuer: formData.issuer,
      issueDate: formData.issueDate,
      image: defaultImg,
      credentialUrl: formData.credentialUrl.trim() || undefined,
      skills: skills.length > 0 ? skills : undefined,
    };

    if (editingId) {
      updateCertificate(editingId, certData);
      onShowToast('success', 'Certificate Updated', `"${formData.title}" updated.`);
    } else {
      addCertificate(certData);
      onShowToast('success', 'Certificate Added', `"${formData.title}" added to credentials.`);
    }

    resetForm();
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete certificate "${title}"?`)) {
      deleteCertificate(id);
      onShowToast('info', 'Certificate Removed', `"${title}" was removed.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Certificates &amp; Credentials Manager</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add course certificates, bootcamps, and professional UX credentials.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Certificate</span>
          </button>
        )}
      </div>

      {/* Inline Form */}
      {isEditing && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322] border border-blue-500/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              {editingId ? 'Edit Certificate' : 'Add New Certificate'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Certificate Title <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google UX Design Certificate"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Issuing Organization <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google / Coursera / IBM / IxDF"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Issue Date / Year <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. December 2025"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Verification / Credential URL
                </label>
                <input
                  type="url"
                  placeholder="https://coursera.org/verify/..."
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Image File Upload / URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Certificate Image (Upload or URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer flex items-center gap-1 text-xs font-medium shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {formData.image && (
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] max-h-28 border border-slate-800 bg-slate-900">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Skills String */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Skills Validated (comma separated)
              </label>
              <input
                type="text"
                placeholder="User Research, Wireframing, Figma, Usability Testing"
                value={formData.skillsString}
                onChange={(e) => setFormData({ ...formData, skillsString: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Update Certificate' : 'Save Certificate'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Certificate Table */}
      <div className="rounded-2xl bg-[#0E1322]/80 border border-slate-800 overflow-hidden">
        {certificates.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No certificates added yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-sm truncate max-w-sm">
                      {cert.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-blue-300">{cert.issuer}</span>
                      <span>•</span>
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleStartEdit(cert)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                    title="Edit certificate"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(cert.id, cert.title)}
                    className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300"
                    title="Delete certificate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
