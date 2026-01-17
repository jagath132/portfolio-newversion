import { useEffect, useState, useCallback } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  Database,
  Zap,
  Loader2,
  Trash2,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { projects, experiences, educations, skillCategories } from '../../constants';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay / 1000, duration: 0.5 }}
    className="relative overflow-hidden bg-admin-card p-6 rounded-2xl border border-admin-border group hover:border-admin-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
  >
    <div
      className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}
    >
      <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
    </div>

    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline mt-2">
          <p className="text-4xl font-bold text-admin-text tracking-tight font-display">
            {value || 0}
          </p>
          <span className="ml-2 text-xs text-green-400 font-medium flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            Active
          </span>
        </div>
      </div>
      <div className={`p-4 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>

    {/* Subtle indicator visual */}
    <div className="mt-6 flex items-center gap-2">
      <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ delay: (delay + 300) / 1000, duration: 1 }}
          className={`h-full bg-gradient-to-r ${color}`}
        />
      </div>
      <span className="text-[10px] text-admin-text-muted font-medium">Updated just now</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { getAll: getProjects, add: addProject, remove: removeProject } = useFirestore('projects');
  const {
    getAll: getExperience,
    add: addExperience,
    remove: removeExperience,
  } = useFirestore('experience');
  const {
    getAll: getEducation,
    add: addEducation,
    remove: removeEducation,
  } = useFirestore('education');
  const { getAll: getSkills, add: addSkill, remove: removeSkill } = useFirestore('skills');

  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    education: 0,
    skills: 0,
  });
  const [seeding, setSeeding] = useState(false);
  const [reseting, setReseting] = useState(false);

  // Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    type: 'seed' | 'reset' | null;
    title: string;
    message: string;
    isDestructive: boolean;
  }>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    isDestructive: false,
  });

  const fetchStats = useCallback(async () => {
    const [p, e, ed, s] = await Promise.all([
      getProjects(),
      getExperience(),
      getEducation(),
      getSkills(),
    ]);

    setStats({
      projects: p.length,
      experience: e.length,
      education: ed.length,
      skills: s.length,
    });
  }, [getProjects, getExperience, getEducation, getSkills]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const performReset = async () => {
    setReseting(true);
    try {
      const [p, e, ed, s] = await Promise.all([
        getProjects(),
        getExperience(),
        getEducation(),
        getSkills(),
      ]);

      for (const item of p) await removeProject(item.id);
      for (const item of e) await removeExperience(item.id);
      for (const item of ed) await removeEducation(item.id);
      for (const item of s) await removeSkill(item.id);

      toast.success('All data has been reset successfully!', {
        theme: 'dark',
      });
      fetchStats();
    } catch (error) {
      console.error(error);
      toast.error('Error resetting data');
    } finally {
      setReseting(false);
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const performSeed = async () => {
    setSeeding(true);
    try {
      for (const p of projects) await addProject(p);
      for (const e of experiences) await addExperience(e);
      for (const ed of educations) await addEducation(ed);
      for (const cat of skillCategories) {
        for (const tech of cat.technologies) {
          await addSkill({
            name: tech.name,
            icon: tech.icon,
            category: cat.title,
            description: 'Proficient in ' + tech.name,
          });
        }
      }
      toast.success('Database seeded successfully!', {
        theme: 'dark',
      });
      fetchStats();
    } catch (error) {
      console.error(error);
      toast.error('Error seeding data');
    } finally {
      setSeeding(false);
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleConfirmAction = async () => {
    if (confirmConfig.type === 'reset') {
      await performReset();
    } else if (confirmConfig.type === 'seed') {
      await performSeed();
    }
  };

  const openResetModal = () => {
    setConfirmConfig({
      isOpen: true,
      type: 'reset',
      title: 'Reset All Data',
      message:
        'WARNING: This will delete ALL data from the database. This action cannot be undone. Are you sure you want to proceed?',
      isDestructive: true,
    });
  };

  const openSeedModal = () => {
    setConfirmConfig({
      isOpen: true,
      type: 'seed',
      title: 'Seed Default Data',
      message:
        'This will populate the database with default sample data. New entries will be created.',
      isDestructive: false,
    });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="absolute -left-4 top-1 w-1 h-3/4 bg-admin-primary rounded-full hidden md:block" />
          <h1 className="text-4xl font-bold text-admin-text mb-2 font-display">
            Welcome Back,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Admin
            </span>
          </h1>
          <p className="text-admin-text-muted max-w-lg text-sm">
            Manage your professional portfolio content, track milestones, and keep your profile
            synced with your latest achievements.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-3"
        >
          <button
            onClick={openResetModal}
            disabled={reseting || seeding}
            className="group relative px-5 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2"
          >
            {reseting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>{reseting ? 'Resetting...' : 'Reset Data'}</span>
          </button>

          <button
            onClick={openSeedModal}
            disabled={seeding || reseting}
            className="group px-5 py-2.5 rounded-xl bg-admin-primary text-white hover:bg-indigo-600 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {seeding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <span>{seeding ? 'Seeding...' : 'Seed Data'}</span>
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.projects}
          icon={FolderKanban}
          color="from-indigo-600 to-cyan-500"
          delay={100}
        />
        <StatCard
          title="Experience"
          value={stats.experience}
          icon={Briefcase}
          color="from-purple-600 to-pink-500"
          delay={200}
        />
        <StatCard
          title="Education"
          value={stats.education}
          icon={GraduationCap}
          color="from-orange-500 to-amber-500"
          delay={300}
        />
        <StatCard
          title="Total Skills"
          value={stats.skills}
          icon={Wrench}
          color="from-emerald-500 to-teal-500"
          delay={400}
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-admin-card p-6 rounded-2xl border border-admin-border relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-admin-text flex items-center gap-2">
                <Activity className="w-5 h-5 text-admin-primary" />
                Portfolio Analytics
              </h3>
              <p className="text-admin-text-muted text-xs">Activity overview for current month</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-admin-text-muted hover:text-white cursor-pointer transition-colors">
                Week
              </span>
              <span className="px-3 py-1 bg-admin-primary/20 text-admin-primary rounded-full text-[10px] cursor-pointer">
                Month
              </span>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 px-2">
            {[40, 70, 45, 90, 65, 85, 50, 75, 60, 95, 45, 80].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.7 + i * 0.05, duration: 1, ease: 'easeOut' }}
                className="flex-1 bg-white/5 rounded-t-lg relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-admin-primary to-indigo-400 rounded-t-lg opacity-40 group-hover:opacity-100 transition-all" />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-admin-text-muted font-medium px-1">
            <span>JAN</span>
            <span>FEB</span>
            <span>MAR</span>
            <span>APR</span>
            <span>MAY</span>
            <span>JUN</span>
            <span>JUL</span>
            <span>AUG</span>
            <span>SEP</span>
            <span>OCT</span>
            <span>NOV</span>
            <span>DEC</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-admin-card to-admin-bg p-8 rounded-2xl border border-admin-border flex flex-col justify-center items-center text-center relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="w-20 h-20 rounded-2xl bg-admin-primary/20 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-10 h-10 text-admin-primary" />
          </div>

          <h3 className="text-xl font-bold text-admin-text mb-3 font-display">System Health</h3>
          <p className="text-admin-text-muted text-sm mb-8 leading-relaxed">
            Your portfolio CMS is fully active. All services are operational and running at optimal
            speed.
          </p>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-white/5 hover:bg-white text-admin-text hover:text-black font-semibold rounded-xl transition-all duration-300 border border-white/10 flex items-center justify-center gap-2"
          >
            Launch Live Site
            <TrendingUp className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDestructive={confirmConfig.isDestructive}
        isLoading={reseting || seeding}
        confirmText={confirmConfig.type === 'reset' ? 'Yes, Reset All' : 'Yes, Seed Data'}
      />
    </div>
  );
};

export default Dashboard;
