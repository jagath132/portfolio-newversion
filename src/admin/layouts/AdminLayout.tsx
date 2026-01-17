import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Loader2,
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  User,
  Bell,
  FileText
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-admin-bg text-admin-text">
        <Loader2 className="w-10 h-10 animate-spin text-admin-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/experience', icon: Briefcase, label: 'Experience' },
    { to: '/education', icon: GraduationCap, label: 'Education' },
    { to: '/skills', icon: Wrench, label: 'Skills' },
    { to: '/sections', icon: FileText, label: 'Content' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full font-sans">
      {/* Logo Area */}
      <div className={`h-20 flex items-center ${isSidebarOpen ? 'px-6' : 'justify-center px-2'} border-b border-white/5`}>
        <NavLink to="/" className="flex items-center group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <span className="font-bold text-white font-display text-xl">A</span>
          </div>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-3 font-bold text-xl text-white tracking-wide"
            >
              Admin<span className="text-admin-primary">Panel</span>
            </motion.span>
          )}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                ? 'bg-admin-primary text-white shadow-lg shadow-sky-500/30'
                : 'text-admin-text-muted hover:text-white hover:bg-white/5'
              } ${!isSidebarOpen && 'justify-center px-0'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:scale-110'
                    }`}
                />

                {isSidebarOpen && (
                  <span className="ml-3 font-semibold text-sm truncate">
                    {item.label}
                  </span>
                )}

                {/* Active Indicator Dot */}
                {isActive && isSidebarOpen && (
                  <motion.div
                    layoutId="active-dot"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]"
                  />
                )}

                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/10 shadow-xl">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className={`p-6 border-t border-white/5 bg-black/20 ${!isSidebarOpen && 'items-center flex flex-col'}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group ${!isSidebarOpen ? 'justify-center px-0' : ''
            }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {isSidebarOpen && <span className="ml-3 text-sm font-bold uppercase tracking-wider">Logout</span>}
        </button>

        {isSidebarOpen && (
          <div className="mt-6 flex items-center px-2 gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Administrator</p>
              <p className="text-[10px] text-gray-500 truncate uppercase tracking-tighter">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-admin-bg font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex bg-admin-card border-r border-admin-border flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-30 ${isSidebarOpen ? 'w-72' : 'w-24'
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-admin-card z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:hidden border-r border-admin-border ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-admin-card/80 backdrop-blur-xl border-b border-admin-border flex items-center justify-between px-6 md:px-10 z-20 sticky top-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-white/5"
            >
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

            <AnimatePresence mode="wait">
              <motion.h1
                key={location.pathname}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-white font-display tracking-tight"
              >
                {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)}
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative border border-white/5">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-admin-primary rounded-full shadow-[0_0_8px_rgba(56,189,248,1)]"></span>
            </button>
            <div className="h-10 w-[1px] bg-white/5 mx-2"></div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:block">
                <p className="text-sm font-bold text-white">Jagath</p>
                <p className="text-[10px] text-admin-primary font-bold uppercase tracking-widest">Portfolio Owner</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-500 p-[1px] shadow-lg shadow-sky-500/10">
                <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-admin-bg relative custom-scrollbar">
          {/* Subtle background flair */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-admin-primary/5 to-transparent pointer-events-none" />

          <div className="max-w-[1400px] mx-auto p-6 md:p-10 relative z-10 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
