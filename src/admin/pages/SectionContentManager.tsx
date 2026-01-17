import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, Save, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { config } from '../../constants/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface SectionContent {
    id: string; // 'about', 'experience', etc.
    p: string; // Subtitle
    h2: string; // Title
    content?: string; // Description
}

const SECTIONS = [
    { id: 'about', label: 'About Section' },
    { id: 'skills', label: 'Skills Section' },
    { id: 'experience', label: 'Experience Section' },
    { id: 'works', label: 'Projects/Works Section' },
    // Education usually has no content, just p and h2, but we can include it.
    { id: 'education', label: 'Education Section' },
    // Contact section structure is different in config, but we can standardize or handle it separately.
    // config.contact has p, h2, content not explicitly but implied.
    // Let's stick to the main ones first.
];

const SectionContentManager = () => {
    const [selectedSection, setSelectedSection] = useState(SECTIONS[0].id);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue } = useForm<SectionContent>();

    // We don't strictly use useFirestore hook's getAll here because we want specific document IDs
    // based on the section name.

    const fetchSectionData = async (sectionId: string) => {
        setLoading(true);
        try {
            const docRef = doc(db, 'section_contents', sectionId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as SectionContent;
                setValue('p', data.p);
                setValue('h2', data.h2);
                setValue('content', data.content || '');
            } else {
                // Fallback to config default if not found in DB
                const defaultConfig = config.sections[sectionId as keyof typeof config.sections];
                if (defaultConfig) {
                    setValue('p', defaultConfig.p);
                    setValue('h2', defaultConfig.h2);
                    setValue('content', defaultConfig.content || '');
                }
            }
        } catch (error) {
            console.error("Error fetching section data:", error);
            toast.error("Failed to load section data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSectionData(selectedSection);
    }, [selectedSection]);

    const onSubmit = async (data: SectionContent) => {
        setLoading(true);
        try {
            await setDoc(doc(db, 'section_contents', selectedSection), {
                ...data,
                updatedAt: new Date().toISOString()
            });
            toast.success(`${SECTIONS.find(s => s.id === selectedSection)?.label} updated successfully!`);
        } catch (error) {
            console.error("Error saving section data:", error);
            toast.error("Failed to save changes");
        } finally {
            setLoading(false);
        }
    };

    const handleResetToDefault = () => {
        if (window.confirm('Are you sure you want to reset this section to the hardcoded defaults? Unsaved changes will be lost.')) {
            const defaultConfig = config.sections[selectedSection as keyof typeof config.sections];
            if (defaultConfig) {
                setValue('p', defaultConfig.p);
                setValue('h2', defaultConfig.h2);
                setValue('content', defaultConfig.content || '');
                toast.info('Reset to defaults (not saved yet). Click Save to persist.');
            }
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-admin-text font-display flex items-center gap-3">
                        <FileText className="w-8 h-8 text-admin-primary" />
                        Section Content Manager
                    </h1>
                    <p className="text-admin-text-muted mt-2 text-sm">
                        Edit the titles, subtitles, and descriptions of your portfolio sections.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar for Section Selection */}
                <div className="lg:col-span-1 space-y-2">
                    <h3 className="text-sm font-bold text-admin-text-muted uppercase tracking-wider mb-4 px-2">Sections</h3>
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setSelectedSection(section.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-between group ${selectedSection === section.id
                                ? 'bg-admin-primary/10 text-admin-primary border border-admin-primary/20'
                                : 'bg-admin-card text-admin-text-muted hover:text-white hover:bg-admin-card-hover border border-transparent'
                                }`}
                        >
                            {section.label}
                            {selectedSection === section.id && (
                                <motion.div layoutId="active-section-indicator" className="w-1.5 h-1.5 rounded-full bg-admin-primary" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={selectedSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-admin-card p-8 rounded-3xl border border-admin-border shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-admin-border pb-6">
                            <h2 className="text-xl font-bold text-white">
                                Editing: <span className="text-admin-primary">{SECTIONS.find(s => s.id === selectedSection)?.label}</span>
                            </h2>
                            <button
                                onClick={handleResetToDefault}
                                className="text-xs font-bold text-admin-text-muted hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                type="button"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Reset to Default
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                                        Subtitle (p)
                                    </label>
                                    <input
                                        {...register('p')}
                                        className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                                        placeholder="e.g. Introduction"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                                        Title (h2)
                                    </label>
                                    <input
                                        {...register('h2')}
                                        className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600"
                                        placeholder="e.g. Overview."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-admin-text-muted mb-2">
                                    Description Content
                                </label>
                                <textarea
                                    {...register('content')}
                                    rows={10}
                                    className="w-full bg-black/20 text-admin-text px-4 py-3 rounded-xl border border-admin-border focus:border-admin-primary focus:ring-1 focus:ring-admin-primary outline-none transition-all placeholder:text-gray-600 resize-none font-mono text-sm leading-relaxed"
                                    placeholder="Enter the main content text for this section..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-admin-primary hover:bg-sky-600 text-white rounded-xl transition-all shadow-lg shadow-sky-500/20 font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SectionContentManager;
