import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { SectionWrapper } from '../../hoc';
import { Header } from '../atoms/Header';
import { config } from '../../constants/config';
import { TEducation } from '../../types';
import { useFirestore } from '../../hooks/useFirestore';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';

const EducationCard: React.FC<{ education: TEducation; index: number }> = ({ education, index }) => {
  // Extracting both name and degree. Fallback to degree if name is missing.
  const { name, degree, institution, year, description } = education as any;
  const displayTitle = name || degree;
  const displaySubtitle = name ? degree : null;

  // Alternating colors for extreme visual polish
  const isEven = index % 2 === 0;
  const primaryColor = isEven ? 'accent-cyan' : 'purple-500';
  const shadowGlowColor = isEven ? 'rgba(0,242,234,0.4)' : 'rgba(168,85,247,0.4)';
  const borderGradient = isEven
    ? 'hover:from-accent-cyan/60 hover:to-blue-500/60'
    : 'hover:from-purple-500/60 hover:to-pink-500/60';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="w-full"
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        scale={1.03}
        transitionSpeed={1500}
        glareEnable={true}
        glareMaxOpacity={0.15}
        glareColor="#ffffff"
        glarePosition="all"
        className="w-full h-full rounded-[30px]"
      >
        <div className={`relative group w-full h-full rounded-[30px] p-[1px] bg-gradient-to-br from-white/10 to-transparent ${borderGradient} transition-all duration-500 hover:shadow-[0_20px_50px_-15px_${shadowGlowColor}]`}>
          <div className="relative w-full h-full bg-[#0d0d14]/90 backdrop-blur-2xl rounded-[30px] p-8 md:p-10 flex flex-col justify-between overflow-hidden">

            {/* Ambient Background Glow Effect */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 blur-[90px] rounded-full mix-blend-screen opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none bg-${primaryColor}`} />

            <div className="relative z-10">
              {/* Header: Icon + Year Badge */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_25px_${shadowGlowColor}] flex-shrink-0`}>
                  <GraduationCap size={32} />
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-secondary text-sm font-semibold backdrop-blur-md whitespace-nowrap">
                  <Calendar size={16} className={`text-${primaryColor}`} />
                  <span>{year}</span>
                </div>
              </div>

              {/* Body: Degree + Institution */}
              <h3 className={`text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight transition-colors duration-300 group-hover:text-${primaryColor}`}>
                {displayTitle}
              </h3>

              {displaySubtitle && (
                <div className="flex items-center gap-2 mb-4 text-white/70 font-medium">
                  <BookOpen size={16} className="opacity-60" />
                  <span className="text-sm uppercase tracking-widest">{displaySubtitle}</span>
                </div>
              )}

              <div className={`flex items-center gap-3 mb-6 font-semibold text-lg md:text-xl text-${isEven ? 'purple-400' : 'accent-cyan'}`}>
                <Award size={22} />
                <h4>{institution}</h4>
              </div>

              {description && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-secondary/90 leading-relaxed text-sm md:text-base font-light text-justify">
                    {description}
                  </p>
                </div>
              )}
            </div>

            {/* Futuristic Bottom Loading Line Deco */}
            <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-transparent via-${primaryColor} to-transparent group-hover:w-full transition-all duration-700 ease-out opacity-0 group-hover:opacity-100`} />
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Education = () => {
  const { useRealtime, loading } = useFirestore('education');
  const [educations, setEducations] = useState<TEducation[]>([]);

  useRealtime(data => {
    // Sort logic could go here if year fields were parseable. Assuming order is set in FB.
    setEducations(data as unknown as TEducation[]);
  });

  if (loading)
    return (
      <div className="text-white text-center py-20 min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mb-6 drop-shadow-[0_0_15px_rgba(0,242,234,0.5)]"></div>
        <p className="text-xl font-light text-secondary">Loading Academic Records...</p>
      </div>
    );

  return (
    <div className="relative z-10 w-full py-20 px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
      >
        <Header {...config.sections.education} />

        <div className="mt-8 max-w-4xl">
          <p className="text-secondary text-lg leading-relaxed text-justify rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-accent-cyan px-6 py-5">
            {config.sections.education.content}
          </p>
        </div>
      </motion.div>

      {/* 
        Education Grid Layout 
        Switch to 1 column on mobile, and standard 2 columns on larger screens
      */}
      <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative">
        {educations.map((education, index) => (
          <EducationCard
            key={(education as any).name || education.degree || index}
            education={education}
            index={index}
          />
        ))}

        {/* Background decorative path (visible mostly on desktop behind grid) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none hidden lg:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none hidden lg:block" />
      </div>
    </div>
  );
};

export default SectionWrapper(Education, 'education');
