import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Award, Calendar, School } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { educationData } = usePortfolio();
  return (
    <section id="education" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-white uppercase font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            EDUCATION
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-[0_0_10px_#06b6d4]"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {educationData.map((edu) => (
            <div
              key={edu.id}
              className="relative group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-2 border-cyan-500/60 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Bar with Icon */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-cyan-950/90 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {edu.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course & Institution */}
              <div className="mt-6 space-y-2">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-wide text-white uppercase group-hover:text-cyan-300 transition-colors">
                  {edu.degree}
                </h3>
                <div className="flex items-center gap-2 text-cyan-400/90 font-bold text-xs sm:text-sm tracking-wider uppercase">
                  <School className="w-4 h-4 shrink-0" />
                  <span>{edu.institution}</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {edu.description}
              </p>

              {/* Highlights List */}
              <div className="mt-6 pt-4 border-t border-cyan-500/20 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Academic Focus & Highlights</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {edu.achievements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
