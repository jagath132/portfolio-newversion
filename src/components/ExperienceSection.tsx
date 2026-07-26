import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Calendar, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { experienceData } = usePortfolio();
  const [expandedId, setExpandedId] = useState<string | null>('exp1');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-white uppercase font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            EXPERIENCE
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-[0_0_10px_#06b6d4]"></div>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-2.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-cyan-500/50 before:to-transparent">
          {experienceData.map((exp) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div key={exp.id} className="relative group">
                {/* Timeline Glowing Node Marker */}
                <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#06b6d4] group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-cyan-300 animate-ping"></div>
                </div>

                {/* Experience Card */}
                <div className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 p-6 sm:p-8 backdrop-blur-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-cyan-500/20 pb-4">
                    <div>
                      <div className="text-xs font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{exp.period}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold tracking-wide text-white uppercase mt-1">
                        {exp.role}{' '}
                        <span className="text-cyan-400 font-normal">| {exp.company}</span>
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleExpand(exp.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all self-start md:self-auto"
                    >
                      <span>{isExpanded ? 'Less Details' : 'View Achievements'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Summary */}
                  <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {exp.summary}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Key Bullet Points */}
                  {isExpanded && (
                    <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 animate-fadeIn">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Key Responsibilities & Achievements:
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                        {exp.bulletPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
