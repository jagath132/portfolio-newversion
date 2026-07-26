import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Database, Workflow, BarChart3, ShieldCheck, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const pillarIcons = [
    { icon: Database, title: 'SQL & Data Engineering', desc: 'Query optimization, multi-source log aggregation, relational schemas' },
    { icon: Workflow, title: 'Process Automation', desc: 'n8n workflows, Power Apps, REST webhooks, manual task reduction' },
    { icon: BarChart3, title: 'BI & Analytics', desc: 'Power BI dashboards, DAX measures, executive KPIs, trend reporting' },
    { icon: ShieldCheck, title: 'QA & Security Ops', desc: 'Selenium automated test suites, SOC log analysis, incident triage' },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
      {/* Glow Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-12">
        {/* Section Title */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-white uppercase font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            ABOUT ME
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-[0_0_10px_#06b6d4]"></div>
        </div>

        {/* Narrative Paragraph */}
        <div className="max-w-4xl mx-auto bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-6 sm:p-10 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:border-cyan-500/40 transition-all">
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal text-justify sm:text-center">
            {personalInfo.fullAbout}
          </p>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {personalInfo.highlights.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.1)] group hover:-translate-y-1"
            >
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 mt-1 uppercase">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {pillarIcons.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all text-left flex flex-col justify-between space-y-3 hover:bg-slate-900/80"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
