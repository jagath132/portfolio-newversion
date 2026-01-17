import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Pencil, Trash2, Wrench, Loader2, Sparkles, Settings2, X as XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface SkillForm {
  name: string;
  category: string;
  icon: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
}

const DEFAULT_CATEGORIES = [
  'AI & Automation Tools',
  'Programming Languages',
  'Data & Analytics Tools',
  'Testing & Automation Tools',
  'Version Control & Development',
  'Other',
];

const SkillsManager = () => {
  // Skills Firestore
  const { getAll: getAllSkills, add: addSkill, update: updateSkill, remove: removeSkill, loading: skillsLoading } = useFirestore('skills');

  // Categories Firestore
  const { getAll: getAllCategories, add: addCategory, update: updateCategory, remove: removeCategory, loading: categoriesLoading } = useFirestore('skill_categories');

  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Modal States
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const { register, handleSubmit, reset, setValue } = useForm<SkillForm>();

  // Fetch all data
  const fetchData = useCallback(async () => {
    const [fetchedSkills, fetchedCategories] = await Promise.all([getAllSkills(), getAllCategories()]);
    setSkills(fetchedSkills);

    if (fetchedCategories.length === 0) {
      // Seed default categories if empty
      // Double check to ensure we don't duplicate on strict mode / race
      const promises = DEFAULT_CATEGORIES.map(name => addCategory({ name }));
      await Promise.all(promises);
      // Re-fetch to get IDs
      const seeded = await getAllCategories();
      setCategories(seeded.map((c: any) => ({ id: c.id, name: c.name })));
    } else {
      // Deduplicate categories by name (keep first occurrence)
      const uniqueCategories = new Map();
      fetchedCategories.forEach((c: any) => {
        if (!uniqueCategories.has(c.name)) {
          uniqueCategories.set(c.name, { id: c.id, name: c.name });
        }
      });
      setCategories(Array.from(uniqueCategories.values()));
    }
  }, [getAllSkills, getAllCategories, addCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Skill Handlers ---

  const onSkillSubmit = async (data: SkillForm) => {
    if (editingId) {
      await updateSkill(editingId, data);
      setSkills((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...data } : s)));
    } else {
      const id = await addSkill(data);
      if (id) {
        setSkills((prev) => [{ id, ...data }, ...prev]);
      }
    }

    setIsSkillModalOpen(false);
    reset();
    setEditingId(null);
  };

  const handleEditSkill = (skill: any) => {
    setEditingId(skill.id);
    setValue('name', skill.name);
    setValue('category', skill.category);
    setValue('icon', skill.icon);
    setValue('description', skill.description);
    setIsSkillModalOpen(true);
  };

  const confirmDeleteSkill = async () => {
    if (deleteId) {
      await removeSkill(deleteId);
      setSkills((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    }
  };

  // --- Category Handlers ---

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    // Check for duplicates locally
    if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('Category already exists');
      return;
    }

    const id = await addCategory({ name: trimmedName });
    if (id) {
      setCategories(prev => [...prev, { id, name: trimmedName }]);
      setNewCategoryName('');
      toast.success('Category added');
    }
  };

  const handleUpdateCategory = async (id: string, newName: string) => {
    if (!newName.trim()) return;

    // Find old name to update associated skills
    const oldCategory = categories.find(c => c.id === id);
    if (!oldCategory) return;

    await updateCategory(id, { name: newName.trim() });

    // Batch update skills (client-side optimistic + server)
    const skillsToUpdate = skills.filter(s => s.category === oldCategory.name);

    // Update skills in Firestore
    for (const skill of skillsToUpdate) {
      await updateSkill(skill.id, { category: newName.trim() });
    }

    // Update local state
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName.trim() } : c));
    setSkills(prev => prev.map(s => s.category === oldCategory.name ? { ...s, category: newName.trim() } : s));

    setEditingCategory(null);
    toast.success('Category updated');
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Delete this category? Skills using it will keep the category name but it will remove it from the list.')) {
      await removeCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const loading = skillsLoading || categoriesLoading;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-admin-text font-display flex items-center gap-3">
            <Wrench className="w-8 h-8 text-admin-primary" />
            Skills Manager
          </h1>
          <p className="text-admin-text-muted mt-2 text-sm">
            Manage your technical toolkit and categories
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="group px-4 py-3 rounded-xl bg-admin-card border border-admin-border text-admin-text hover:bg-admin-card-hover transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <Settings2 className="w-5 h-5 text-admin-text-muted group-hover:text-admin-text transition-colors" />
            <span>Categories</span>
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              reset();
              setIsSkillModalOpen(true);
            }}
            className="group px-6 py-3 rounded-xl bg-admin-primary text-white hover:bg-sky-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-sky-500/20 font-medium"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {loading && skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-admin-primary" />
          <p className="text-admin-text-muted">Syncing technical inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-admin-card p-6 rounded-2xl border border-admin-border flex flex-col group hover:border-admin-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center overflow-hidden border border-admin-border group-hover:border-admin-primary transition-colors shadow-inner flex-shrink-0">
                    {skill.icon && skill.icon.startsWith('http') ? (
                      <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-admin-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-admin-text group-hover:text-admin-primary transition-colors truncate">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-admin-primary/80">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <p className="text-admin-text-muted text-sm mb-6 flex-1 leading-relaxed">
                  {skill.description || `Proficient in ${skill.name} development.`}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-admin-border">
                  <button
                    onClick={() => handleEditSkill(skill)}
                    className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-admin-text text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Pencil className="w-4 h-4 text-admin-primary" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteId(skill.id)}
                    className="py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-all group/del"
                  >
                    <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && skills.length === 0 && (
        <div className="text-center py-20 bg-admin-card rounded-3xl border border-dashed border-admin-border">
          <Sparkles className="w-16 h-16 text-admin-text-muted mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-admin-text mb-2">No skills discovered</h3>
          <p className="text-admin-text-muted max-w-sm mx-auto mb-8">
            Your technical arsenal is currently empty. Start building it up!
          </p>
          <button
            onClick={() => setIsSkillModalOpen(true)}
            className="px-6 py-2 bg-admin-primary text-white rounded-xl hover:bg-sky-600 transition-all font-medium"
          >
            Add My First Skill
          </button>
        </div>
      )}

      {/* --- ADD/EDIT SKILL MODAL --- */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title={editingId ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit(onSkillSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Skill Name
              </label>
              <input
                {...register('name', { required: true })}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. TypeScript"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  {...register('category', { required: true })}
                  className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name} className="bg-admin-card">
                      {c.name}
                    </option>
                  ))}
                  {/* Fallback for current skill category if not in list */}
                  {editingId && skills.find(s => s.id === editingId) &&
                    !categories.find(c => c.name === skills.find(s => s.id === editingId).category) && (
                      <option value={skills.find(s => s.id === editingId).category} className="bg-admin-card">
                        {skills.find(s => s.id === editingId).category} (Archived)
                      </option>
                    )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-admin-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Icon URL (Optional)
              </label>
              <input
                {...register('icon')}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. https://cdn.worldvectorlogo.com/logos/typescript.svg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600 resize-none"
                placeholder="Describe your level of expertise or major use cases..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSkillModalOpen(false)}
              className="px-6 py-2.5 text-admin-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-admin-primary hover:bg-sky-600 text-white rounded-xl transition-all shadow-lg shadow-sky-500/20 font-bold flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MANAGE CATEGORIES MODAL --- */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Manage Categories"
      >
        <div className="space-y-6">
          {/* Add New Category */}
          <div className="flex gap-2">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New Category Name..."
              className="flex-1 bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-admin-primary hover:bg-sky-600 text-white rounded-xl transition-all font-bold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* List Categories */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl group border border-transparent hover:border-admin-border transition-all">

                {editingCategory?.id === category.id ? (
                  <div className="flex-1 flex items-center gap-2 mr-2">
                    <input
                      autoFocus
                      defaultValue={category.name}
                      onBlur={(e) => handleUpdateCategory(category.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateCategory(category.id, e.currentTarget.value);
                        if (e.key === 'Escape') setEditingCategory(null);
                      }}
                      className="w-full bg-black/40 text-admin-text px-2 py-1 rounded-lg border border-admin-primary outline-none"
                    />
                    <button onClick={() => setEditingCategory(null)} className="p-1 hover:bg-white/10 rounded-lg">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-admin-text font-medium ml-2">{category.name}</span>
                )}

                <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-2 text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-admin-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center text-admin-text-muted py-4">No categories found.</p>
            )}
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDeleteSkill}
        title="Delete Skill"
        message="Are you sure you want to delete this skill?"
        isDestructive={true}
        isLoading={skillsLoading}
        confirmText="Yes, Delete Skill"
      />
    </div>
  );
};

export default SkillsManager;
