import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Pencil, Trash2, GraduationCap, Loader2, Calendar, BookOpen, Award } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface EducationForm {
  institution: string;
  degree: string;
  year: string;
  type: string;
  description: string;
}

const EducationManager = () => {
  const { getAll, add, update, remove, loading } = useFirestore('education');
  const [educations, setEducations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<EducationForm>();

  const fetchEducation = useCallback(async () => {
    const data = await getAll();
    setEducations(data);
  }, [getAll]);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const onSubmit = async (data: EducationForm) => {
    if (editingId) {
      await update(editingId, data);
      setEducations((prev) => prev.map((e) => (e.id === editingId ? { ...e, ...data } : e)));
    } else {
      const id = await add(data);
      if (id) {
        setEducations((prev) => [{ id, ...data }, ...prev]);
      }
    }

    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const handleEdit = (edu: any) => {
    setEditingId(edu.id);
    setValue('institution', edu.institution);
    setValue('degree', edu.degree);
    setValue('year', edu.year);
    setValue('type', edu.type || 'education');
    setValue('description', edu.description);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await remove(deleteId);
      setEducations((prev) => prev.filter((e) => e.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-admin-text font-display flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-admin-primary" />
            Education
          </h1>
          <p className="text-admin-text-muted mt-2 text-sm">
            Manage your academic background and certificates
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            reset();
            setIsModalOpen(true);
          }}
          className="group px-6 py-3 rounded-xl bg-admin-primary text-white hover:bg-indigo-600 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-500/20 font-medium"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add New Entry</span>
        </button>
      </div>

      {loading && educations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-admin-primary" />
          <p className="text-admin-text-muted">Loading academic record...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {educations.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-admin-card p-6 rounded-3xl border border-admin-border flex flex-col group hover:border-admin-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  {edu.type === 'certification' ? (
                    <Award className="w-32 h-32" />
                  ) : (
                    <BookOpen className="w-32 h-32" />
                  )}
                </div>

                <div className="flex items-start gap-5 mb-6 relative z-10">
                  <div className="w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-admin-border group-hover:border-admin-primary/50 transition-colors shadow-inner">
                    {edu.type === 'certification' ? (
                      <Award className="w-7 h-7 text-admin-primary" />
                    ) : (
                      <GraduationCap className="w-7 h-7 text-admin-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-admin-text group-hover:text-admin-primary transition-colors leading-tight">
                      {edu.degree}
                    </h3>
                    <p className="text-admin-text-muted font-medium mt-1">{edu.institution}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-admin-border">
                        <Calendar className="w-3.5 h-3.5 text-admin-primary" />
                        <span className="text-[11px] font-bold text-admin-text-muted">
                          {edu.year}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${edu.type === 'certification'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                      >
                        {edu.type || 'education'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-admin-text-muted text-sm mb-8 flex-1 leading-relaxed relative z-10 pl-1 border-l-2 border-admin-border group-hover:border-admin-primary/30 ml-7 transition-colors">
                  {edu.description}
                </p>

                <div className="flex gap-3 pt-6 border-t border-admin-border relative z-10">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-admin-text text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Pencil className="w-4 h-4 text-admin-primary" />
                    <span>Edit Entry</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(edu.id)}
                    className="px-4 py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white transition-all group/del flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && educations.length === 0 && (
        <div className="text-center py-20 bg-admin-card rounded-3xl border border-dashed border-admin-border">
          <BookOpen className="w-16 h-16 text-admin-text-muted mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-admin-text mb-2">Academic records empty</h3>
          <p className="text-admin-text-muted max-w-sm mx-auto mb-8">
            You haven't listed any education or certifications. Highlight your credentials here.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-admin-primary text-white rounded-xl hover:bg-indigo-600 transition-all font-medium"
          >
            Add My First Credential
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Entry' : 'Add New Entry'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Entry Type
              </label>
              <div className="relative">
                <select
                  {...register('type')}
                  className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="education" className="bg-admin-card">Education</option>
                  <option value="certification" className="bg-admin-card">Certification</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
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
                Degree / Certification Title
              </label>
              <input
                {...register('degree', { required: true })}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. BSc Computer Science"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Institution / Issuer
              </label>
              <input
                {...register('institution', { required: true })}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. University of Technology"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Year / Date Period
              </label>
              <input
                {...register('year', { required: true })}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. 2020 - 2024"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Description / Highlights
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600 resize-none"
                placeholder="Major achievements, honors, or relevant coursework..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-admin-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-admin-primary hover:bg-indigo-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-bold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Entry'
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Record"
        message="Are you sure you want to delete this educational record? This action cannot be undone."
        isDestructive={true}
        isLoading={loading}
        confirmText="Yes, Delete Record"
      />
    </div>
  );
};

export default EducationManager;
