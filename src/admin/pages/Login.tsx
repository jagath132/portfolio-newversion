import { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
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
            <h1 className="text-4xl font-bold mt-8 tracking-tight">Welcome back</h1>
            <p className="text-admin-text-muted mt-2">Enter your credentials to access your workspace.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-admin-text-muted">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-admin-card/50 border border-admin-border rounded-xl px-4 py-3.5 text-admin-text focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary outline-none transition-all placeholder:text-gray-600 font-sans group-hover:bg-admin-card"
                  placeholder="admin@portfolio.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-admin-text-muted">Password</label>
                <a href="#" className="text-xs font-semibold text-admin-primary hover:text-sky-400 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-admin-primary hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
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
              Don't have an account?{' '}
              <Link to="/signup" className="text-admin-primary hover:text-sky-400 font-bold transition-colors">
                create one for free
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 -z-10 bg-[url('/bg-grid.svg')] opacity-10"></div>
        <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-admin-primary/10 rounded-full blur-[80px]" />
        <div className="lg:hidden absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]" />
      </div>

      {/* Right Section - Artistic Visual */}
      <div className="hidden lg:flex w-1/2 bg-admin-card relative items-center justify-center overflow-hidden border-l border-white/5">
        <div className="absolute inset-0 bg-[url('/bg-grid.svg')] opacity-10"></div>

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] bg-sky-600/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"
        />

        <div className="relative z-10 max-w-lg p-10 backdrop-blur-3xl bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Secure & Professional<br />Portfolio Management.</h2>
            <p className="text-admin-text-muted text-lg leading-relaxed">
              Manage your projects, experience, and skills from a unified, secure dashboard designed for performance.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-white/10 text-sm font-medium text-admin-text-muted">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-admin-card bg-gray-700 flex items-center justify-center text-[10px] text-white font-bold">
                  {i === 3 ? '+' : ''}
                </div>
              ))}
            </div>
            <p>Joined by 10+ developers this week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
