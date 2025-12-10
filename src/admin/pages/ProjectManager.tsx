import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Pencil, Trash2, ExternalLink, Github } from 'lucide-react';
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

  const fetchProjects = async () => {
    const data = await getAll();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, [getAll]);

  const onSubmit = async (data: ProjectForm) => {
    // Process tags from string to array if needed, or keep as string for now to match UI
    // The main portfolio expects tags as an array of { name, color } objects.
    // We will simplify for now and store just strings, or we can automap colors.

    const formattedTags = data.tags.split(',').map(t => ({
      name: t.trim(),
      color: 'blue-text-gradient', // Default color
    }));

    const projectData = {
      ...data,
      tags: formattedTags,
    };

    if (editingId) {
      await update(editingId, projectData);
      setProjects(prev => prev.map(p => (p.id === editingId ? { ...p, ...projectData } : p)));
    } else {
      const id = await add(projectData);
      if (id) {
        setProjects(prev => [{ id, ...projectData }, ...prev]);
      }
    }

    setIsModalOpen(false);
    reset();
    setEditingId(null);
    // fetchProjects(); // Removed to improve performance
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setValue('name', project.name);
    setValue('description', project.description);
    setValue('tags', project.tags.map((t: any) => t.name).join(', '));
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
      setProjects(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
      // fetchProjects();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white relative inline-block">
            Projects
            <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></span>
          </h1>
          <p className="text-gray-400 mt-2">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            reset();
            setIsModalOpen(true);
          }}
          className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="bg-[#151030] rounded-2xl overflow-hidden border border-[#2b2b42] flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
            style={{ animation: `fadeInUp 0.5s ease-out ${index * 100}ms backwards` }}
          >
            <div className="relative h-48 bg-[#090325] overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-[#1d1836] to-[#100d25]">
                  <span className="text-sm">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                {project.sourceCodeLink && (
                  <a
                    href={project.sourceCodeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-gray-900 rounded-full text-white hover:text-cyan-400 hover:bg-white transition-all transform hover:scale-110"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-gray-900 rounded-full text-white hover:text-purple-400 hover:bg-white transition-all transform hover:scale-110"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.slice(0, 3).map((tag: any, i: number) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded-full bg-[#1d1836] text-gray-300 border border-[#2b2b42]"
                  >
                    #{typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#2b2b42] mt-auto">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 bg-[#1d1836] hover:bg-[#2b2b42] text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors group/btn"
                >
                  <Pencil className="w-4 h-4 text-cyan-400 group-hover/btn:text-white transition-colors" />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(project.id)}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors group/btn"
                >
                  <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
            <input
              {...register('name', { required: true })}
              className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
              placeholder="e.g. Sales Analytics Dashboard"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              {...register('description', { required: true })}
              rows={4}
              className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
              placeholder="Project description and methodology..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tools/Tags (comma separated)
            </label>
            <input
              {...register('tags')}
              className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
              placeholder="React, Python, SQL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
            <input
              {...register('image')}
              className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Github Link</label>
              <input
                {...register('sourceCodeLink')}
                className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Demo Link</label>
              <input
                {...register('demoLink')}
                className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        isDestructive={true}
        isLoading={loading}
        confirmText="Yes, Delete Project"
      />
    </div>
  );
};

export default ProjectManager;
