import React, { useState } from 'react';
import { X, ExternalLink, Github, CheckCircle2, BarChart2, Layers, Cpu, Server } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'architecture'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border-2 border-cyan-500/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Tags */}
        <div className="space-y-3 pr-10">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-500/40"
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-wide text-white uppercase">
            {project.title}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-cyan-400">{project.subtitle}</p>
        </div>

        {/* Image Preview Banner */}
        <div className="my-6 rounded-2xl overflow-hidden border border-cyan-500/30 max-h-72 shadow-lg relative group">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-6 gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Project Overview
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider transition-all border-b-2 ${
              activeTab === 'metrics'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Key Metrics & Impact
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider transition-all border-b-2 ${
              activeTab === 'architecture'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            System Architecture
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {project.fullDetails.overview}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Key Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.fullDetails.keyFeatures.map((feat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
            {project.fullDetails.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center space-y-1 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              >
                <div className="text-2xl sm:text-3xl font-black text-cyan-400">{m.value}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase">
                <Server className="w-4 h-4" /> Data Processing Pipeline Flow
              </div>
              <div className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-cyan-200 border border-slate-800 overflow-x-auto">
                {project.fullDetails.architecture}
              </div>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Created by <span className="text-white font-bold">Jagath R.</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
