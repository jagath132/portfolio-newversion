import React from 'react';
import { ArrowDown } from 'lucide-react';
import { HERO_BG_IMAGE } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';

export const Hero: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4 overflow-hidden bg-slate-950">
      {/* Background Cyber Globe Graphic */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <img
          src={HERO_BG_IMAGE}
          alt="Cyber Globe Wireframe Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 animate-pulse"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950"></div>
      </div>

      {/* Cyber Particle Grid Canvas Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0,transparent_65%)] pointer-events-none"></div>

      {/* Main Content Box */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center space-y-8 mt-10">
        {/* Glow Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>AVAILABLE FOR ROLES & AUTOMATION PROJECTS</span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            HI, I&apos;M{' '}
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.8)]">
              {personalInfo.name}
            </span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl font-bold tracking-widest text-cyan-300/90 uppercase">
            {personalInfo.title}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* View My Work */}
          <button
            onClick={() => scrollToSection('projects')}
            className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_30px_rgba(6,182,212,0.9)] hover:scale-105 active:scale-95"
          >
            VIEW MY WORK
          </button>

          {/* Contact Me */}
          <button
            onClick={() => scrollToSection('contact')}
            className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider text-cyan-300 bg-slate-900/80 border border-cyan-500/50 hover:bg-cyan-950/60 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95"
          >
            CONTACT ME
          </button>
        </div>
      </div>

      {/* Down Arrow Indicator */}
      <div className="absolute bottom-6 z-10 flex flex-col items-center animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          className="text-cyan-400/80 hover:text-cyan-300 transition-colors"
          aria-label="Scroll to About Section"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
