import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
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

    const fetchEducation = async () => {
        const data = await getAll();
        setEducations(data);
    };

    useEffect(() => {
        fetchEducation();
    }, [getAll]);

    const onSubmit = async (data: EducationForm) => {
        if (editingId) {
            await update(editingId, data);
            setEducations(prev => prev.map(e => e.id === editingId ? { ...e, ...data } : e));
        } else {
            const id = await add(data);
            if (id) {
                setEducations(prev => [{ id, ...data }, ...prev]);
            }
        }

        setIsModalOpen(false);
        reset();
        setEditingId(null);
        // fetchEducation();
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
            setEducations(prev => prev.filter(e => e.id !== deleteId));
            setDeleteId(null);
            // fetchEducation();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <h1 className="text-3xl font-bold text-white relative inline-block">
                        Education & Certifications
                        <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></span>
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your academic background</p>
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
                    <span>Add Entry</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educations.map((edu, index) => (
                    <div
                        key={edu.id}
                        className="bg-[#151030] p-6 rounded-2xl border border-[#2b2b42] flex flex-col group hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden"
                        style={{ animation: `fadeInUp 0.5s ease-out ${index * 100}ms backwards` }}
                    >
                        {/* Hover glow effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500 -mr-10 -mt-10" />

                        <div className="flex items-start gap-4 mb-4 relative z-10">
                            <div className="p-3 bg-gradient-to-br from-[#1d1836] to-[#100d25] rounded-xl border border-[#2b2b42] group-hover:border-cyan-500/50 transition-colors">
                                <GraduationCap className="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{edu.degree}</h3>
                                <p className="text-purple-400 font-medium">{edu.institution}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-gray-500 text-xs font-mono">{edu.year}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize border ${edu.type === 'certification'
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                                        }`}>
                                        {edu.type || 'education'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-6 flex-1 relative z-10">{edu.description}</p>

                        <div className="flex gap-2 pt-4 border-t border-[#2b2b42] relative z-10 mt-auto">
                            <button
                                onClick={() => handleEdit(edu)}
                                className="flex-1 bg-[#1d1836] hover:bg-[#2b2b42] text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors group/btn"
                            >
                                <Pencil className="w-4 h-4 text-cyan-400 group-hover/btn:text-white transition-colors" />
                                <span className="text-sm">Edit</span>
                            </button>
                            <button
                                onClick={() => handleDeleteClick(edu.id)}
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors group/btn"
                            >
                                <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-sm">Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Entry' : 'Add New Entry'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Entry Type</label>
                        <div className="relative">
                            <select
                                {...register('type')}
                                className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all appearance-none"
                            >
                                <option value="education">Education</option>
                                <option value="certification">Certification</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Degree / Certification Title</label>
                        <input
                            {...register('degree', { required: true })}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="e.g. BSc Computer Science"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Institution / Issuer</label>
                        <input
                            {...register('institution', { required: true })}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="e.g. University of Technology"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Year / Date</label>
                        <input
                            {...register('year', { required: true })}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="e.g. 2020 - 2024"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description / Details</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full bg-[#1d1836] text-white px-4 py-3 rounded-lg border border-[#2b2b42] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                            placeholder="Score, honors, or brief stats..."
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
                            {loading ? 'Saving...' : 'Save Entry'}
                        </button>
                    </div>
                </form>
            </Modal>
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Education"
                message="Are you sure you want to delete this education entry? This action cannot be undone."
                isDestructive={true}
                isLoading={loading}
                confirmText="Yes, Delete Entry"
            />
        </div>
    );
};

export default EducationManager;
