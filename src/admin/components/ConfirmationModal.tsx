import { AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    isDestructive?: boolean;
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    isDestructive = false,
}: ConfirmationModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-admin-card rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden flex flex-col border border-admin-border relative z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Glow/Accent effect */}
                        <div
                            className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${isDestructive
                                ? 'from-red-500 via-orange-500 to-red-500'
                                : 'from-admin-primary via-indigo-400 to-admin-primary'
                                } shadow-[0_0_15px_rgba(99,102,241,0.5)]`}
                        />

                        <div className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isDestructive ? 'bg-red-500/10' : 'bg-admin-primary/10'
                                    } border border-white/5`}
                            >
                                <AlertTriangle
                                    className={`w-10 h-10 ${isDestructive ? 'text-red-500' : 'text-admin-primary'}`}
                                />
                            </motion.div>

                            <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
                            <p className="text-admin-text-muted text-sm mb-8 leading-relaxed px-4">{message}</p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="px-6 py-3 rounded-xl bg-white/5 border border-admin-border text-admin-text-muted hover:text-white hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-wider"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`px-6 py-3 rounded-xl text-white text-sm font-bold uppercase tracking-wider flex items-center gap-3 transition-all shadow-xl hover:bg-opacity-90 hover:scale-[1.02] active:scale-95 ${isDestructive
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                                        : 'bg-admin-primary hover:bg-indigo-600 shadow-indigo-500/30'
                                        }`}
                                >
                                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ConfirmationModal;
