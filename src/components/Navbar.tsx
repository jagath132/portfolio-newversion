import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['about', 'education', 'skills', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ABOUT', href: '#about', id: 'about' },
    { name: 'EDUCATION', href: '#education', id: 'education' },
    { name: 'SKILLS', href: '#skills', id: 'skills' },
    { name: 'EXPERIENCE', href: '#experience', id: 'experience' },
    { name: 'PROJECTS', href: '#projects', id: 'projects' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-5 py-3 sm:px-8 border backdrop-blur-xl ${
          scrolled
            ? 'bg-slate-950/85 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
            : 'bg-slate-900/60 border-cyan-500/20 shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo / Name */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl sm:text-2xl font-bold tracking-widest text-white hover:text-cyan-400 transition-colors flex items-center gap-2 group"
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              {personalInfo.name}
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]"></span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs lg:text-sm font-semibold tracking-wider">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`transition-all duration-200 py-1 border-b-2 ${
                    isActive
                      ? 'text-cyan-400 border-cyan-400 font-bold'
                      : 'text-slate-300 border-transparent hover:text-cyan-300 hover:border-cyan-500/40'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Contact Me Button */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="px-5 py-2 rounded-full text-xs lg:text-sm font-bold tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:shadow-[0_0_22px_rgba(6,182,212,0.8)] active:scale-95"
            >
              CONTACT ME
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-cyan-500/20 flex flex-col space-y-3 pb-2 animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-semibold tracking-wider text-slate-300 hover:text-cyan-400 py-1.5 px-2 rounded-md hover:bg-slate-800/50"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-2">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="w-full text-center py-2.5 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                CONTACT ME
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
