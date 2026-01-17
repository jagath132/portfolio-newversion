import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Pencil, Trash2, ExternalLink, Github, FolderKanban, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProjectForm {
  name: string;
  description: string;
  tags: string; // Comma separated for input
  image: string;
  sourceCodeLink: string;
  demoLink?: string;
}

const ProjectManager = () => {
  const { getAll, add, update, remove, loading } = useFirestore('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<ProjectForm>();

  const fetchProjects = useCallback(async () => {
    const data = await getAll();
    setProjects(data);
  }, [getAll]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const onSubmit = async (data: ProjectForm) => {
    const formattedTags = data.tags.split(',').map((t) => ({
      name: t.trim(),
      color: 'blue-text-gradient',
    }));

    const projectData = {
      ...data,
      tags: formattedTags,
    };

    if (editingId) {
      await update(editingId, projectData);
      setProjects((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...projectData } : p)));
    } else {
      const id = await add(projectData);
      if (id) {
        setProjects((prev) => [{ id, ...projectData }, ...prev]);
      }
    }

    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setValue('name', project.name);
    setValue('description', project.description);
    setValue('tags', project.tags.map((t: any) => (typeof t === 'string' ? t : t.name)).join(', '));
    setValue('image', project.image);
    setValue('sourceCodeLink', project.sourceCodeLink);
    setValue('demoLink', project.demoLink);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await remove(deleteId);
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-admin-text font-display flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-admin-primary" />
            Projects
          </h1>
          <p className="text-admin-text-muted mt-2 text-sm">
            Manage your showcase projects and portfolio items
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
          <span>Add New Project</span>
        </button>
      </div>

      {loading && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-admin-primary" />
          <p className="text-admin-text-muted">Loading projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-admin-card rounded-2xl overflow-hidden border border-admin-border flex flex-col group hover:border-admin-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="relative h-48 bg-black/40 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-admin-text-muted bg-gradient-to-br from-admin-card to-black/20">
                      <FolderKanban className="w-10 h-10 mb-2 opacity-20" />
                      <span className="text-xs uppercase tracking-widest">No Preview</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-admin-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 gap-2">
                    {project.sourceCodeLink && (
                      <a
                        href={project.sourceCodeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-black transition-all"
                        title="View Source"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-black transition-all"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-admin-text group-hover:text-admin-primary transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-admin-text-muted text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.slice(0, 3).map((tag: any, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white/5 text-admin-text-muted border border-admin-border"
                      >
                        {typeof tag === 'string' ? tag : tag.name}
                      </span>
                    ))}
                    {project.tags?.length > 3 && (
                      <span className="text-[10px] font-semibold px-2 py-1 text-admin-text-muted">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-admin-border">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-admin-text text-sm font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      <Pencil className="w-4 h-4 text-admin-primary" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project.id)}
                      className="px-3 py-2 rounded-lg bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white transition-all group/del"
                    >
                      <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-20 bg-admin-card rounded-3xl border border-dashed border-admin-border">
          <FolderKanban className="w-16 h-16 text-admin-text-muted mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-admin-text mb-2">No projects found</h3>
          <p className="text-admin-text-muted max-w-sm mx-auto mb-8">
            You haven't added any projects yet. Start by adding your first showcase item.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-admin-primary text-white rounded-xl hover:bg-indigo-600 transition-all font-medium"
          >
            Create My First Project
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Project Title
              </label>
              <input
                {...register('name', { required: true })}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="e.g. AI-Powered Portfolio"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Description
              </label>
              <textarea
                {...register('description', { required: true })}
                rows={4}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600 resize-none"
                placeholder="Briefly describe the project, core technologies, and your role..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Tools & Tags
              </label>
              <input
                {...register('tags')}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="React, Firebase, Three.js"
              />
              <p className="text-[10px] text-admin-text-muted mt-2 ml-1">Separate tags with commas</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Preview Image URL
              </label>
              <input
                {...register('image')}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Source Code Link
              </label>
              <input
                {...register('sourceCodeLink')}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="https://github.com/yourusername/repo"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                Live Demo Link
              </label>
              <input
                {...register('demoLink')}
                className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                placeholder="https://my-awesome-project.vercel.app"
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
                'Save Project'
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This will permanently remove it from your portfolio."
        isDestructive={true}
        isLoading={loading}
        confirmText="Yes, Delete Project"
      />
    </div>
  );
};

export default ProjectManager;
