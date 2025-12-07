import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SkillForm {
    name: string;
    category: string;
    icon: string;
    description: string;
}

const SkillsManager = () => {
    const { getAll, add, update, remove, loading } = useFirestore('skills');
    const [skills, setSkills] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<SkillForm>();

    const CATEGORIES = [
        'AI & Automation Tools',
        'Programming Languages',
        'Data & Analytics Tools',
        'Testing & Automation Tools',
        'Version Control & Development',
        'Other'
    ];

    const fetchSkills = async () => {
        const data = await getAll();
        setSkills(data);
    };

    useEffect(() => {
        fetchSkills();
    }, [getAll]);

    const onSubmit = async (data: SkillForm) => {
        if (editingId) {
            await update(editingId, data);
            setSkills(prev => prev.map(s => s.id === editingId ? { ...s, ...data } : s));
        } else {
            const id = await add(data);
            if (id) {
                setSkills(prev => [{ id, ...data }, ...prev]);
            }
        }

        setIsModalOpen(false);
        reset();
        setEditingId(null);
        // fetchSkills();
    };

    const handleEdit = (skill: any) => {
        setEditingId(skill.id);
        setValue('name', skill.name);
        setValue('category', skill.category);
        setValue('icon', skill.icon);
        setValue('description', skill.description);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await remove(deleteId);
            setSkills(prev => prev.filter(s => s.id !== deleteId));
            setDeleteId(null);
            // fetchSkills();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-bold text-white relative inline-block">
                        Skills
                        <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></span>
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your technical skills</p>
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
                    <span>Add Skill</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill, index) => (
                    <div
                        key={skill.id}
                        className="bg-[#151030] p-5 rounded-xl border border-[#2b2b42] flex flex-col group hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                        style={{ animation: `zoomIn 0.5s ease-out ${index * 50}ms backwards` }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#1d1836] rounded-xl flex items-center justify-center overflow-hidden border border-[#2b2b42] group-hover:border-cyan-500 transition-colors shadow-inner">
                                {skill.icon && skill.icon.startsWith('http') ? (
                                    <img src={skill.icon} alt={skill.name} className="w-8 h-8 object-contain" />
                                ) : (
                                    <Wrench className="w-6 h-6 text-cyan-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{skill.name}</h3>
                                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#1d1836] rounded-md text-purple-400 border border-[#2b2b42]">
                                    {skill.category}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 flex-1">{skill.description}</p>

                        <div className="flex gap-2 pt-4 border-t border-[#2b2b42] mt-auto">
                            <button
                                onClick={() => handleEdit(skill)}
                                className="flex-1 bg-[#1d1836] hover:bg-white hover:text-purple-600 text-gray-400 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors group/btn"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(skill.id)}
                                className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors group/btn"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Skill' : 'Add New Skill'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
                        <input
                            {...register('name', { required: true })}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="e.g. Python"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <div className="relative">
                            <select
                                {...register('category', { required: true })}
                                className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all appearance-none"
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Icon URL (Optional)</label>
                        <input
                            {...register('icon')}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="Describe how this skill creates value..."
                        />
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
                            {loading ? 'Saving...' : 'Save Skill'}
                        </button>
                    </div>
                </form>
            </Modal>
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Skill"
                message="Are you sure you want to delete this skill? This action cannot be undone."
                isDestructive={true}
                isLoading={loading}
                confirmText="Yes, Delete Skill"
            />
        </div>
    );
};

export default SkillsManager;
