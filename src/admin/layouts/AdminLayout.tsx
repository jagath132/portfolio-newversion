import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, LayoutDashboard, Briefcase, GraduationCap, Wrench, FolderKanban, LogOut, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { toast } from 'react-toastify';
import { useState } from 'react';

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#090325] text-white">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
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
    ];

    return (
        <div className="flex h-screen bg-[#050816] text-gray-100 font-poppins overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#100d25] border-r border-[#2b2b42] flex flex-col transition-all duration-300 relative z-20 shadow-xl`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                                <span className="font-bold text-white">A</span>
                            </div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                                AdminPanel
                            </h1>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto">
                            <span className="font-bold text-white">A</span>
                        </div>
                    )}
                </div>

                <div className="px-3 mb-6">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full p-2 rounded-lg bg-[#1a1735] hover:bg-[#231e45] text-gray-400 hover:text-white transition-all flex items-center justify-center"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-[#1a1735]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-r-full" />
                                    )}
                                    <item.icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'}`} />
                                    {isSidebarOpen && (
                                        <span className="font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                                            {item.label}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#2b2b42] bg-[#0d0a20]">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all group`}
                    >
                        <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                        {isSidebarOpen && <span className="group-hover:text-red-400 transition-colors">Logout</span>}
                    </button>

                    {isSidebarOpen && (
                        <div className="mt-4 flex items-center gap-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Admin</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-[url('/bg-grid.svg')] bg-[#050816]">
                {/* Background glow effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto p-8 animate-in fade-in zoom-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
