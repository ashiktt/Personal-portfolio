import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Upload, 
  Image as ImageIcon, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Save, 
  Sparkles 
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';

interface ProjectManagerProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onShowToast }) => {
  const { projects, addProject, updateProject, deleteProject, reorderProjects } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    shortDescription: string;
    thumbnail: string;
    toolsString: string;
    isPublished: boolean;
    featured: boolean;
    overview: string;
    problem: string;
    targetAudience: string;
    solution: string;
    keyFeaturesString: string;
    figmaUrl: string;
    liveUrl: string;
    githubUrl: string;
    galleryString: string;
  }>({
    title: '',
    category: 'Mobile App',
    shortDescription: '',
    thumbnail: '',
    toolsString: 'Figma, User Research, Prototyping',
    isPublished: true,
    featured: false,
    overview: '',
    problem: '',
    targetAudience: '',
    solution: '',
    keyFeaturesString: '',
    figmaUrl: '',
    liveUrl: '',
    githubUrl: '',
    galleryString: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Mobile App',
      shortDescription: '',
      thumbnail: '',
      toolsString: 'Figma, User Research, Prototyping',
      isPublished: true,
      featured: false,
      overview: '',
      problem: '',
      targetAudience: '',
      solution: '',
      keyFeaturesString: '',
      figmaUrl: '',
      liveUrl: '',
      githubUrl: '',
      galleryString: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleStartEdit = (proj: Project) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      category: proj.category,
      shortDescription: proj.shortDescription,
      thumbnail: proj.thumbnail,
      toolsString: proj.tools.join(', '),
      isPublished: proj.isPublished,
      featured: !!proj.featured,
      overview: proj.caseStudy?.overview || '',
      problem: proj.caseStudy?.problem || '',
      targetAudience: proj.caseStudy?.targetAudience || '',
      solution: proj.caseStudy?.solution || '',
      keyFeaturesString: proj.caseStudy?.keyFeatures?.join('\n') || '',
      figmaUrl: proj.caseStudy?.figmaUrl || '',
      liveUrl: proj.caseStudy?.liveUrl || '',
      githubUrl: proj.caseStudy?.githubUrl || '',
      galleryString: proj.caseStudy?.galleryImages?.join('\n') || '',
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
          setFormData((prev) => ({ ...prev, thumbnail: event.target!.result as string }));
          onShowToast('success', 'Image Loaded', 'Thumbnail ready to save.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.shortDescription.trim()) {
      onShowToast('error', 'Validation Error', 'Project title and short description are required.');
      return;
    }

    const tools = formData.toolsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const keyFeatures = formData.keyFeaturesString
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const galleryImages = formData.galleryString
      .split('\n')
      .map((g) => g.trim())
      .filter(Boolean);

    const defaultThumb =
      formData.thumbnail.trim() ||
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80';

    const projectData = {
      title: formData.title,
      category: formData.category,
      shortDescription: formData.shortDescription,
      thumbnail: defaultThumb,
      tools: tools.length > 0 ? tools : ['Figma', 'UI/UX'],
      isPublished: formData.isPublished,
      featured: formData.featured,
      order: editingId ? (projects.find((p) => p.id === editingId)?.order ?? projects.length + 1) : projects.length + 1,
      caseStudy: {
        overview: formData.overview || formData.shortDescription,
        problem: formData.problem,
        targetAudience: formData.targetAudience,
        solution: formData.solution,
        keyFeatures: keyFeatures.length > 0 ? keyFeatures : undefined,
        figmaUrl: formData.figmaUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      },
    };

    if (editingId) {
      updateProject(editingId, projectData);
      onShowToast('success', 'Project Updated', `"${formData.title}" has been updated.`);
    } else {
      addProject(projectData);
      onShowToast('success', 'Project Created', `"${formData.title}" has been added.`);
    }

    resetForm();
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProject(id);
      onShowToast('info', 'Project Deleted', `"${title}" was removed.`);
    }
  };

  const handleTogglePublish = (proj: Project) => {
    updateProject(proj.id, { isPublished: !proj.isPublished });
    onShowToast(
      'success',
      proj.isPublished ? 'Project Unpublished' : 'Project Published',
      `"${proj.title}" is now ${!proj.isPublished ? 'visible on public site' : 'hidden from public site'}.`
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    const listCopy = [...projects];
    const temp = listCopy[index];
    listCopy[index] = listCopy[newIndex];
    listCopy[newIndex] = temp;

    reorderProjects(listCopy);
    onShowToast('info', 'Order Updated', 'Project display order has been saved.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Case Study Project Manager</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add new projects, update UX documentation, reorder cards, and control visibility.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {/* Inline Create / Edit Modal / Form */}
      {isEditing && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322] border border-blue-500/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              {editingId ? 'Edit Case Study Project' : 'Create New Project'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Primary Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Project Title <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FinFlow — Next-Gen Banking"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Mobile App">Mobile App</option>
                  <option value="SaaS Platform">SaaS Platform</option>
                  <option value="Design System">Design System</option>
                  <option value="Web Platform">Web Platform</option>
                  <option value="Case Study">Case Study</option>
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Short Card Description <span className="text-blue-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="A concise 2-line summary displayed on the card..."
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Image Upload / URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Thumbnail Image (File Upload or Image URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
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

              {formData.thumbnail && (
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-28 border border-slate-800 bg-slate-900">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-slate-300 font-mono">
                    Preview
                  </span>
                </div>
              )}
            </div>

            {/* Tools String */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Tools &amp; Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="Figma, User Research, Prototyping, Design System"
                value={formData.toolsString}
                onChange={(e) => setFormData({ ...formData, toolsString: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Detailed Case Study Fields (Problem, Solution, Key Features, Figma URL) */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Full Case Study Documentation (Modal View)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">The Problem</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the user friction or market challenge..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">The Proposed Solution</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your design decisions and interface improvements..."
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Key Features (One item per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="One-tap quick actions&#10;Dark-mode accessibility tokens&#10;Thumb-friendly ergonomics"
                  value={formData.keyFeaturesString}
                  onChange={(e) => setFormData({ ...formData, keyFeaturesString: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Figma Prototype URL</label>
                  <input
                    type="url"
                    placeholder="https://figma.com/..."
                    value={formData.figmaUrl}
                    onChange={(e) => setFormData({ ...formData, figmaUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 bg-slate-900"
                />
                <span>Publish on public portfolio immediately</span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Update Case Study' : 'Save & Add Project'}</span>
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

      {/* Projects List Table */}
      <div className="rounded-2xl bg-[#0E1322]/80 border border-slate-800 overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No projects in database. Click &ldquo;Add New Project&rdquo; to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
              >
                {/* Project Info & Thumbnail */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-sm truncate max-w-sm">
                        {proj.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                        {proj.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                      {proj.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Status & Action Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === projects.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Publish/Draft Toggle */}
                  <button
                    onClick={() => handleTogglePublish(proj)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      proj.isPublished
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {proj.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{proj.isPublished ? 'Published' : 'Draft'}</span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleStartEdit(proj)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                    title="Edit project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300"
                    title="Delete project"
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
