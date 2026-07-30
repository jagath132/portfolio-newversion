import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { skillsCategories } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', ...skillsCategories.map((c) => c.category)];

  const filteredCategories = skillsCategories.map((cat) => {
    const matchingSkills = cat.skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, skills: matchingSkills };
  }).filter((cat) => {
    const isCategoryMatch = selectedCategory === 'ALL' || cat.category === selectedCategory;
    return isCategoryMatch && cat.skills.length > 0;
  });

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-white uppercase font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            TECHNICAL SKILLS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-[0_0_10px_#06b6d4]"></div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-cyan-300'
                }`}
              >
                {cat === 'ALL' ? 'ALL SKILLS' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill (e.g., Python, n8n)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
            />
          </div>
        </div>

        {/* Skill Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 backdrop-blur-lg hover:border-cyan-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xs font-bold tracking-widest text-cyan-400 uppercase pb-4 border-b border-cyan-500/20 text-center">
                  {cat.category}
                </h3>

                {/* Skill List */}
                <div className="grid grid-cols-3 gap-3 pt-5">
                  {cat.skills.map((skill) => {
                    const IconComponent = (Icons as any)[skill.iconName] || Icons.FileCode2;
                    return (
                      <div
                        key={skill.name}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-400/50 hover:bg-slate-950 transition-all group"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-sm"
                          style={{ backgroundColor: `${skill.color}20`, border: `1px solid ${skill.color}50` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: skill.color }} />
                        </div>
                        <span className="text-xs font-bold text-slate-200 text-center tracking-tight truncate w-full">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
