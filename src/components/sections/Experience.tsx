import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../../hoc';
import { Header } from '../atoms/Header';
import { TExperience } from '../../types';
import { config } from '../../constants/config';
import { useFirestore } from '../../hooks/useFirestore';
import { Briefcase, ExternalLink, Calendar, ChevronRight } from 'lucide-react';

const ExperienceCard: React.FC<{
  experience: TExperience;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}> = ({ experience, index, isActive, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      id={`experience-${index}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
      className="relative mb-16 last:mb-0 w-full"
    >
      {/* Connector Line (Mobile only) */}
      <div className="absolute left-[39px] top-24 bottom-[-64px] w-0.5 bg-gradient-to-b from-accent-cyan/50 to-transparent lg:hidden" />

      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer"
        onClick={onSelect}
      >
        {/* Glowing Background on hover */}
        <motion.div
          className="absolute -inset-4 rounded-3xl opacity-0 pointer-events-none blur-xl transition-opacity duration-300"
          animate={{
            opacity: isHovered || isActive ? 1 : 0,
            background: isActive 
               ? 'linear-gradient(120deg, rgba(0,242,234,0.1), rgba(139,92,246,0.1))'
               : 'linear-gradient(120deg, rgba(0,242,234,0.15), rgba(139,92,246,0.15))'
          }}
        />

        <div className={`relative p-8 md:p-10 rounded-3xl transition-all duration-300 backdrop-blur-md border ${isHovered || isActive ? 'bg-white/10 border-accent-cyan/30 shadow-[0_8px_32px_rgba(0,242,234,0.1)]' : 'bg-white/5 border-white/10 shadow-2xl'} overflow-hidden`}>
          
          {/* Top Header - Icon & Title */}
          <div className="flex flex-col md:flex-row gap-6 md:items-start mb-6">
            
            {/* Logo */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-accent-cyan/20 blur-xl rounded-full animate-pulse-slow" />
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center p-3 z-10 relative overflow-hidden transition-all duration-500 ${isHovered ? 'scale-110 shadow-[0_0_20px_rgba(0,242,234,0.3)]' : 'bg-white/5'}`}>
                {experience.icon ? (
                  <img src={experience.icon} alt={experience.companyName} className="w-full h-full object-contain drop-shadow-lg" />
                ) : (
                  <Briefcase className="w-10 h-10 text-accent-cyan" />
                )}
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50" />
              </div>
            </div>

            {/* Title & Company */}
            <div className="flex-grow pt-2">
               <div className="flex flex-wrap items-center justify-between gap-4">
                 <div>
                    <h3 className={`text-2xl md:text-3xl font-extrabold transition-colors duration-300 ${isHovered || isActive ? 'text-accent-cyan' : 'text-white'}`}>
                      {experience.title}
                    </h3>
                    <p className={`text-lg md:text-xl font-medium mt-1 transition-colors duration-300 ${isHovered || isActive ? 'text-purple-400' : 'text-secondary'}`}>
                      {experience.companyName}
                    </p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-secondary whitespace-nowrap">
                   <Calendar size={14} className="text-accent-cyan" />
                   <span>{experience.date}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Points */}
          <div className="mt-8 pl-0 md:pl-[120px]">
            <ul className="space-y-4">
              {experience.points?.slice(0, 3).map((point, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-start gap-4 text-secondary leading-relaxed text-base md:text-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <span className={`mt-1.5 flex-shrink-0 transition-colors duration-300 ${isHovered ? 'text-accent-cyan scale-110' : 'text-purple-500'}`}>
                    <ChevronRight size={18} />
                  </span>
                  <span className="text-justify">{point}</span>
                </motion.li>
              ))}
              {experience.points && experience.points.length > 3 && (
                <li className="flex items-center gap-2 text-accent-cyan/80 text-sm font-medium mt-4 cursor-pointer hover:text-accent-cyan transition-colors">
                  <span>View full details</span>
                  <ExternalLink size={14} />
                </li>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Experience = () => {
  const { useRealtime, loading } = useFirestore('experience');
  const [experienceList, setExperienceList] = useState<TExperience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useRealtime(data => {
    setExperienceList(data as TExperience[]);
  });

  // Track active section for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      const elements = experienceList.map((_, i) => document.getElementById(`experience-${i}`));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentActiveIndex = 0;
      elements.forEach((el, index) => {
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          const elTop = top + window.scrollY;
          const elBottom = bottom + window.scrollY;
          if (scrollPosition >= elTop && scrollPosition <= elBottom) {
            currentActiveIndex = index;
          }
        }
      });
      setActiveIndex(currentActiveIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [experienceList]);

  // Handle body scroll lock for modal
  useEffect(() => {
    if (selectedExperience !== null) {
      document.body.style.overflow = 'hidden';
      document.querySelector('nav')?.classList.add('hidden');
    } else {
      document.body.style.overflow = '';
      document.querySelector('nav')?.classList.remove('hidden');
    }

    return () => {
      document.body.style.overflow = '';
      document.querySelector('nav')?.classList.remove('hidden');
    };
  }, [selectedExperience]);

  if (loading)
    return (
      <div className="text-white text-center py-20 min-h-[50vh] flex flex-col items-center justify-center">
        <div className="animate-spin-slow rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-cyan mb-6 shadow-[0_0_15px_rgba(0,242,234,0.5)]"></div>
        <p className="text-xl font-light text-secondary">Loading your journey...</p>
      </div>
    );

  return (
    <>
      <Header {...config.sections.experience} />

      <motion.div
        className="mt-8 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <p className="section-description">
          {config.sections.experience.content}
        </p>
      </motion.div>

      <div className="mt-24 flex flex-col lg:flex-row gap-16 relative" ref={containerRef}>
        
        {/* Left Side: Sticky Navigator (Desktop) */}
        <div className="hidden lg:block w-1/4 relative">
          <div className="sticky top-32">
            <h3 className="text-xl font-bold text-white mb-8 tracking-wider uppercase opacity-80 border-b border-white/10 pb-4">Career Journey</h3>
            <div className="relative pl-6">
              {/* Vertical Track */}
              <div className="absolute left-[7px] top-6 bottom-6 w-[2px] bg-white/5 rounded-full" />
              
              <ul className="space-y-10 relative">
                {experienceList.map((exp, idx) => (
                  <li 
                    key={`nav-${idx}`}
                    className="relative cursor-pointer group"
                    onClick={() => {
                      const el = document.getElementById(`experience-${idx}`);
                      if (el) {
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = el.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
                      }
                    }}
                  >
                    {/* Active Dot indicator */}
                    <div className={`absolute -left-[27px] top-2.5 w-4 h-4 rounded-full transition-all duration-500 z-10 ${activeIndex === idx ? 'bg-accent-cyan shadow-[0_0_15px_rgba(0,242,234,0.8)] scale-125' : 'bg-white/20 group-hover:bg-purple-500'}`} />
                    
                    <div className={`transition-all duration-300 ${activeIndex === idx ? 'translate-x-2' : 'group-hover:translate-x-1'}`}>
                      <h4 className={`text-lg font-bold transition-colors duration-300 ${activeIndex === idx ? 'text-accent-cyan' : 'text-white/70 group-hover:text-white'}`}>
                        {exp.companyName}
                      </h4>
                      <p className={`text-sm mt-1 transition-colors duration-300 ${activeIndex === idx ? 'text-purple-400' : 'text-secondary/50 group-hover:text-secondary'}`}>
                        {exp.date}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: Scrollable Cards */}
        <div className="w-full lg:w-3/4">
          {experienceList.map((experience, index) => (
            <ExperienceCard
              key={experience.id || index}
              experience={experience}
              index={index}
              isActive={activeIndex === index}
              onSelect={() => setSelectedExperience(selectedExperience === index ? null : index)}
            />
          ))}
        </div>
      </div>

      {/* Experience Details Fullscreen Modal */}
      <AnimatePresence mode="wait">
        {selectedExperience !== null && experienceList[selectedExperience] && (
          <motion.div
            key="experience-modal"
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[99999] flex items-center justify-center p-0 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedExperience(null)}
            role="dialog"
          >
            <motion.div
              className="relative bg-[#0a0a0a] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl md:rounded-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,242,234,0.1)] overflow-y-auto overflow-x-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedExperience(null)}
                className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-accent-cyan transition-all duration-300 z-50 backdrop-blur-lg border border-white/10"
              >
                <span className="text-2xl font-light">✕</span>
              </button>

              <div className="flex flex-col">
                {/* Hero Header Region */}
                <div className="relative pt-20 pb-16 px-8 md:px-16 bg-gradient-to-b from-accent-cyan/10 via-purple-500/5 to-transparent overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                  <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                    <motion.div 
                      className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center p-6 flex-shrink-0"
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", delay: 0.05 }}
                    >
                      {experienceList[selectedExperience].icon ? (
                         <img src={experienceList[selectedExperience].icon} alt="logo" className="w-full h-full object-contain drop-shadow-lg" />
                      ) : (
                         <Briefcase className="w-16 h-16 text-cyan-400" />
                      )}
                    </motion.div>
                    
                    <div className="text-center md:text-left mt-4 md:mt-2">
                      <motion.h2 
                        className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {experienceList[selectedExperience].title}
                      </motion.h2>
                      <motion.h3
                        className="text-xl md:text-2xl font-semibold text-accent-cyan mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {experienceList[selectedExperience].companyName}
                      </motion.h3>
                      <motion.div
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-secondary"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Calendar size={18} className="text-purple-400" />
                        <span className="font-medium tracking-wide">{experienceList[selectedExperience].date}</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Content Region */}
                <div className="px-8 md:px-16 pb-20 relative z-10">
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.25 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                       <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow" />
                       <h4 className="text-lg font-bold text-white uppercase tracking-widest px-4 opacity-80">
                         Key Contributions
                       </h4>
                       <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {experienceList[selectedExperience].points?.map((point, idx) => (
                        <motion.div
                          key={idx}
                          className="flex gap-5 p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300 group border border-transparent hover:border-white/5"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:scale-110 group-hover:bg-accent-cyan group-hover:text-black transition-all duration-300">
                             <ChevronRight size={18} />
                          </div>
                          <p className="text-secondary group-hover:text-white leading-relaxed text-lg transition-colors duration-300 pt-0.5">
                            {point}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(Experience, 'experience');
