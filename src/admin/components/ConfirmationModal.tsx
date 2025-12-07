import { AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

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
    isDestructive = false
}: ConfirmationModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-[#151030] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-[#2b2b42] animate-in zoom-in-95 duration-200 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Glow effect */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${isDestructive ? 'from-red-500 via-orange-500 to-red-500' : 'from-purple-500 via-cyan-500 to-purple-500'}`} />

                <div className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDestructive ? 'bg-red-500/10' : 'bg-purple-500/10'}`}>
                        <AlertTriangle className={`w-8 h-8 ${isDestructive ? 'text-red-500' : 'text-purple-500'}`} />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-xl bg-[#1d1836] border border-[#2b2b42] text-gray-300 hover:text-white hover:bg-[#2b2b42] transition-colors text-sm font-medium"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-all shadow-lg hover:bg-opacity-90 hover:scale-105 active:scale-95 ${isDestructive
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-gradient-to-r from-purple-600 to-cyan-600 shadow-purple-500/20'
                                }`}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
