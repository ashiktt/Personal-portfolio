import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Save, 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Code2, 
  Palette, 
  Globe, 
  Tag 
} from 'lucide-react';
import { IconFigma, IconNetlify, IconDribbble, IconGithub } from '../ui/BrandIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { ToolItem, SkillGroup } from '../../types';

interface SkillsManagerProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ onShowToast }) => {
  const { 
    tools, 
    skillGroups, 
    addTool, 
    updateTool, 
    deleteTool, 
    reorderTools,
    addSkillGroup,
    updateSkillGroup,
    deleteSkillGroup,
    addSkillItem,
    removeSkillItem
  } = usePortfolio();

  // Tool Form State
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [toolForm, setToolForm] = useState<{
    name: string;
    category: string;
    description: string;
    badge: string;
    iconType: ToolItem['iconType'];
  }>({
    name: '',
    category: 'UI/UX Design & Prototyping',
    description: '',
    badge: 'Core Tool',
    iconType: 'figma',
  });

  // Group Form State
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupCategory, setNewGroupCategory] = useState('');
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});

  // Tool Handlers
  const handleStartAddTool = () => {
    setEditingToolId(null);
    setToolForm({
      name: '',
      category: 'UI/UX Design & Prototyping',
      description: '',
      badge: 'Core Tool',
      iconType: 'figma',
    });
    setIsEditingTool(true);
  };

  const handleStartEditTool = (tool: ToolItem) => {
    setEditingToolId(tool.id);
    setToolForm({
      name: tool.name,
      category: tool.category,
      description: tool.description,
      badge: tool.badge,
      iconType: tool.iconType,
    });
    setIsEditingTool(true);
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolForm.name.trim() || !toolForm.description.trim()) {
      onShowToast('error', 'Validation Error', 'Tool name and description are required.');
      return;
    }

    if (editingToolId) {
      updateTool(editingToolId, toolForm);
      onShowToast('success', 'Tool Updated', `"${toolForm.name}" was updated.`);
    } else {
      addTool(toolForm);
      onShowToast('success', 'Tool Added', `"${toolForm.name}" was added to design stack.`);
    }

    setIsEditingTool(false);
    setEditingToolId(null);
  };

  const handleDeleteTool = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      deleteTool(id);
      onShowToast('info', 'Tool Removed', `"${name}" was deleted.`);
    }
  };

  const handleMoveTool = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tools.length) return;

    const listCopy = [...tools];
    const temp = listCopy[index];
    listCopy[index] = listCopy[newIndex];
    listCopy[newIndex] = temp;

    reorderTools(listCopy);
    onShowToast('info', 'Order Saved', 'Tools display order updated.');
  };

  // Group Handlers
  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupCategory.trim()) return;

    addSkillGroup({
      category: newGroupCategory.trim(),
      items: [],
    });

    onShowToast('success', 'Category Created', `"${newGroupCategory}" group added.`);
    setNewGroupCategory('');
    setIsAddingGroup(false);
  };

  const handleDeleteGroup = (id: string, category: string) => {
    if (window.confirm(`Delete skill category "${category}" and all its skills?`)) {
      deleteSkillGroup(id);
      onShowToast('info', 'Category Removed', `"${category}" was deleted.`);
    }
  };

  const handleAddSkillToGroup = (groupId: string) => {
    const inputVal = (newSkillInputs[groupId] || '').trim();
    if (!inputVal) return;

    addSkillItem(groupId, inputVal);
    setNewSkillInputs((prev) => ({ ...prev, [groupId]: '' }));
    onShowToast('success', 'Skill Added', `Added "${inputVal}" to group.`);
  };

  const renderIconPreview = (iconType: ToolItem['iconType']) => {
    switch (iconType) {
      case 'figma':
        return <IconFigma className="w-5 h-5" />;
      case 'netlify':
        return <IconNetlify className="w-5 h-5" />;
      case 'dribbble':
        return <IconDribbble className="w-5 h-5 text-[#EA4C89]" />;
      case 'github':
        return <IconGithub className="w-5 h-5 text-white" />;
      case 'code':
        return <Code2 className="w-5 h-5 text-blue-400" />;
      case 'design':
        return <Palette className="w-5 h-5 text-indigo-400" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-sky-400" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      default:
        return <Layers className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-12">
      
      {/* SECTION 1: PRIMARY TOOLS MANAGER */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span>Primary Tools &amp; Technologies</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage the visual tool cards shown in your portfolio header and skills section.
            </p>
          </div>

          {!isEditingTool && (
            <button
              onClick={handleStartAddTool}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Tool</span>
            </button>
          )}
        </div>

        {/* Inline Add / Edit Tool Form */}
        {isEditingTool && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1322] border border-blue-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                {editingToolId ? 'Edit Tool' : 'Add New Tool Card'}
              </h3>
              <button
                onClick={() => setIsEditingTool(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTool} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Tool Name <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Figma / Framer / Blender"
                    value={toolForm.name}
                    onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Category Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. UI/UX Design &amp; Prototyping"
                    value={toolForm.category}
                    onChange={(e) => setToolForm({ ...toolForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Badge Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Core Tool / Prototyping"
                    value={toolForm.badge}
                    onChange={(e) => setToolForm({ ...toolForm, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Icon Choice</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                  {(['figma', 'netlify', 'dribbble', 'github', 'design', 'code', 'layers', 'cpu', 'sparkles'] as const).map((iconKey) => (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setToolForm({ ...toolForm, iconType: iconKey })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        toolForm.iconType === iconKey
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {renderIconPreview(iconKey)}
                      <span className="text-[10px] capitalize">{iconKey}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Description <span className="text-blue-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="How you use this tool in your UX design workflow..."
                  value={toolForm.description}
                  onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingToolId ? 'Update Tool' : 'Save & Add Tool'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTool(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tools List Table */}
        <div className="rounded-2xl bg-[#0E1322]/80 border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
          {tools.map((tool, idx) => (
            <div
              key={tool.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {renderIconPreview(tool.iconType)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{tool.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Reorder Buttons */}
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                  <button
                    onClick={() => handleMoveTool(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveTool(idx, 'down')}
                    disabled={idx === tools.length - 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleStartEditTool(tool)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                  title="Edit tool"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteTool(tool.id, tool.name)}
                  className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300"
                  title="Delete tool"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: UI/UX COMPETENCY MATRIX & SKILL GROUPS */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>UI/UX Competency Skill Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add custom categories and skill pills (User Research, Prototyping, Accessibility, Design Tokens, etc.).
            </p>
          </div>

          {!isAddingGroup && (
            <button
              onClick={() => setIsAddingGroup(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill Category</span>
            </button>
          )}
        </div>

        {/* Add Group Modal */}
        {isAddingGroup && (
          <form onSubmit={handleAddGroup} className="p-5 rounded-2xl bg-[#0E1322] border border-indigo-500/40 space-y-4">
            <h4 className="text-sm font-bold text-white">Create New Skill Category</h4>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. AI-Assisted UX / Motion Design / Product Strategy"
                value={newGroupCategory}
                onChange={(e) => setNewGroupCategory(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsAddingGroup(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              className="p-5 rounded-2xl bg-[#0E1322]/90 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{group.category}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteGroup(group.id, group.category)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Skills Pill List */}
                <div className="flex flex-wrap gap-1.5 min-h-[60px]">
                  {group.items.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No skills in this category yet.</span>
                  ) : (
                    group.items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 group/pill"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkillItem(group.id, sIdx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors ml-0.5"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Add Skill Pill Input */}
              <div className="pt-2 border-t border-slate-800/80 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Add skill pill (e.g. Design Tokens)..."
                  value={newSkillInputs[group.id] || ''}
                  onChange={(e) =>
                    setNewSkillInputs({ ...newSkillInputs, [group.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkillToGroup(group.id);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkillToGroup(group.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
