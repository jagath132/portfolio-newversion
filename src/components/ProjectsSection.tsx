import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';
import { ExternalLink, Layers, Eye } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { projectsData } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-white uppercase font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            PROJECTS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-[0_0_10px_#06b6d4]"></div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsData.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group cursor-pointer rounded-2xl bg-gradient-to-b from-slate-900/90 to-purple-950/40 border-2 border-cyan-500/50 hover:border-cyan-400 p-4 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Image Preview Box */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-950 border border-slate-800">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full text-xs font-bold text-slate-950 bg-cyan-300 flex items-center gap-1.5 shadow-[0_0_15px_#06b6d4]">
                      <Eye className="w-4 h-4" /> VIEW FULL DETAILS
                    </span>
                  </div>
                </div>

                {/* Card Title & Tags */}
                <div className="mt-5 space-y-2">
                  <h3 className="text-base sm:text-lg font-black tracking-wider text-white uppercase group-hover:text-cyan-300 transition-colors">
                    {proj.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-400">
                    {proj.tags.join(', ')}
                  </div>
                </div>
              </div>

              {/* Description Footer */}
              <div className="mt-4 pt-3 border-t border-cyan-500/20 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {proj.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};
