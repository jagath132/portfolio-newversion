import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import {
  Lock,
  Unlock,
  Save,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  LogOut,
  BookOpen,
  Award,
  Zap,
  FolderGit2,
  ChevronDown,
  ChevronUp,
  Loader2,
  FolderPlus,
  MapPin,
  User,
  Share2,
  PlusCircle,
  ArrowUp,
  Sparkles,
  ShieldCheck,
  Globe,
  Sliders,
  CheckCircle2,
  X,
  Search,
  Copy,
  ExternalLink,
  HelpCircle,
  Command,
  LayoutGrid
} from 'lucide-react';
import { EducationItem, SkillCategory, ExperienceItem, ProjectItem } from '../../src/types';

const POPULAR_SKILL_ICONS = [
  'FileCode2', 'Database', 'Coffee', 'BarChart3', 'FileSpreadsheet', 'PieChart', 
  'Workflow', 'Zap', 'CheckCircle2', 'ShieldCheck', 'SearchCheck', 'GitBranch', 
  'Github', 'Layers', 'Briefcase', 'TrendingUp', 'Terminal', 'Cpu', 'Code', 
  'Flame', 'Server', 'Globe', 'Sliders', 'User', 'Lock', 'Box', 'Boxes', 
  'FileJson', 'Binary', 'Compass', 'Activity', 'Cloud', 'Layout', 'Smartphone', 
  'Sparkles', 'Wrench', 'Settings', 'FolderGit2', 'BookOpen', 'Award'
];

interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    shortBio: string;
    fullAbout: string;
    highlights: { label: string; value: string }[];
    socials: {
      github: string;
      linkedin: string;
      twitter: string;
      email: string;
      telegram: string;
    };
  };
  educationData: EducationItem[];
  skillsCategories: SkillCategory[];
  experienceData: ExperienceItem[];
  projectsData: ProjectItem[];
}

const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  personalInfo: {
    name: '',
    title: '',
    shortBio: '',
    fullAbout: '',
    highlights: [],
    socials: { github: '', linkedin: '', twitter: '', email: '', telegram: '' }
  },
  educationData: [],
  skillsCategories: [],
  experienceData: [],
  projectsData: []
};

