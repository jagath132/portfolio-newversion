import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-admin-bg flex font-display text-admin-text overflow-hidden">
            {/* Left Section - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Admin<span className="text-admin-primary">Portal</span></span>
                        </div>
                        <h1 className="text-4xl font-bold mt-8 tracking-tight">Create an account</h1>
                        <p className="text-admin-text-muted mt-2">Join us to manage your portfolio efficiently.</p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        onSubmit={handleSignup}
                        className="space-y-5"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-admin-text-muted">Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-admin-card/50 border border-admin-border rounded-xl px-4 py-3.5 text-admin-text focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary outline-none transition-all placeholder:text-gray-600 font-sans group-hover:bg-admin-card"
                                    placeholder="admin@portfolio.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-admin-text-muted">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-admin-card/50 border border-admin-border rounded-xl px-4 py-3.5 text-admin-text focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary outline-none transition-all pr-12 placeholder:text-gray-600 font-sans group-hover:bg-admin-card"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-admin-text transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-admin-text-muted">Confirm Password</label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-admin-card/50 border border-admin-border rounded-xl px-4 py-3.5 text-admin-text focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary outline-none transition-all pr-12 placeholder:text-gray-600 font-sans group-hover:bg-admin-card"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-admin-text transition-colors p-1"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-admin-primary hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center pt-4"
                    >
                        <p className="text-admin-text-muted text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-admin-primary hover:text-sky-400 font-bold transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* Mobile Background Elements */}
                <div className="lg:hidden absolute inset-0 -z-10 bg-[url('/bg-grid.svg')] opacity-10"></div>
                <div className="lg:hidden absolute top-0 left-0 w-64 h-64 bg-admin-primary/10 rounded-full blur-[80px]" />
                <div className="lg:hidden absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]" />
            </div>

            {/* Right Section - Artistic Visual */}
            <div className="hidden lg:flex w-1/2 bg-admin-card relative items-center justify-center overflow-hidden border-l border-white/5">
                <div className="absolute inset-0 bg-[url('/bg-grid.svg')] opacity-10"></div>

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        y: [0, 50, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-[700px] h-[700px] bg-sky-600/10 rounded-full blur-[120px] -top-20 -right-20"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, -50, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"
                />

                <div className="relative z-10 max-w-lg p-10 backdrop-blur-3xl bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl">
                    <div className="mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Start your journey<br />with premium tools.</h2>
                        <p className="text-admin-text-muted text-lg leading-relaxed">
                            Get access to powerful portfolio management features and showcase your work like a pro.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 pt-8 border-t border-white/10 text-sm font-bold text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>System Operational</span>
                        </div>
                        <span className="text-admin-text-muted">|</span>
                        <div className="text-admin-text-muted font-normal">v2.0.0 released</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
