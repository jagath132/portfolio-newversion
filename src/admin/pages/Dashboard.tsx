import { useEffect, useState, useCallback } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import {
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  Database,
  Zap,
  Loader2,
  Trash2,
} from 'lucide-react';
import { projects, experiences, educations, skillCategories } from '../../constants';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <div
    className="relative overflow-hidden bg-[#151030] p-6 rounded-2xl border border-[#2b2b42] group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}
    >
      <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
    </div>

    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline mt-2">
          <p className="text-4xl font-bold text-white tracking-tight">{value || 0}</p>
          <span className="ml-2 text-xs text-green-400 font-medium">+100%</span>
        </div>
      </div>
      <div className={`p-4 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>

    {/* Progress bar visual */}
    <div className="mt-4 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full ${color.replace('from-', 'bg-')} w-[70%]`} />
    </div>
  </div>
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
        style: { background: '#151030', color: '#fff' },
      });
      fetchStats();
    } catch (error) {
      console.error(error);
      toast.error('Error resetting data');
    } finally {
      setReseting(false);
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
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
        style: { background: '#151030', color: '#fff' },
      });
      fetchStats();
    } catch (error) {
      console.error(error);
      toast.error('Error seeding data');
    } finally {
      setSeeding(false);
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="relative">
          <div className="absolute -left-6 top-1 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome Back,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Admin
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg">
            Manage your portfolio content, track your projects, and keep your professional profile
            up to date.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={openResetModal}
            disabled={reseting || seeding}
            className="group relative px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:border-red-500 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-2">
              {reseting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-medium">{reseting ? 'Reseting...' : 'Reset Data'}</span>
            </div>
          </button>

          <button
            onClick={openSeedModal}
            disabled={seeding || reseting}
            className="group relative px-6 py-3 rounded-xl bg-[#1d1836] border border-[#2b2b42] text-white hover:border-purple-500 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-2">
              {seeding ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
              ) : (
                <Database className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-medium group-hover:text-purple-400 transition-colors">
                {seeding ? 'Seeding...' : 'Seed Default Data'}
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.projects}
          icon={FolderKanban}
          color="from-blue-600 to-cyan-400"
          delay={100}
        />
        <StatCard
          title="Experience"
          value={stats.experience}
          icon={Briefcase}
          color="from-purple-600 to-pink-400"
          delay={200}
        />
        <StatCard
          title="Education"
          value={stats.education}
          icon={GraduationCap}
          color="from-orange-500 to-yellow-400"
          delay={300}
        />
        <StatCard
          title="Total Skills"
          value={stats.skills}
          icon={Wrench}
          color="from-green-500 to-emerald-400"
          delay={400}
        />
      </div>

      {/* Quick Actions or Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="lg:col-span-2 bg-[#151030] p-6 rounded-2xl border border-[#2b2b42] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="w-32 h-32" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Stats Analysis</h3>
          <div className="h-48 flex items-end justify-between gap-2 px-4">
            {/* Simple visual bar chart representation */}
            {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
              <div
                key={i}
                className="w-full bg-[#231e45] rounded-t-lg relative group overflow-hidden"
              >
                <div
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-purple-600 to-cyan-400 transition-all duration-1000 ease-out"
                  style={{ height: `${h}%` }}
                />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1d1836] to-[#151030] p-6 rounded-2xl border border-[#2b2b42] flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Portfolio Health</h3>
          <p className="text-gray-400 text-sm mb-6">
            Your portfolio is active and configured. Keep adding projects to increase visibility.
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:scale-105 transition-transform inline-block"
          >
            View Live Site
          </a>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
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