export default function App() {
  const [passcode, setPasscode] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [originalData, setOriginalData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'education' | 'experience' | 'projects'>('info');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const [showIconModal, setShowIconModal] = useState<boolean>(false);
  const [iconSearch, setIconSearch] = useState<string>('');
  const [copiedIcon, setCopiedIcon] = useState<string>('');
  const [targetSkillForIcon, setTargetSkillForIcon] = useState<{ catId: string; skIdx: number } | null>(null);

  const handleSelectIcon = (iconName: string) => {
    if (targetSkillForIcon) {
      handleUpdateSkill(targetSkillForIcon.catId, targetSkillForIcon.skIdx, 'iconName', iconName);
      setTargetSkillForIcon(null);
      setShowIconModal(false);
    } else {
      navigator.clipboard.writeText(iconName);
      setCopiedIcon(iconName);
      setTimeout(() => setCopiedIcon(''), 2500);
    }
  };

  useEffect(() => {
    const savedPasscode = localStorage.getItem('portfolio_admin_passcode');
    if (savedPasscode) {
      verifyPasscode(savedPasscode);
    } else {
      setLoading(false);
    }
  }, []);

  const isDirty = JSON.stringify(data) !== JSON.stringify(originalData);

  const verifyPasscode = async (code: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${code}`
        }
      });
      if (res.ok) {
        const portfolioData = await res.json();
        setData(portfolioData);
        setOriginalData(JSON.parse(JSON.stringify(portfolioData)));
        localStorage.setItem('portfolio_admin_passcode', code);
        setPasscode(code);
        setIsAuthorized(true);
      } else {
        setAuthError('Invalid passcode. Access denied.');
        localStorage.removeItem('portfolio_admin_passcode');
        setIsAuthorized(false);
      }
    } catch (err) {
      setAuthError('Connection failed. Server might be offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim()) {
      verifyPasscode(passcode.trim());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_passcode');
    setPasscode('');
    setIsAuthorized(false);
    setData(DEFAULT_PORTFOLIO_DATA);
    setOriginalData(DEFAULT_PORTFOLIO_DATA);
  };

  const saveChanges = async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${passcode}`
        },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Failed to save changes.');
        setSaveStatus('failed');
      }
    } catch (err) {
      setErrorMessage('Connection failed. Server might be offline.');
      setSaveStatus('failed');
    }
  };

  const updatePersonalInfo = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSocials = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        socials: {
          ...prev.personalInfo.socials,
          [field]: value
        }
      }
    }));
  };

  const handleAddHighlight = () => {
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        highlights: [...prev.personalInfo.highlights, { label: '', value: '' }]
      }
    }));
  };

  const handleUpdateHighlight = (index: number, field: 'label' | 'value', value: string) => {
    const updatedHighlights = [...data.personalInfo.highlights];
    updatedHighlights[index] = { ...updatedHighlights[index], [field]: value };
    updatePersonalInfo('highlights', updatedHighlights);
  };

  const handleDeleteHighlight = (index: number) => {
    const updatedHighlights = data.personalInfo.highlights.filter((_, i) => i !== index);
    updatePersonalInfo('highlights', updatedHighlights);
  };

  const handleAddEducation = () => {
    const newItem: EducationItem = {
      id: Math.random().toString(36).substr(2, 9),
      degree: '',
      field: '',
      institution: '',
      duration: '',
      description: '',
      achievements: []
    };
    setData(prev => ({
      ...prev,
      educationData: [newItem, ...prev.educationData]
    }));
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: any) => {
    const list = [...data.educationData];
    list[index] = { ...list[index], [field]: value } as EducationItem;
    setData(prev => ({ ...prev, educationData: list }));
  };

  const handleDeleteEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      educationData: prev.educationData.filter(item => item.id !== id)
    }));
  };

  const handleAddEducationAchievement = (index: number) => {
    const list = [...data.educationData];
    list[index].achievements = [...list[index].achievements, ''];
    setData(prev => ({ ...prev, educationData: list }));
  };

  const handleUpdateEducationAchievement = (edIndex: number, achIndex: number, value: string) => {
    const list = [...data.educationData];
    list[edIndex].achievements[achIndex] = value;
    setData(prev => ({ ...prev, educationData: list }));
  };

  const handleDeleteEducationAchievement = (edIndex: number, achIndex: number) => {
    const list = [...data.educationData];
    list[edIndex].achievements = list[edIndex].achievements.filter((_, i) => i !== achIndex);
    setData(prev => ({ ...prev, educationData: list }));
  };

  const handleAddSkillCategory = () => {
    const newCat: SkillCategory = {
      id: Math.random().toString(36).substr(2, 9),
      category: 'NEW CATEGORY',
      skills: []
    };
    setData(prev => ({
      ...prev,
      skillsCategories: [...prev.skillsCategories, newCat]
    }));
    setExpandedCategories(prev => ({ ...prev, [newCat.id]: true }));
  };

  const handleUpdateSkillCategoryName = (catId: string, name: string) => {
    setData(prev => ({
      ...prev,
      skillsCategories: prev.skillsCategories.map(cat => 
        cat.id === catId ? { ...cat, category: name } : cat
      )
    }));
  };

  const handleDeleteSkillCategory = (catId: string) => {
    setData(prev => ({
      ...prev,
      skillsCategories: prev.skillsCategories.filter(cat => cat.id !== catId)
    }));
  };

  const handleAddSkill = (catId: string) => {
    setData(prev => ({
      ...prev,
      skillsCategories: prev.skillsCategories.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            skills: [...cat.skills, { name: '', iconName: 'FileCode2', level: 80, color: '#4F46E5' }]
          };
        }
        return cat;
      })
    }));
    setExpandedCategories(prev => ({ ...prev, [catId]: true }));
  };

  const handleUpdateSkill = (catId: string, skillIndex: number, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      skillsCategories: prev.skillsCategories.map(cat => {
        if (cat.id === catId) {
          const updatedSkills = [...cat.skills];
          updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], [field]: value };
          return { ...cat, skills: updatedSkills };
        }
        return cat;
      })
    }));
  };

  const handleDeleteSkill = (catId: string, skillIndex: number) => {
    setData(prev => ({
      ...prev,
      skillsCategories: prev.skillsCategories.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            skills: cat.skills.filter((_, i) => i !== skillIndex)
          };
        }
        return cat;
      })
    }));
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: Math.random().toString(36).substr(2, 9),
      period: '',
      role: '',
      company: '',
      summary: '',
      bulletPoints: [],
      techStack: []
    };
    setData(prev => ({
      ...prev,
      experienceData: [newItem, ...prev.experienceData]
    }));
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    const list = [...data.experienceData];
    list[index] = { ...list[index], [field]: value } as ExperienceItem;
    setData(prev => ({ ...prev, experienceData: list }));
  };

  const handleDeleteExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experienceData: prev.experienceData.filter(item => item.id !== id)
    }));
  };

  const handleAddExperienceBullet = (index: number) => {
    const list = [...data.experienceData];
    list[index].bulletPoints = [...list[index].bulletPoints, ''];
    setData(prev => ({ ...prev, experienceData: list }));
  };

  const handleUpdateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const list = [...data.experienceData];
    list[expIndex].bulletPoints[bulletIndex] = value;
    setData(prev => ({ ...prev, experienceData: list }));
  };

  const handleDeleteExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const list = [...data.experienceData];
    list[expIndex].bulletPoints = list[expIndex].bulletPoints.filter((_, i) => i !== bulletIndex);
    setData(prev => ({ ...prev, experienceData: list }));
  };

  const handleAddProject = () => {
    const newItem: ProjectItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      subtitle: '',
      tags: [],
      image: '/images/sales_dashboard_1785041898997.jpg',
      description: '',
      fullDetails: {
        overview: '',
        keyFeatures: [],
        metrics: [],
        architecture: ''
      },
      demoUrl: '#',
      githubUrl: '#'
    };
    setData(prev => ({
      ...prev,
      projectsData: [newItem, ...prev.projectsData]
    }));
  };

  const handleUpdateProject = (index: number, field: keyof ProjectItem, value: any) => {
    const list = [...data.projectsData];
    list[index] = { ...list[index], [field]: value } as ProjectItem;
    setData(prev => ({ ...prev, projectsData: list }));
  };

  const handleUpdateProjectDetails = (index: number, field: string, value: any) => {
    const list = [...data.projectsData];
    list[index].fullDetails = {
      ...list[index].fullDetails,
      [field]: value
    };
    setData(prev => ({ ...prev, projectsData: list }));
  };

  const handleDeleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projectsData: prev.projectsData.filter(item => item.id !== id)
    }));
  };

  const handleAddProjectFeature = (index: number) => {
    const list = [...data.projectsData];
    list[index].fullDetails.keyFeatures = [...list[index].fullDetails.keyFeatures, ''];
    setData(prev => ({ ...prev, projectsData: list }));
  };

  const handleUpdateProjectFeature = (projIndex: number, featIndex: number, value: string) => {
    const list = [...data.projectsData];
    list[projIndex].fullDetails.keyFeatures[featIndex] = value;
    setData(prev => ({ ...prev, projectsData: list }));
  };

  const handleDeleteProjectFeature = (projIndex: number, featIndex: number) => {
    const list = [...data.projectsData];
    list[projIndex].fullDetails.keyFeatures = list[projIndex].fullDetails.keyFeatures.filter((_, i) => i !== featIndex);
    setData(prev => ({ ...prev, projectsData: list }));
  };

  const handleAddProjectMetric = (index: number) => {
    const list = [...data.projectsData];
    list[index].fullDetails.metrics = [...list[index].fullDetails.metrics, { label: '', value: '' }];
    setData(prev => ({ ...prev, projectsData: list }));
  };

  const handleUpdateProjectMetric = (projIndex: number, metricIndex: number, field: 'label' | 'value', value: string) => {
    const list = [...data.projectsData];
    list[projIndex].fullDetails.metrics[metricIndex] = {
      ...list[projIndex].fullDetails.metrics[metricIndex],
      [field]: value
    };
    setData(prev => ({ ...prev, projectsData: list }));
  };

  const handleDeleteProjectMetric = (projIndex: number, metricIndex: number) => {
    const list = [...data.projectsData];
    list[projIndex].fullDetails.metrics = list[projIndex].fullDetails.metrics.filter((_, i) => i !== metricIndex);
    setData(prev => ({ ...prev, projectsData: list }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin absolute" />
        </div>
        <p className="text-xs font-extrabold tracking-widest text-indigo-600 mt-6 uppercase">Loading Control Studio...</p>
      </div>
    );
  }

  // PASSCODE AUTHENTICATION GATE (CLEAN LIGHT THEME)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center px-4 relative overflow-hidden font-sans select-none">
        {/* Soft Pastel Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[550px] h-[350px] bg-indigo-200/50 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[300px] bg-sky-200/50 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md bg-white/95 border border-slate-200/90 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-slate-300/60">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto shadow-md text-indigo-600">
              <Lock className="w-7 h-7 animate-pulse text-indigo-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-wider text-slate-900 uppercase">ADMIN STUDIO</h2>
              <p className="text-xs text-indigo-600 font-bold tracking-widest uppercase">PORTFOLIO CONTROL CENTER</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter passcode (e.g. admin)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl py-3.5 pl-5 pr-5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-sm font-medium"
                />
              </div>
              
              {authError && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 py-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-98 cursor-pointer uppercase"
              >
                <Unlock className="w-4 h-4" />
                <span>UNLOCK DASHBOARD</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD LAYOUT (CLEAN LIGHT STUDIO GLASS THEME)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col relative font-sans">
      {/* Subtle Pastel Ambient Lighting */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[350px] bg-indigo-100/60 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-sky-100/60 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Floating White Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/90 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-indigo-600 animate-ping shadow-[0_0_10px_#4f46e5]"></div>
            <h1 className="text-lg font-black tracking-widest bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent uppercase">
              {data.personalInfo.name || 'PORTFOLIO'} STUDIO
            </h1>
            {isDirty && (
              <span className="text-[10px] font-bold bg-amber-50 border border-amber-300 text-amber-800 px-2.5 py-0.5 rounded-md animate-pulse shadow-sm tracking-wider">
                UNSAVED CHANGES
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Status alerts */}
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-sm">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved successfully!</span>
              </span>
            )}
            {saveStatus === 'failed' && (
              <span className="flex items-center gap-1.5 text-xs text-rose-700 font-bold bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-xl" title={errorMessage}>
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Save failed</span>
              </span>
            )}

            {/* Save Button */}
            <button
              onClick={saveChanges}
              disabled={!isDirty || saveStatus === 'saving'}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                isDirty && saveStatus !== 'saving'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95'
                  : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE CHANGES</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
              title="Sign Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-6 relative z-10">
        
        {/* Sidebar Nav Tabs */}
        <nav className="md:w-56 flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-visible pb-3 md:pb-0">
          {[
            { id: 'info', label: 'Personal Info', icon: User },
            { id: 'skills', label: 'Skills categories', icon: Zap },
            { id: 'education', label: 'Education', icon: BookOpen },
            { id: 'experience', label: 'Experience', icon: Award },
            { id: 'projects', label: 'Projects builder', icon: FolderGit2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white border-2 border-indigo-600 text-indigo-700 font-black shadow-md shadow-indigo-500/10'
                    : 'bg-white/70 border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Editor Main Container */}
        <main className="flex-1 bg-white/90 border border-slate-200/90 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl shadow-slate-200/60 min-h-[500px]">
          
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>Personal Information</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Manage main headings, statements, and contact profiles.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Client Name</label>
                  <input
                    type="text"
                    value={data.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none shadow-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Professional Title</label>
                  <input
                    type="text"
                    value={data.personalInfo.title}
                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Short Bio (Footer & Hero)</label>
                <textarea
                  rows={2}
                  value={data.personalInfo.shortBio}
                  onChange={(e) => updatePersonalInfo('shortBio', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none resize-y shadow-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full About Biography</label>
                <textarea
                  rows={4}
                  value={data.personalInfo.fullAbout}
                  onChange={(e) => updatePersonalInfo('fullAbout', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none resize-y shadow-sm font-medium"
                />
              </div>

              {/* Social Channels */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" />
                  <span>Social Connections</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'github', label: 'GitHub URL' },
                    { key: 'linkedin', label: 'LinkedIn URL' },
                    { key: 'twitter', label: 'Twitter / X URL' },
                    { key: 'telegram', label: 'Telegram URL' },
                    { key: 'email', label: 'Email Link (mailto:)' }
                  ].map(social => (
                    <div key={social.key} className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{social.label}</label>
                      <input
                        type="text"
                        value={(data.personalInfo.socials as any)[social.key] || ''}
                        onChange={(e) => updateSocials(social.key, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat Highlights */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Profile Highlights</span>
                  </h4>
                  <button
                    onClick={handleAddHighlight}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD HIGHLIGHT</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {data.personalInfo.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Label (e.g. Data Accuracy)"
                          value={highlight.label}
                          onChange={(e) => handleUpdateHighlight(idx, 'label', e.target.value)}
                          className="bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 99.8%)"
                          value={highlight.value}
                          onChange={(e) => handleUpdateHighlight(idx, 'value', e.target.value)}
                          className="bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteHighlight(idx)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:text-white hover:bg-rose-600 transition-all cursor-pointer shadow-sm"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                  {data.personalInfo.highlights.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-2">No highlights defined. Click "Add Highlight" above.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS CATEGORIES */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    <span>Skills Matrix</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Create skill categories and assign specific skill cards.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTargetSkillForIcon(null);
                      setShowIconModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>BROWSE ICONS</span>
                  </button>
                  <button
                    onClick={handleAddSkillCategory}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>NEW CATEGORY</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {data.skillsCategories.map((category) => {
                  const isExpanded = Boolean(expandedCategories[category.id]);
                  return (
                    <div key={category.id} className="border border-slate-200 bg-slate-50/70 rounded-2xl overflow-hidden transition-all shadow-sm">
                      
                      {/* Accordion Header */}
                      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-200">
                        <div className="flex-1 flex items-center gap-3 pr-4">
                          <input
                            type="text"
                            value={category.category}
                            onChange={(e) => handleUpdateSkillCategoryName(category.id, e.target.value)}
                            className="w-full flex-1 min-w-[240px] max-w-xl bg-transparent border-b-2 border-transparent focus:border-indigo-600 text-sm sm:text-base font-black text-slate-900 uppercase focus:outline-none py-1 px-2 tracking-wider"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddSkill(category.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                            title="Add skill tile"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD SKILL</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSkillCategory(category.id)}
                            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:text-white hover:bg-rose-600 transition-all cursor-pointer shadow-sm"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="p-2 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="p-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {category.skills.map((skill, skIdx) => (
                              <div key={skIdx} className="flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-xl relative group shadow-sm">
                                <button
                                  onClick={() => handleDeleteSkill(category.id, skIdx)}
                                  className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                  title="Remove skill"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Skill Name</label>
                                  <input
                                    type="text"
                                    value={skill.name}
                                    placeholder="e.g. Python"
                                    onChange={(e) => handleUpdateSkill(category.id, skIdx, 'name', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none shadow-sm"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Lucide Icon</label>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTargetSkillForIcon({ catId: category.id, skIdx });
                                          setShowIconModal(true);
                                        }}
                                        className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                                      >
                                        <Sparkles className="w-3 h-3" />
                                        <span>Pick</span>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={skill.iconName}
                                      placeholder="e.g. FileCode2"
                                      onChange={(e) => handleUpdateSkill(category.id, skIdx, 'iconName', e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none shadow-sm"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Brand Color (HEX)</label>
                                    <div className="flex gap-2">
                                      <input
                                        type="color"
                                        value={skill.color}
                                        onChange={(e) => handleUpdateSkill(category.id, skIdx, 'color', e.target.value)}
                                        className="w-7 h-7 rounded border border-slate-300 bg-transparent cursor-pointer p-0 shrink-0"
                                      />
                                      <input
                                        type="text"
                                        value={skill.color}
                                        placeholder="#4F46E5"
                                        onChange={(e) => handleUpdateSkill(category.id, skIdx, 'color', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-lg px-2 py-1 text-[11px] text-slate-900 focus:outline-none font-mono shadow-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {category.skills.length === 0 && (
                            <p className="text-xs text-slate-400 italic text-center py-4">No skills in this category. Click "Add Skill" above.</p>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
                {data.skillsCategories.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-8">No skill categories available. Click "New Category" above.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Education Milestones</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Manage academic history and degree profiles.</p>
                </div>
                <button
                  onClick={handleAddEducation}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ADD EDUCATION</span>
                </button>
              </div>

              <div className="space-y-8">
                {data.educationData.map((item, idx) => (
                  <div key={item.id} className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl relative group shadow-sm space-y-4">
                    <button
                      onClick={() => handleDeleteEducation(item.id)}
                      className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-sm"
                      title="Delete education milestone"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Degree / Qualification</label>
                        <input
                          type="text"
                          value={item.degree}
                          onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Field of Study</label>
                        <input
                          type="text"
                          value={item.field}
                          onChange={(e) => handleUpdateEducation(idx, 'field', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Institution Name</label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Duration Period (e.g. 2023 - 2025)</label>
                        <input
                          type="text"
                          value={item.duration}
                          onChange={(e) => handleUpdateEducation(idx, 'duration', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Description Overview</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateEducation(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none resize-y shadow-sm"
                      />
                    </div>

                    {/* Achievements List */}
                    <div className="border-t border-slate-200 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Key Achievements</label>
                        <button
                          onClick={() => handleAddEducationAchievement(idx)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD ACHIEVEMENT</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {item.achievements.map((ach, achIdx) => (
                          <div key={achIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={ach}
                              placeholder="Describe course grade, award, or research..."
                              onChange={(e) => handleUpdateEducationAchievement(idx, achIdx, e.target.value)}
                              className="flex-1 bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none shadow-sm"
                            />
                            <button
                              onClick={() => handleDeleteEducationAchievement(idx, achIdx)}
                              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:text-white hover:bg-rose-600 transition-all cursor-pointer shadow-sm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {item.achievements.length === 0 && (
                          <p className="text-[11px] text-slate-400 italic py-1">No achievements linked. Click "Add Achievement" above.</p>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
                {data.educationData.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-12">No education milestones available. Click "Add Education" above.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>Experience Timeline</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Manage jobs, internships, roles, and tech stacks.</p>
                </div>
                <button
                  onClick={handleAddExperience}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ADD EXPERIENCE</span>
                </button>
              </div>

              <div className="space-y-8">
                {data.experienceData.map((item, idx) => (
                  <div key={item.id} className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl relative group shadow-sm space-y-4">
                    <button
                      onClick={() => handleDeleteExperience(item.id)}
                      className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-sm"
                      title="Delete experience item"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Role / Title</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Duration Period (e.g. AUG 2025 - PRESENT)</label>
                        <input
                          type="text"
                          value={item.period}
                          onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Location (Optional)</label>
                        <input
                          type="text"
                          value={item.location || ''}
                          placeholder="e.g. Remote, Chennai"
                          onChange={(e) => handleUpdateExperience(idx, 'location', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Tech Stack (comma-separated list)</label>
                      <input
                        type="text"
                        value={item.techStack.join(', ')}
                        placeholder="e.g. n8n, SQL, Python"
                        onChange={(e) => {
                          const stack = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                          handleUpdateExperience(idx, 'techStack', stack);
                        }}
                        className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none font-mono shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Summary (Overview of experience)</label>
                      <textarea
                        rows={2}
                        value={item.summary}
                        onChange={(e) => handleUpdateExperience(idx, 'summary', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none resize-y shadow-sm"
                      />
                    </div>

                    {/* Bullet Points List */}
                    <div className="border-t border-slate-200 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Job Descriptions / Tasks</label>
                        <button
                          onClick={() => handleAddExperienceBullet(idx)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD BULLET POINT</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {item.bulletPoints.map((bullet, bulIdx) => (
                          <div key={bulIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={bullet}
                              placeholder="Describe a key task, metric, or success achievement..."
                              onChange={(e) => handleUpdateExperienceBullet(idx, bulIdx, e.target.value)}
                              className="flex-1 bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none shadow-sm"
                            />
                            <button
                              onClick={() => handleDeleteExperienceBullet(idx, bulIdx)}
                              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:text-white hover:bg-rose-600 transition-all cursor-pointer shadow-sm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {item.bulletPoints.length === 0 && (
                          <p className="text-[11px] text-slate-400 italic py-1">No detail bullets added. Click "Add Bullet Point" above.</p>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
                {data.experienceData.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-12">No experience timeline items available. Click "Add Experience" above.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS BUILDER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-indigo-600" />
                    <span>Projects Builder</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Manage showcased projects, dynamic stats, architectures, and images.</p>
                </div>
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ADD PROJECT</span>
                </button>
              </div>

              <div className="space-y-12">
                {data.projectsData.map((item, idx) => (
                  <div key={item.id} className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl relative group shadow-sm space-y-6">
                    <button
                      onClick={() => handleDeleteProject(item.id)}
                      className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-sm"
                      title="Delete project"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div>
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-slate-200 pb-2">Basic Info</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Project Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Subtitle / Caption</label>
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={(e) => handleUpdateProject(idx, 'subtitle', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Local Static Image Link</label>
                        <input
                          type="text"
                          value={item.image}
                          placeholder="e.g. /images/sales_dashboard.jpg"
                          onChange={(e) => handleUpdateProject(idx, 'image', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none font-mono shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Tags / Stack (comma-separated)</label>
                        <input
                          type="text"
                          value={item.tags.join(', ')}
                          placeholder="e.g. Power BI, Excel, SQL"
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                            handleUpdateProject(idx, 'tags', tags);
                          }}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Live Demo Link (Use # if none)</label>
                        <input
                          type="text"
                          value={item.demoUrl || ''}
                          onChange={(e) => handleUpdateProject(idx, 'demoUrl', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">GitHub Repository Link (Use # if none)</label>
                        <input
                          type="text"
                          value={item.githubUrl || ''}
                          onChange={(e) => handleUpdateProject(idx, 'githubUrl', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Short Description (Grid card snippet)</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none resize-y shadow-sm"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-slate-200 pb-2">Modal Details</h4>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Project Overview</label>
                        <textarea
                          rows={3}
                          value={item.fullDetails.overview}
                          onChange={(e) => handleUpdateProjectDetails(idx, 'overview', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none resize-y shadow-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Architecture / Pipeline Workflow</label>
                        <input
                          type="text"
                          value={item.fullDetails.architecture}
                          placeholder="e.g. Excel -> SQL Server -> Power BI"
                          onChange={(e) => handleUpdateProjectDetails(idx, 'architecture', e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none shadow-sm"
                        />
                      </div>

                      {/* Modal Key Features */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Key Features Checklist</label>
                          <button
                            onClick={() => handleAddProjectFeature(idx)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>ADD FEATURE</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {item.fullDetails.keyFeatures.map((feat, featIdx) => (
                            <div key={featIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={feat}
                                placeholder="Describe a technical feature or design parameter..."
                                onChange={(e) => handleUpdateProjectFeature(idx, featIdx, e.target.value)}
                                className="flex-1 bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none shadow-sm"
                              />
                              <button
                                onClick={() => handleDeleteProjectFeature(idx, featIdx)}
                                className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:text-white hover:bg-rose-600 transition-all cursor-pointer shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          {item.fullDetails.keyFeatures.length === 0 && (
                            <p className="text-[10px] text-slate-400 italic py-1">No feature checklist added. Click "Add Feature" above.</p>
                          )}
                        </div>
                      </div>

                      {/* Modal Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Project Metrics / KPIs</label>
                          <button
                            onClick={() => handleAddProjectMetric(idx)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>ADD METRIC</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {item.fullDetails.metrics.map((metric, metIdx) => (
                            <div key={metIdx} className="flex gap-2 items-center">
                              <div className="flex-1 grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="Metric Name (e.g. Data Points)"
                                  value={metric.label}
                                  onChange={(e) => handleUpdateProjectMetric(idx, metIdx, 'label', e.target.value)}
                                  className="bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none shadow-sm"
                                />
                                <input
                                  type="text"
                                  placeholder="KPI Value (e.g. 150,000+)"
                                  value={metric.value}
                                  onChange={(e) => handleUpdateProjectMetric(idx, metIdx, 'value', e.target.value)}
                                  className="bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none shadow-sm"
                                />
                              </div>
                              <button
                                onClick={() => handleDeleteProjectMetric(idx, metIdx)}
                                className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:text-white hover:bg-rose-600 transition-all cursor-pointer shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          {item.fullDetails.metrics.length === 0 && (
                            <p className="text-[10px] text-slate-400 italic py-1">No metrics defined. Click "Add Metric" above.</p>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
                {data.projectsData.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-12">No projects configured. Click "Add Project" above.</p>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Icon Picker / Cheatsheet Modal */}
      {showIconModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Lucide Icons Directory</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {targetSkillForIcon
                    ? 'Click any icon tile to assign it directly to this skill.'
                    : 'Click any icon tile to copy its exact name to your clipboard.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowIconModal(false);
                  setTargetSkillForIcon(null);
                }}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Filter */}
            <div className="p-6 pb-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600" />
                <input
                  type="text"
                  placeholder="Search icon name (e.g. Database, Terminal, Code, Cpu)..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl text-xs text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              {copiedIcon && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 p-3 rounded-xl shadow-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied icon name "{copiedIcon}" to clipboard!</span>
                </div>
              )}
            </div>

            {/* Modal Icon Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {POPULAR_SKILL_ICONS.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase())).map((iconName) => {
                  const IconComp = (Icons as any)[iconName] || HelpCircle;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelectIcon(iconName)}
                      className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/60 rounded-2xl transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-600 truncate w-full text-center">
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer Link */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span>Looking for 1,000+ more icons?</span>
              <a
                href="https://lucide.dev/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all font-bold"
              >
                <span>Full Lucide Library</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/80 border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 font-semibold mt-10 backdrop-blur-md relative z-10">
        <span>Portfolio CRUD Studio • Clean Light Glass Theme • Secured Session</span>
      </footer>
    </div>
  );
}
