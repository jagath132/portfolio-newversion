import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Mail, Send, MapPin, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { personalInfo } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-slate-950 border-t border-cyan-500/10 pt-20 pb-10 px-4 sm:px-6 lg:px-8 text-slate-400 overflow-hidden">
      {/* Background Subtle Gradient Lights */}
      <div className="absolute -bottom-20 left-1/4 w-[400px] h-[250px] bg-cyan-950/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-20 right-1/4 w-[400px] h-[250px] bg-teal-950/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Footer Layout - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16">
          
          {/* Identity & Status (Col span 5) */}
          <div className="md:col-span-5 space-y-5">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="inline-block text-2xl font-bold tracking-widest text-white hover:text-cyan-400 transition-colors group"
            >
              <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 ml-1.5 animate-pulse shadow-[0_0_8px_#06b6d4]"></span>
            </a>
            
            <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-sm">
              {personalInfo.shortBio}
            </p>
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs font-bold text-emerald-400 tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>AVAILABLE FOR ROLES & CONTRACTS</span>
            </div>
          </div>

          {/* Quick Links Sitemap (Col span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              {[
                { name: 'About Me', id: 'about' },
                { name: 'Education', id: 'education' },
                { name: 'Skills & Tech', id: 'skills' },
                { name: 'Experience', id: 'experience' },
                { name: 'Featured Projects', id: 'projects' },
                { name: 'Contact Info', id: 'contact' },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="hover:text-cyan-300 transition-all duration-200 transform hover:translate-x-1.5 flex items-center gap-1 text-slate-400"
                  >
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Connections / Social Icons Row */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
              CONNECT DIRECTLY
            </h4>
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Github, href: personalInfo.socials.github, label: 'GitHub' },
                { icon: Linkedin, href: personalInfo.socials.linkedin, label: 'LinkedIn' },
                { icon: Twitter, href: personalInfo.socials.twitter, label: 'Twitter' },
                { icon: Send, href: personalInfo.socials.telegram, label: 'Telegram' },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-950/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}

              {/* Back to top button */}
              <button
                onClick={scrollToTop}
                className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-950/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
                title="Back to Top"
                aria-label="Back to top"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
