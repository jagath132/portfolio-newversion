import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Pencil, Trash2, Briefcase, Upload, Loader2, Calendar, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { toast } from 'react-toastify';

interface ExperienceForm {
  title: string;
  companyName: string;
  date: string;
  points: string; // Text area for points, split by newline
  icon: string;
}

const ExperienceManager = () => {
  const { getAll, add, update, remove, loading } = useFirestore('experience');
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<ExperienceForm>();

  const fetchExperience = useCallback(async () => {
    const data = await getAll();
    setExperiences(data);
  }, [getAll]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const onSubmit = async (data: ExperienceForm) => {
    const formattedPoints = data.points.split('\n').filter((p) => p.trim() !== '');

    const expData = {
      ...data,
      points: formattedPoints,
      icon: data.icon || 'work',
    };

    if (editingId) {
      await update(editingId, expData);
      setExperiences((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...expData } : e))
      );
    } else {
      const id = await add(expData);
      if (id) {
        setExperiences((prev) => [{ id, ...expData }, ...prev]);
      }
    }

    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setValue('title', exp.title);
    setValue('companyName', exp.companyName);
    setValue('date', exp.date);
    setValue('icon', exp.icon);
    setValue('points', Array.isArray(exp.points) ? exp.points.join('\n') : exp.points);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await remove(deleteId);
      setExperiences((prev) => prev.filter((e) => e.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `companies/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setValue('icon', downloadURL);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-admin-text font-display flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-admin-primary" />
            Experience
          </h1>
          <p className="text-admin-text-muted mt-2 text-sm">
            Manage your professional journey and career milestones
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
          <span>Add Experience</span>
        </button>
      </div>

      {loading && experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-admin-primary" />
          <p className="text-admin-text-muted">Loading career history...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-admin-card rounded-2xl border border-admin-border overflow-hidden flex flex-col group hover:border-admin-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border border-white/10 bg-black/20"
                  >
                    {exp.icon && exp.icon !== 'work' ? (
                      <img src={exp.icon} alt={exp.companyName} className="w-10 h-10 object-contain" />
                    ) : (
                      <Briefcase className="w-8 h-8 text-admin-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-admin-text group-hover:text-admin-primary transition-colors">
                          {exp.title}
                        </h3>
                        <p className="text-admin-primary text-sm font-semibold">{exp.companyName}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-admin-border w-fit">
                        <Calendar className="w-3.5 h-3.5 text-admin-text-muted" />
                        <span className="text-[11px] font-medium text-admin-text-muted">
                          {exp.date}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {Array.isArray(exp.points) && exp.points.slice(0, 3).map((point: string, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-admin-primary flex-shrink-0" />
                          <p className="text-admin-text-muted text-sm leading-relaxed line-clamp-2">
                            {point}
                          </p>
                        </div>
                      ))}
                      {Array.isArray(exp.points) && exp.points.length > 3 && (
                        <p className="text-[10px] text-admin-primary font-bold ml-4 uppercase tracking-widest">
                          + {exp.points.length - 3} more achievements
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-admin-border">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-admin-text text-sm font-medium flex items-center justify-center gap-2 transition-all"
                      >
                        <Pencil className="w-4 h-4 text-admin-primary" />
                        <span>Edit Details</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(exp.id)}
                        className="px-4 py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white transition-all group/del flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && experiences.length === 0 && (
        <div className="text-center py-20 bg-admin-card rounded-3xl border border-dashed border-admin-border">
          <Target className="w-16 h-16 text-admin-text-muted mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-admin-text mb-2">No professional history</h3>
          <p className="text-admin-text-muted max-w-sm mx-auto mb-8">
            Your career track is currently empty. Add your work experience to show your growth.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-admin-primary text-white rounded-xl hover:bg-indigo-600 transition-all font-medium"
          >
            Add My First Role
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Experience' : 'Add New Experience'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Job Title
              </label>
              <input
                {...register('title', { required: true })}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Company Name
              </label>
              <input
                {...register('companyName', { required: true })}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. Google"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Company Logo URL / Upload
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  {...register('icon')}
                  className="flex-1 bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                  placeholder="https://example.com/logo.png"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-admin-border cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap ${uploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-admin-primary" />
                    ) : (
                      <Upload className="w-4 h-4 text-admin-text-muted" />
                    )}
                    <span className="text-sm font-medium text-admin-text-muted">Upload Logo</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Duration / Date Range
              </label>
              <input
                {...register('date', { required: true })}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. Jan 2022 - Present"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Achievements (One per line)
              </label>
              <textarea
                {...register('points', { required: true })}
                rows={5}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600 resize-none font-sans"
                placeholder="• Optimized application performance by 40%&#10;• Led a team of 5 developers..."
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
                'Save Experience'
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Experience"
        message="Are you sure you want to remove this role? This data will be permanently deleted."
        isDestructive={true}
        isLoading={loading}
        confirmText="Yes, Delete Entry"
      />
    </div>
  );
};

export default ExperienceManager;
