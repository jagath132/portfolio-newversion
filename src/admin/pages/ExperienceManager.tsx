import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ExperienceForm {
    title: string;
    companyName: string;
    date: string;
    points: string; // Text area for points, split by newline
    iconBg: string;
}

const ExperienceManager = () => {
    const { getAll, add, update, remove, loading } = useFirestore('experience');
    const [experiences, setExperiences] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<ExperienceForm>();

    const fetchExperience = async () => {
        const data = await getAll();
        setExperiences(data);
    };

    useEffect(() => {
        fetchExperience();
    }, [getAll]);

    const onSubmit = async (data: ExperienceForm) => {
        const formattedPoints = data.points.split('\n').filter(p => p.trim() !== '');

        const expData = {
            ...data,
            points: formattedPoints,
            icon: 'work', // Placeholder for icon mapping
        };

        if (editingId) {
            await update(editingId, expData);
            setExperiences(prev => prev.map(e => e.id === editingId ? { ...e, ...expData } : e));
        } else {
            const id = await add(expData);
            if (id) {
                setExperiences(prev => [{ id, ...expData }, ...prev]);
            }
        }

        setIsModalOpen(false);
        reset();
        setEditingId(null);
        // fetchExperience();
    };

    const handleEdit = (exp: any) => {
        setEditingId(exp.id);
        setValue('title', exp.title);
        setValue('companyName', exp.companyName);
        setValue('date', exp.date);
        setValue('iconBg', exp.iconBg);
        setValue('points', Array.isArray(exp.points) ? exp.points.join('\n') : exp.points);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await remove(deleteId);
            setExperiences(prev => prev.filter(e => e.id !== deleteId));
            setDeleteId(null);
            // fetchExperience();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-bold text-white relative inline-block">
                        Experience
                        <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></span>
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your work history</p>
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
                    <span>Add Experience</span>
                </button>
            </div>

            <div className="space-y-4">
                {experiences.map((exp, index) => (
                    <div
                        key={exp.id}
                        className="bg-[#151030] p-6 rounded-2xl border border-[#2b2b42] flex justify-between items-start group hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        style={{ animation: `fadeInLeft 0.5s ease-out ${index * 100}ms backwards` }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-4 bg-[#1d1836] rounded-xl border border-[#2b2b42] group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-cyan-500 transition-all duration-300">
                                <Briefcase className="w-6 h-6 text-cyan-400 group-hover:text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{exp.title}</h3>
                                <p className="text-purple-400 font-medium">{exp.companyName}</p>
                                <p className="text-gray-500 text-sm mb-3 mt-1">{exp.date}</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm pl-2 border-l-2 border-[#2b2b42] group-hover:border-purple-500/50 transition-colors ml-1">
                                    {exp.points?.slice(0, 2).map((point: string, idx: number) => (
                                        <li key={idx} className="line-clamp-1">{point}</li>
                                    ))}
                                    {exp.points?.length > 2 && <li>...and {exp.points.length - 2} more</li>}
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={() => handleEdit(exp)}
                                className="p-2 bg-[#1d1836] hover:bg-white hover:text-purple-600 text-gray-400 rounded-lg transition-all transform hover:scale-110"
                                title="Edit"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(exp.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all transform hover:scale-110"
                                title="Delete"
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
                title={editingId ? 'Edit Experience' : 'Add New Experience'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                        <input
                            {...register('title', { required: true })}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="e.g. Senior Developer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                            <input
                                {...register('companyName', { required: true })}
                                className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                                placeholder="Google"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                            <input
                                {...register('date', { required: true })}
                                className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                                placeholder="Jan 2023 - Present"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Background Color (Hex)</label>
                        <input
                            {...register('iconBg')}
                            defaultValue="#383E56"
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="#383E56"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Responsibilties (One per line)</label>
                        <textarea
                            {...register('points', { required: true })}
                            rows={6}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="- Developed feature X..."
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
                            {loading ? 'Saving...' : 'Save Experience'}
                        </button>
                    </div>
                </form>
            </Modal>
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Experience"
                message="Are you sure you want to delete this experience entry? This action cannot be undone."
                isDestructive={true}
                isLoading={loading}
                confirmText="Yes, Delete Entry"
            />
        </div>
    );
};

export default ExperienceManager;
