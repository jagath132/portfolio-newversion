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

          {/* Direct Connections / Contacts (Col span 4) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
              CONNECT DIRECTLY
            </h4>
            <div className="space-y-3.5 text-sm font-semibold text-slate-300">
              {/* Location */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
              
              {/* Email */}
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <a
                  href={personalInfo.socials.email}
                  className="hover:text-cyan-300 transition-colors border-b border-transparent hover:border-cyan-300/40"
                >
                  {personalInfo.socials.email.replace('mailto:', '')}
                </a>
              </div>

              {/* LinkedIn Quick Connect */}
              <div className="flex items-start gap-2.5">
                <Linkedin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <a
                  href={personalInfo.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-300 transition-colors border-b border-transparent hover:border-cyan-300/40"
                >
                  <span>Professional LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

        {/* Bottom Bar: Socials, Back to Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-end gap-6">

          {/* Social Icons row & Back to Top */}
          <div className="flex items-center gap-4 order-1 md:order-2">
            
            {/* Social Icons group */}
            <div className="flex items-center gap-2.5">
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
                    className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-950/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-sm"
              title="Back to Top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </footer>
  );
};
