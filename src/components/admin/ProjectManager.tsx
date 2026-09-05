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
  Sparkles,
  Layers,
  FolderPlus,
  Copy,
  ChevronRight,
  Globe,
  FileText,
  Play,
  Code2,
  List,
  Quote,
  BarChart3,
  GitBranch,
  ArrowRight,
  Clock
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, ProjectSection, ProjectSectionType, ProjectSectionItem, ProjectSectionImage } from '../../types';
import { ProjectView } from '../projects/ProjectView';

interface ProjectManagerProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const SECTION_TYPE_OPTIONS: { type: ProjectSectionType; label: string; desc: string }[] = [
  { type: 'text', label: 'Text / Story', desc: 'Standard paragraph or narrative block' },
  { type: 'feature-list', label: 'Feature / Decision Grid', desc: 'Grid cards with title and description' },
  { type: 'user-flow', label: 'User Flow (Stepper)', desc: 'Sequential horizontal/vertical step flow' },
  { type: 'process', label: 'Process / Wireframes', desc: 'Step cards with title, description, and image' },
  { type: 'bullet-list', label: 'Bullet List', desc: 'Key takeaways or feature list with checkmarks' },
  { type: 'numbered-list', label: 'Numbered List', desc: 'Sequential numbered steps' },
  { type: 'timeline', label: 'Timeline & Stages', desc: 'Stage tracker with status badges' },
  { type: 'statistics', label: 'Statistics / Metrics', desc: 'Highlight numbers and metrics cards' },
  { type: 'gallery', label: 'Image Gallery', desc: 'Multi-image grid with zoom previews' },
  { type: 'image', label: 'Single Image', desc: 'Feature image with optional caption' },
  { type: 'comparison', label: 'Comparison / Before-After', desc: 'Side-by-side comparison cards' },
  { type: 'code', label: 'Code Snippet', desc: 'Syntax code block with copy button' },
  { type: 'quote', label: 'Quote / Highlight', desc: 'Stylized testimonial or key quote' },
  { type: 'prototype', label: 'Prototype Embed', desc: 'Embedded Figma or prototype iframe' },
  { type: 'video', label: 'Video Embed', desc: 'Embedded YouTube or video iframe' },
  { type: 'link', label: 'Custom Link Card', desc: 'Prominent CTA card with external URL' },
];

