import React, { useState, useEffect } from 'react';
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
  ArrowUp
} from 'lucide-react';
import { EducationItem, SkillCategory, ExperienceItem, ProjectItem } from '../../src/types';

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

  // Check LocalStorage for Passcode on Mount
  useEffect(() => {
    const savedPasscode = localStorage.getItem('portfolio_admin_passcode');
    if (savedPasscode) {
      verifyPasscode(savedPasscode);
    } else {
      setLoading(false);
    }
  }, []);

  // Check if data is dirty (modified)
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

  // Helper state updates
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

  // Highlights handlers
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

  // Education handlers
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

  // Skills handlers
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
            skills: [...cat.skills, { name: '', iconName: 'FileCode2', level: 80, color: '#06B6D4' }]
          };
        }
        return cat;
      })
    }));
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

  // Experience handlers
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

  // Projects handlers
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-widest text-slate-400">LOADING DATABASE...</p>
      </div>
    );
  }

  // PASSCODE AUTHENTICATION SCREEN
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden font-sans select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(6,182,212,0.15)] text-cyan-400">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-wide text-white">ADMIN GATEWAY</h2>
              <p className="text-xs text-slate-400 font-semibold tracking-wider mt-1">JAGATH R. PORTFOLIO MANAGER</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter passcode (e.g. admin)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-2xl py-3.5 pl-5 pr-5 text-sm text-white placeholder-slate-600 focus:outline-none transition-all shadow-inner"
                />
              </div>
              
              {authError && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/20 border border-rose-500/20 py-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-98 cursor-pointer"
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

  // MAIN DASHBOARD LAYOUT
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative font-sans">
      
      {/* Floating Save Banner */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-widest bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              {data.personalInfo.name || 'PORTFOLIO'} ADMIN
            </h1>
            {isDirty && (
              <span className="text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-md animate-pulse">
                UNSAVED CHANGES
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Status alerts */}
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-xs text-cyan-400 font-bold bg-cyan-950/20 border border-cyan-500/20 px-3 py-1.5 rounded-xl">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <Check className="w-3.5 h-3.5" />
                <span>Saved successfully!</span>
              </span>
            )}
            {saveStatus === 'failed' && (
              <span className="flex items-center gap-1 text-xs text-rose-400 font-bold bg-rose-950/20 border border-rose-500/20 px-3 py-1.5 rounded-xl" title={errorMessage}>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Save failed</span>
              </span>
            )}

            {/* Action buttons */}
            <button
              onClick={saveChanges}
              disabled={!isDirty || saveStatus === 'saving'}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isDirty && saveStatus !== 'saving'
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95'
                  : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE CHANGES</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 hover:border-slate-700 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-6">
        
        {/* Sidebar Nav Tabs */}
        <nav className="md:w-56 flex flex-row md:flex-col gap-1.5 shrink-0 overflow-x-auto md:overflow-visible pb-3 md:pb-0 border-b md:border-b-0 border-slate-900">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.08)]'
                    : 'bg-slate-900/40 border border-transparent text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Editor Contents */}
        <main className="flex-1 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-sm min-h-[500px]">
          
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">Personal Information</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Manage main headings, statements, and contact profiles.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Name</label>
                  <input
                    type="text"
                    value={data.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Title</label>
                  <input
                    type="text"
                    value={data.personalInfo.title}
                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Bio (Footer & Hero)</label>
                <textarea
                  rows={2}
                  value={data.personalInfo.shortBio}
                  onChange={(e) => updatePersonalInfo('shortBio', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none resize-y"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full About Biography</label>
                <textarea
                  rows={4}
                  value={data.personalInfo.fullAbout}
                  onChange={(e) => updatePersonalInfo('fullAbout', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none resize-y"
                />
              </div>

              {/* Social Channels */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Social Connections</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'github', label: 'GitHub URL' },
                    { key: 'linkedin', label: 'LinkedIn URL' },
                    { key: 'twitter', label: 'Twitter / X URL' },
                    { key: 'telegram', label: 'Telegram URL' },
                    { key: 'email', label: 'Email Link (mailto:)' }
                  ].map(social => (
                    <div key={social.key} className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">{social.label}</label>
                      <input
                        type="text"
                        value={(data.personalInfo.socials as any)[social.key] || ''}
                        onChange={(e) => updateSocials(social.key, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat Highlights */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Profile Highlights</h4>
                  <button
                    onClick={handleAddHighlight}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer"
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
                          className="bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 99.8%)"
                          value={highlight.value}
                          onChange={(e) => handleUpdateHighlight(idx, 'value', e.target.value)}
                          className="bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteHighlight(idx)}
                        className="p-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-950/20 hover:border-rose-500/40 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                  {data.personalInfo.highlights.length === 0 && (
                    <p className="text-xs text-slate-500 italic text-center py-2">No highlights defined. Click "Add Highlight" above.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS CATEGORIES */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Skills Matrix</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Create skill categories and assign specific skill cards.</p>
                </div>
                <button
                  onClick={handleAddSkillCategory}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>NEW CATEGORY</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.skillsCategories.map((category) => {
                  const isExpanded = expandedCategories[category.id] !== false;
                  return (
                    <div key={category.id} className="border border-slate-850 bg-slate-950/40 rounded-2xl overflow-hidden transition-all">
                      
                      {/* Accordion Header */}
                      <div className="flex items-center justify-between px-5 py-4 bg-slate-900/30 border-b border-slate-850">
                        <div className="flex-1 flex items-center gap-3 pr-4">
                          <input
                            type="text"
                            value={category.category}
                            onChange={(e) => handleUpdateSkillCategoryName(category.id, e.target.value)}
                            className="bg-transparent border-b border-transparent focus:border-cyan-500/40 text-sm font-bold text-white uppercase focus:outline-none py-0.5 px-1 max-w-sm shrink-0"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddSkill(category.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer"
                            title="Add skill tile"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD SKILL</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSkillCategory(category.id)}
                            className="p-2 rounded-lg border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-950/20 hover:border-rose-500/40 transition-all cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="p-2 text-slate-400 hover:text-white transition-all cursor-pointer"
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
                              <div key={skIdx} className="flex flex-col gap-3 p-4 bg-slate-900/60 border border-slate-850 rounded-xl relative group">
                                <button
                                  onClick={() => handleDeleteSkill(category.id, skIdx)}
                                  className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                  title="Remove skill"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-450 uppercase">Skill Name</label>
                                  <input
                                    type="text"
                                    value={skill.name}
                                    placeholder="e.g. Python"
                                    onChange={(e) => handleUpdateSkill(category.id, skIdx, 'name', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-lg px-3 py-2 text-xs focus:outline-none"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase">Lucide Icon</label>
                                    <input
                                      type="text"
                                      value={skill.iconName}
                                      placeholder="e.g. FileCode2"
                                      onChange={(e) => handleUpdateSkill(category.id, skIdx, 'iconName', e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-lg px-3 py-2 text-xs focus:outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-450 uppercase">Brand Color (HEX)</label>
                                    <div className="flex gap-2">
                                      <input
                                        type="color"
                                        value={skill.color}
                                        onChange={(e) => handleUpdateSkill(category.id, skIdx, 'color', e.target.value)}
                                        className="w-7 h-7 rounded border border-slate-800 bg-transparent cursor-pointer p-0 shrink-0"
                                      />
                                      <input
                                        type="text"
                                        value={skill.color}
                                        placeholder="#FFFFFF"
                                        onChange={(e) => handleUpdateSkill(category.id, skIdx, 'color', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-lg px-2 py-1 text-[11px] focus:outline-none font-mono"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-450 uppercase">
                                    <span>Knowledge level</span>
                                    <span className="text-cyan-400">{skill.level}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={skill.level}
                                    onChange={(e) => handleUpdateSkill(category.id, skIdx, 'level', parseInt(e.target.value))}
                                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          {category.skills.length === 0 && (
                            <p className="text-xs text-slate-500 italic text-center py-4">No skills in this category. Click "Add Skill" above.</p>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
                {data.skillsCategories.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-8">No skill categories available. Click "New Category" above.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Education Milestones</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Manage academic history and degree profiles.</p>
                </div>
                <button
                  onClick={handleAddEducation}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ADD EDUCATION</span>
                </button>
              </div>

              <div className="space-y-8">
                {data.educationData.map((item, idx) => (
                  <div key={item.id} className="p-6 bg-slate-950/40 border border-slate-850 rounded-2xl relative group">
                    <button
                      onClick={() => handleDeleteEducation(item.id)}
                      className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 hover:text-rose-450 hover:bg-rose-950/20 transition-all cursor-pointer"
                      title="Delete education milestone"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Degree / Qualification</label>
                        <input
                          type="text"
                          value={item.degree}
                          onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Field of Study</label>
                        <input
                          type="text"
                          value={item.field}
                          onChange={(e) => handleUpdateEducation(idx, 'field', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Institution Name</label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Duration Period (e.g. 2023 - 2025)</label>
                        <input
                          type="text"
                          value={item.duration}
                          onChange={(e) => handleUpdateEducation(idx, 'duration', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pb-4">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Summary Description</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateEducation(idx, 'description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-y"
                      />
                    </div>

                    {/* Achievements List */}
                    <div className="border-t border-slate-900 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Key Achievements</label>
                        <button
                          onClick={() => handleAddEducationAchievement(idx)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-bold bg-cyan-950 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer"
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
                              className="flex-1 bg-slate-955 border border-slate-850 focus:border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                            />
                            <button
                              onClick={() => handleDeleteEducationAchievement(idx, achIdx)}
                              className="p-2 rounded-xl border border-rose-500/10 text-rose-455 hover:text-white hover:bg-rose-950/20 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {item.achievements.length === 0 && (
                          <p className="text-[11px] text-slate-500 italic py-1">No achievements linked. Click "Add Achievement" above.</p>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
                {data.educationData.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-12">No education milestones available. Click "Add Education" above.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Experience Timeline</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Manage jobs, internships, roles, and tech stacks.</p>
                </div>
                <button
                  onClick={handleAddExperience}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ADD EXPERIENCE</span>
                </button>
              </div>

              <div className="space-y-8">
                {data.experienceData.map((item, idx) => (
                  <div key={item.id} className="p-6 bg-slate-955/40 border border-slate-850 rounded-2xl relative group">
                    <button
                      onClick={() => handleDeleteExperience(item.id)}
                      className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 hover:text-rose-450 hover:bg-rose-950/20 transition-all cursor-pointer"
                      title="Delete experience item"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Company Name</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Role / Title</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Duration Period (e.g. AUG 2025 - PRESENT)</label>
                        <input
                          type="text"
                          value={item.period}
                          onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Location (Optional)</label>
                        <input
                          type="text"
                          value={item.location || ''}
                          placeholder="e.g. Remote, Chennai"
                          onChange={(e) => handleUpdateExperience(idx, 'location', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pb-4">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Tech Stack (comma-separated list)</label>
                      <input
                        type="text"
                        value={item.techStack.join(', ')}
                        placeholder="e.g. n8n, SQL, Python"
                        onChange={(e) => {
                          const stack = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                          handleUpdateExperience(idx, 'techStack', stack);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 pb-4">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Summary (Overview of experience)</label>
                      <textarea
                        rows={2}
                        value={item.summary}
                        onChange={(e) => handleUpdateExperience(idx, 'summary', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-y"
                      />
                    </div>

                    {/* Bullet Points List */}
                    <div className="border-t border-slate-900 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Job Descriptions / Tasks</label>
                        <button
                          onClick={() => handleAddExperienceBullet(idx)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-bold bg-cyan-950 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer"
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
                              className="flex-1 bg-slate-955 border border-slate-850 focus:border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                            />
                            <button
                              onClick={() => handleDeleteExperienceBullet(idx, bulIdx)}
                              className="p-2 rounded-xl border border-rose-500/10 text-rose-455 hover:text-white hover:bg-rose-950/20 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {item.bulletPoints.length === 0 && (
                          <p className="text-[11px] text-slate-500 italic py-1">No detail bullets added. Click "Add Bullet Point" above.</p>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
                {data.experienceData.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-12">No experience timeline items available. Click "Add Experience" above.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS BUILDER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Projects Builder</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Manage showcased projects, dynamic stats, architectures, and images.</p>
                </div>
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ADD PROJECT</span>
                </button>
              </div>

              <div className="space-y-12">
                {data.projectsData.map((item, idx) => (
                  <div key={item.id} className="p-6 bg-slate-955/30 border border-slate-850 rounded-2xl relative group space-y-6">
                    <button
                      onClick={() => handleDeleteProject(item.id)}
                      className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 hover:text-rose-450 hover:bg-rose-950/20 transition-all cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div>
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-900 pb-2">Basic Info</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Project Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                          className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Subtitle / Caption</label>
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={(e) => handleUpdateProject(idx, 'subtitle', e.target.value)}
                          className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Local Static Image Link</label>
                        <input
                          type="text"
                          value={item.image}
                          placeholder="e.g. /images/sales_dashboard.jpg"
                          onChange={(e) => handleUpdateProject(idx, 'image', e.target.value)}
                          className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Tags / Stack (comma-separated)</label>
                        <input
                          type="text"
                          value={item.tags.join(', ')}
                          placeholder="e.g. Power BI, Excel, SQL"
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                            handleUpdateProject(idx, 'tags', tags);
                          }}
                          className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Live Demo Link (Use # if none)</label>
                        <input
                          type="text"
                          value={item.demoUrl || ''}
                          onChange={(e) => handleUpdateProject(idx, 'demoUrl', e.target.value)}
                          className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">GitHub Repository Link (Use # if none)</label>
                        <input
                          type="text"
                          value={item.githubUrl || ''}
                          onChange={(e) => handleUpdateProject(idx, 'githubUrl', e.target.value)}
                          className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Short Description (Grid card snippet)</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                        className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-y"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-900 pb-2">Modal Details</h4>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Project Overview</label>
                        <textarea
                          rows={3}
                          value={item.fullDetails.overview}
                          onChange={(e) => handleUpdateProjectDetails(idx, 'overview', e.target.value)}
                          className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-y"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Architecture / Pipeline Workflow</label>
                        <input
                          type="text"
                          value={item.fullDetails.architecture}
                          placeholder="e.g. Excel -> SQL Server -> Power BI"
                          onChange={(e) => handleUpdateProjectDetails(idx, 'architecture', e.target.value)}
                          className="w-full bg-slate-955 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Modal Key Features */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Key Features Checklist</label>
                          <button
                            onClick={() => handleAddProjectFeature(idx)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold bg-cyan-950 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
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
                                className="flex-1 bg-slate-955 border border-slate-850 focus:border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                              />
                              <button
                                onClick={() => handleDeleteProjectFeature(idx, featIdx)}
                                className="p-2 rounded-xl border border-rose-500/10 text-rose-455 hover:text-white hover:bg-rose-950/20 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          {item.fullDetails.keyFeatures.length === 0 && (
                            <p className="text-[10px] text-slate-500 italic py-1">No feature checklist added. Click "Add Feature" above.</p>
                          )}
                        </div>
                      </div>

                      {/* Modal Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Project Metrics / KPIs</label>
                          <button
                            onClick={() => handleAddProjectMetric(idx)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold bg-cyan-950 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
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
                                  className="bg-slate-955 border border-slate-850 focus:border-cyan-500/40 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="KPI Value (e.g. 150,000+)"
                                  value={metric.value}
                                  onChange={(e) => handleUpdateProjectMetric(idx, metIdx, 'value', e.target.value)}
                                  className="bg-slate-955 border border-slate-850 focus:border-cyan-500/40 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => handleDeleteProjectMetric(idx, metIdx)}
                                className="p-2 rounded-xl border border-rose-500/10 text-rose-455 hover:text-white hover:bg-rose-950/20 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          {item.fullDetails.metrics.length === 0 && (
                            <p className="text-[10px] text-slate-500 italic py-1">No metrics defined. Click "Add Metric" above.</p>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
                {data.projectsData.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-12">No projects configured. Click "Add Project" above.</p>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-semibold mt-10">
        <span>Portfolio CRUD Portal • Auth Code active • Secured Session</span>
      </footer>
    </div>
  );
}