const CATEGORY_PRESETS = [
  'Mobile App',
  'UI/UX Design',
  'Web Design',
  'SaaS & Web App',
  'AI Project',
  'Software Project',
  'Frontend Project',
  'Full-Stack Project',
  'Brand Identity',
  'Graphic Design',
  'Research Project',
  'Academic Project',
  'Open Source',
];

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onShowToast }) => {
  const { projects, addProject, updateProject, deleteProject, reorderProjects } = usePortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'links' | 'sections' | 'preview'>('basic');
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // Form State for the currently edited project
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'createdAt'>>({
    title: '',
    subtitle: '',
    category: 'UI/UX Design',
    projectType: 'Case Study',
    shortDescription: '',
    longDescription: '',
    thumbnail: '',
    heroImage: '',
    gallery: [],
    status: 'In Progress',
    statusBadge: 'In Progress',
    date: '',
    duration: '',
    role: '',
    team: '',
    tools: ['Figma'],
    tags: ['UI/UX'],
    order: 1,
    isPublished: true,
    featured: false,
    links: {
      liveDemo: '',
      prototype: '',
      github: '',
      figma: '',
      behance: '',
      documentation: '',
      customLinks: [],
    },
    contentSections: [
      {
        id: 'sec-overview-' + Date.now(),
        title: 'Project Overview',
        subtitle: 'Context & Vision',
        type: 'text',
        content: '',
        order: 1,
        visible: true,
      },
    ],
  });

  const [toolsInput, setToolsInput] = useState('Figma');
  const [tagsInput, setTagsInput] = useState('UI/UX');

  // Start creating a brand new project (clean empty slate, no inherited data)
  const handleStartAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'UI/UX Design',
      projectType: 'Case Study',
      shortDescription: '',
      longDescription: '',
      thumbnail: '',
      heroImage: '',
      gallery: [],
      status: 'In Progress',
      statusBadge: 'In Progress',
      date: '',
      duration: '',
      role: '',
      team: '',
      tools: ['Figma'],
      tags: [],
      order: projects.length + 1,
      isPublished: true,
      featured: false,
      links: {
        liveDemo: '',
        prototype: '',
        github: '',
        figma: '',
        behance: '',
        documentation: '',
        customLinks: [],
      },
      contentSections: [
        {
          id: 'sec-overview-' + Date.now(),
          title: 'Project Overview',
          subtitle: 'Context & Vision',
          type: 'text',
          content: '',
          order: 1,
          visible: true,
        },
      ],
    });
    setToolsInput('Figma');
    setTagsInput('');
    setActiveTab('basic');
    setIsEditing(true);
  };

  // Start editing an existing project
  const handleStartEdit = (proj: Project) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title || '',
      subtitle: proj.subtitle || '',
      category: proj.category || 'Product Design',
      projectType: proj.projectType || '',
      shortDescription: proj.shortDescription || '',
      longDescription: proj.longDescription || '',
      thumbnail: proj.thumbnail || '',
      heroImage: proj.heroImage || '',
      gallery: proj.gallery || [],
      status: proj.status || 'In Progress',
      statusBadge: proj.statusBadge || '',
      date: proj.date || '',
      duration: proj.duration || '',
      role: proj.role || '',
      team: proj.team || '',
      tools: proj.tools || [],
      tags: proj.tags || [],
      order: proj.order || 1,
      isPublished: proj.isPublished !== false,
      featured: !!proj.featured,
      links: proj.links || {
        liveDemo: '',
        prototype: '',
        github: '',
        figma: '',
        behance: '',
        documentation: '',
        customLinks: [],
      },
      contentSections: proj.contentSections || [],
    });
    setToolsInput((proj.tools || []).join(', '));
    setTagsInput((proj.tags || []).join(', '));
    setActiveTab('basic');
    setIsEditing(true);
  };

  // Duplicate a project
  const handleDuplicate = (proj: Project) => {
    const duplicated: Omit<Project, 'id' | 'createdAt'> = {
      ...proj,
      title: `${proj.title} (Copy)`,
      featured: false,
      order: projects.length + 1,
    };
    addProject(duplicated);
    onShowToast('success', 'Project Duplicated', `Created a copy of "${proj.title}".`);
  };

  // Delete a project
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteProject(id);
      onShowToast('info', 'Project Deleted', `"${title}" was removed.`);
      if (editingId === id) {
        setIsEditing(false);
        setEditingId(null);
      }
    }
  };

  // Reorder projects in list
  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    const listCopy = [...projects];
    const temp = listCopy[index];
    listCopy[index] = listCopy[newIndex];
    listCopy[newIndex] = temp;

    reorderProjects(listCopy);
    onShowToast('info', 'Order Saved', 'Project order updated.');
  };

  // Save Project Handler
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.title.trim() || !formData.shortDescription.trim()) {
      onShowToast('error', 'Validation Error', 'Project title and short description are required.');
      setActiveTab('basic');
      return;
    }

    const tools = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tools,
      tags,
    };

    if (editingId) {
      updateProject(editingId, payload);
      onShowToast('success', 'Project Updated', `"${formData.title}" was saved successfully.`);
    } else {
      addProject(payload);
      onShowToast('success', 'Project Created', `"${formData.title}" was published.`);
    }

    setIsEditing(false);
    setEditingId(null);
  };

  // SECTION BUILDER HANDLERS
  const handleAddSection = (type: ProjectSectionType) => {
    const option = SECTION_TYPE_OPTIONS.find((o) => o.type === type);
    const newSection: ProjectSection = {
      id: `sec-${Date.now()}`,
      title: option?.label || 'New Section',
      subtitle: '',
      type,
      content: '',
      items: type === 'bullet-list' || type === 'user-flow' || type === 'numbered-list' ? ['First item'] : [],
      images: [],
      order: formData.contentSections.length + 1,
      visible: true,
    };

    setFormData((prev) => ({
      ...prev,
      contentSections: [...prev.contentSections, newSection],
    }));

    setShowAddSectionModal(false);
    onShowToast('info', 'Section Added', `Added "${newSection.title}" to project.`);
  };

  const handleUpdateSection = (secId: string, updated: Partial<ProjectSection>) => {
    setFormData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.map((s) => (s.id === secId ? { ...s, ...updated } : s)),
    }));
  };

  const handleDeleteSection = (secId: string) => {
    setFormData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.filter((s) => s.id !== secId),
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.contentSections.length) return;

    const list = [...formData.contentSections];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    // Normalize orders
    const normalized = list.map((sec, idx) => ({ ...sec, order: idx + 1 }));

    setFormData((prev) => ({
      ...prev,
      contentSections: normalized,
    }));
  };

  // Image upload helpers
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'thumbnail' | 'heroImage'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        onShowToast('error', 'Image Too Large', 'Please select an image smaller than 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, [targetField]: event.target!.result as string }));
          onShowToast('success', 'Image Uploaded', `${targetField} ready.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ----------------------------------------------------
  // 1. PROJECT LIST VIEW (When not in edit mode)
  // ----------------------------------------------------
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Header & Add Project CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Manage Projects &amp; Case Studies
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add, edit, reorder, and configure dynamic content sections for your projects.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>

        {/* Projects Cards List */}
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No projects found</h3>
              <p className="text-xs text-slate-400">Click &ldquo;Add New Project&rdquo; to create your first portfolio project.</p>
            </div>
          ) : (
            projects.map((project, idx) => (
              <div
                key={project.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Project Info & Thumbnail */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold">
                          Featured
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {project.category}
                      </span>
                      {project.status && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 text-[10px] font-mono">
                          {project.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-xl">
                      {project.shortDescription}
                    </p>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {(project.contentSections || []).length} dynamic sections • {project.tools.length} tools
                    </div>
                  </div>
                </div>

                {/* Actions: Reorder, Duplicate, Edit, Delete */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-800 p-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveProject(idx, 'up')}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === projects.length - 1}
                      onClick={() => handleMoveProject(idx, 'down')}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(project)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Duplicate Project"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(project)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id, project.title)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. PROJECT EDITOR / DYNAMIC BUILDER VIEW
  // ----------------------------------------------------
  // Synthesize current project preview object
  const previewProject: Project = {
    id: editingId || 'preview-temp',
    ...formData,
    tools: toolsInput.split(',').map((t) => t.trim()).filter(Boolean),
    tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    createdAt: new Date().toISOString().split('T')[0],
  };

  return (
    <div className="space-y-6">
      {/* Editor Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to projects list"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {editingId ? `Edit: ${formData.title || 'Project'}` : 'Create New Project'}
            </h2>
            <p className="text-xs text-slate-400">
              Configure metadata, links, and custom dynamic content sections.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save Project</span>
          </button>
        </div>
      </div>

      {/* Editor Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'basic', label: '1. Basic Information' },
          { id: 'media', label: '2. Images & Media' },
          { id: 'links', label: '3. Project Links' },
          { id: 'sections', label: `4. Content Sections (${formData.contentSections.length})` },
          { id: 'preview', label: '5. Live Preview' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC INFORMATION */}
      {activeTab === 'basic' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., QuizTube or Travel Booking App"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g., AI-Powered Study Assistant or UI/UX Case Study"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Category
              </label>
              <input
                type="text"
                list="category-presets"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Select or enter custom category..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <datalist id="category-presets">
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Project Type */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Project Type / Format
              </label>
              <input
                type="text"
                value={formData.projectType || ''}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                placeholder="e.g., Case Study, Production App, Open Source"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Project Status
              </label>
              <select
                value={formData.status || 'In Progress'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value, statusBadge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Planning">Planning</option>
                <option value="Idea">Idea</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Your Role
              </label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Lead UI/UX Designer, Full-Stack Developer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Duration / Timeline */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Duration / Date
              </label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 4 Weeks or Feb 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Short Description (Cards &amp; Header) *
              </label>
              <textarea
                rows={3}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief 1-2 sentence overview of what this project accomplishes..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Tools String */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Tools &amp; Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
                placeholder="e.g., Figma, FigJam, React, TypeScript, Tailwind CSS"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tags String */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Tags &amp; Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., Mobile, AI, SaaS, User Research, Web"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Visibility & Featured Checkboxes */}
            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Published on Public Website</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Featured Project (Hero Showcase)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA & IMAGES */}
      {activeTab === 'media' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white">Project Thumbnail</h4>
              <p className="text-xs text-slate-400">Used on portfolio project cards and previews.</p>

              {formData.thumbnail ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnail: '' })}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-rose-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span>No thumbnail uploaded</span>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="Paste image URL..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'thumbnail')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Hero Image */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white">Hero Banner Image (Optional)</h4>
              <p className="text-xs text-slate-400">Displayed at the top of the case-study modal / page.</p>

              {formData.heroImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                  <img src={formData.heroImage} alt="Hero banner" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroImage: '' })}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-rose-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span>No hero banner image (uses thumbnail)</span>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  value={formData.heroImage || ''}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  placeholder="Paste banner image URL..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroImage')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECT LINKS */}
      {activeTab === 'links' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white">Project Action Links</h4>
            <p className="text-xs text-slate-400">
              Only links with values will appear on the public project page. Empty links are automatically hidden.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Live Demo */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Live Demo / Website URL
              </label>
              <input
                type="url"
                value={formData.links.liveDemo || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, liveDemo: e.target.value },
                  })
                }
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Interactive Prototype */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-purple-400" />
                Interactive Prototype URL
              </label>
              <input
                type="url"
                value={formData.links.prototype || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, prototype: e.target.value },
                  })
                }
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Figma */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="text-[#F24E1E] font-bold">F</span>
                Figma File / Prototype URL
              </label>
              <input
                type="url"
                value={formData.links.figma || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, figma: e.target.value },
                  })
                }
                placeholder="https://figma.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.links.github || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, github: e.target.value },
                  })
                }
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Behance */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                Behance Showcase URL
              </label>
              <input
                type="url"
                value={formData.links.behance || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, behance: e.target.value },
                  })
                }
                placeholder="https://behance.net/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Documentation */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                Documentation / Article URL
              </label>
              <input
                type="url"
                value={formData.links.documentation || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, documentation: e.target.value },
                  })
                }
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DYNAMIC CONTENT SECTIONS BUILDER */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Dynamic Content Sections ({formData.contentSections.length})
              </h3>
              <p className="text-xs text-slate-400">
                Add, configure, reorder, or hide modular content sections for this project.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddSectionModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>

          {/* Section List */}
          <div className="space-y-4">
            {formData.contentSections.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <p className="text-sm text-slate-400">No content sections yet.</p>
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Section</span>
                </button>
              </div>
            ) : (
              formData.contentSections.map((section, idx) => (
                <div
                  key={section.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    section.visible !== false
                      ? 'bg-slate-900/70 border-slate-800'
                      : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                  } space-y-4`}
                >
                  {/* Section Top Control Bar */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono">
                        {SECTION_TYPE_OPTIONS.find((o) => o.type === section.type)?.label || section.type}
                      </span>
                      {section.visible === false && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-mono">
                          Hidden
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Reorder Up/Down */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, 'up')}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.contentSections.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        type="button"
                        onClick={() => handleUpdateSection(section.id, { visible: !section.visible })}
                        className={`p-1.5 rounded-lg transition-colors ${
                          section.visible !== false
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                        title={section.visible !== false ? 'Hide from public site' : 'Show on public site'}
                      >
                        {section.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete Section */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Section Title & Subtitle & Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-mono text-slate-400">Section Title</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                        placeholder="e.g., Problem, Solution, Architecture, User Flow"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Section Type</label>
                      <select
                        value={section.type}
                        onChange={(e) => handleUpdateSection(section.id, { type: e.target.value as ProjectSectionType })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      >
                        {SECTION_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.type} value={opt.type}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-3">
                      <label className="text-[11px] font-mono text-slate-400">Optional Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={section.subtitle || ''}
                        onChange={(e) => handleUpdateSection(section.id, { subtitle: e.target.value })}
                        placeholder="e.g., Research Insights, Technical Highlights"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Section Body Content */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">
                      Content Body / Description
                    </label>
                    <textarea
                      rows={3}
                      value={section.content || ''}
                      onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })}
                      placeholder="Enter detailed content for this section..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed"
                    />
                  </div>

                  {/* Type Specific Fields: Lists, User Flows, Wireframes, Galleries */}
                  {(section.type === 'bullet-list' || section.type === 'user-flow' || section.type === 'numbered-list') && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <label className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Items / Steps List (One per line)</span>
                        <span className="text-[10px] text-blue-400">Enter each step on a new line</span>
                      </label>
                      <textarea
                        rows={4}
                        value={(section.items || []).map((it) => (typeof it === 'string' ? it : it.title || '')).join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          handleUpdateSection(section.id, { items: lines });
                        }}
                        placeholder="Search\nResults\nBooking Details\nPayment\nConfirmation"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  )}

                  {/* Gallery Image URLs */}
                  {section.type === 'gallery' && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <label className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Gallery Image URLs (One URL per line)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={(section.images || [])
                          .map((im) => (typeof im === 'string' ? im : im.url))
                          .join('\n')}
                        onChange={(e) => {
                          const urls = e.target.value.split('\n').filter((u) => u.trim().length > 0);
                          handleUpdateSection(section.id, {
                            images: urls.map((u) => ({ url: u })),
                          });
                        }}
                        placeholder="https://...\nhttps://..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  )}

                  {/* Embed URL (Prototype, Video, Link) */}
                  {(section.type === 'prototype' || section.type === 'video' || section.type === 'link') && (
                    <div className="space-y-1 pt-2 border-t border-slate-800/60">
                      <label className="text-[11px] font-mono text-slate-400">Embed / Target URL</label>
                      <input
                        type="url"
                        value={section.embedUrl || ''}
                        onChange={(e) => handleUpdateSection(section.id, { embedUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  )}

                  {/* Code Block Language */}
                  {section.type === 'code' && (
                    <div className="space-y-1 pt-2 border-t border-slate-800/60">
                      <label className="text-[11px] font-mono text-slate-400">Code Language</label>
                      <input
                        type="text"
                        value={section.codeLanguage || 'typescript'}
                        onChange={(e) => handleUpdateSection(section.id, { codeLanguage: e.target.value })}
                        placeholder="e.g., typescript, python, css"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0C1019] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold">
              Live Preview
            </span>
            <span className="text-xs text-slate-400">
              This is how your project will look on the public website.
            </span>
          </div>

          <ProjectView project={previewProject} isPreview={true} />
        </div>
      )}

      {/* MODAL: ADD SECTION TYPE PICKER */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#0C1019] border border-slate-700 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Select Section Type</h3>
                <p className="text-xs text-slate-400">Choose the type of content you want to add.</p>
              </div>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTION_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleAddSection(opt.type)}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-blue-600/15 border border-slate-800 hover:border-blue-500/40 text-left transition-all group space-y-1"
                >
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300">
                    {opt.label}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
