import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../../hoc';
import { Header } from '../atoms/Header';
import { TExperience } from '../../types';
import { config } from '../../constants/config';
import { useFirestore } from '../../hooks/useFirestore';
import { Briefcase, ExternalLink } from 'lucide-react';

const ExperienceCard: React.FC<{
  experience: TExperience;
  onSelect: () => void;
}> = ({ experience, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <VerticalTimelineElement
      contentStyle={{
        background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0, 242, 234, 0.15), 0 8px 32px rgba(31, 38, 135, 0.37)'
          : '0 8px 32px rgba(31, 38, 135, 0.37)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      contentArrowStyle={{
        borderRight: '7px solid rgba(255, 255, 255, 0.1)',
        filter: 'drop-shadow(0 0 10px rgba(0, 242, 234, 0.2))',
      }}
      date={
        <motion.span
          className="text-accent-cyan font-semibold text-sm"
          animate={{ color: isHovered ? '#00f2ea' : '#00f2ea' }}
          transition={{ duration: 0.2 }}
        >
          {experience.date}
        </motion.span>
      }
      iconStyle={{
        background: isHovered
          ? 'linear-gradient(135deg, #00f2ea, #8b5cf6)'
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isHovered
          ? '0 0 30px rgba(0, 242, 234, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)'
          : '0 0 20px rgba(0, 242, 234, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease',
      }}
      icon={
        <motion.div
          className="flex h-full w-full items-center justify-center"
          role="img"
          aria-label={`${experience.companyName} logo`}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {experience.icon ? (
            <img
              src={experience.icon}
              alt={`${experience.companyName} company logo`}
              className="h-[70%] w-[70%] object-contain rounded-lg"
            />
          ) : (
            <Briefcase
              className="text-white w-1/2 h-1/2 drop-shadow-lg"
              aria-label="Work experience icon"
            />
          )}
        </motion.div>
      }
      onTimelineElementClick={onSelect}
      intersectionObserverProps={{ triggerOnce: true }}
    >
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute -inset-2 rounded-xl opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
            boxShadow: isHovered
              ? '0 0 30px rgba(0, 242, 234, 0.3), 0 0 60px rgba(139, 92, 246, 0.2)'
              : '0 0 0px rgba(0, 242, 234, 0)',
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          animate={{
            backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          }}
          transition={{ duration: 0.2 }}
          className="p-2 rounded-lg"
        >
          <motion.h3
            className="text-[24px] font-bold text-white mb-2 flex items-center gap-2"
            animate={{
              color: isHovered ? '#00f2ea' : '#ffffff',
            }}
            transition={{ duration: 0.2 }}
          >
            {experience.title}
            <motion.span animate={{ x: isHovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
              <ExternalLink size={20} className="opacity-60" />
            </motion.span>
          </motion.h3>

          <motion.p
            className="text-secondary text-[16px] font-semibold mb-4"
            animate={{
              color: isHovered ? '#8b5cf6' : '#aaa6c3',
            }}
            transition={{ duration: 0.2 }}
          >
            {experience.companyName}
          </motion.p>

          <motion.ul
            className="ml-5 space-y-3"
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {experience.points?.slice(0, 3).map((point, idx) => (
              <motion.li
                key={`experience-point-${idx}`}
                className="text-white-100 pl-1 text-[14px] tracking-wider flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-accent-cyan mt-1 text-xs">▹</span>
                <span>{point}</span>
              </motion.li>
            ))}
            {experience.points && experience.points.length > 3 && (
              <motion.li
                className="text-accent-cyan text-sm font-medium pl-1"
                animate={{ opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
              >
                +{experience.points.length - 3} more achievements...
              </motion.li>
            )}
          </motion.ul>
        </motion.div>
      </motion.div>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { useRealtime, loading } = useFirestore('experience');
  const [experienceList, setExperienceList] = useState<TExperience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);

  useRealtime(data => {
    setExperienceList(data as TExperience[]);
  });

  if (loading)
    return (
      <div className="text-white text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto mb-4"></div>
        Loading Experiences...
      </div>
    );

  return (
    <>
      <Header {...config.sections.experience} />

      <motion.div
        className="mt-8 max-w-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <p className="text-[17px] leading-[30px] text-secondary">
          My professional journey and key achievements in data analysis, automation, and software
          development.
        </p>
      </motion.div>

      <div className="mt-20">
        <VerticalTimeline lineColor="rgba(0, 242, 234, 0.3)" className="custom-timeline">
          {experienceList.map((experience) => (
            <ExperienceCard
              key={experience.id || index}
              experience={experience}
              onSelect={() => setSelectedExperience(selectedExperience === index ? null : index)}
            />
          ))}
        </VerticalTimeline>
      </div>

      {/* Experience Details Modal */}
      <AnimatePresence>
        {selectedExperience !== null && experienceList[selectedExperience] && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setSelectedExperience(null);
              document.body.style.overflow = 'auto';
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <motion.div
              className="relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl p-12 max-w-4xl w-full border border-white/30 backdrop-blur-2xl shadow-2xl shadow-accent-cyan/40 my-12"
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedExperience(null)}
                className="absolute top-8 right-8 text-white/60 hover:text-accent-cyan transition-colors z-10 p-3 hover:bg-white/10 rounded-full"
                whileHover={{ scale: 1.2, rotate: 90 }}
                transition={{ duration: 0.2 }}
                aria-label="Close experience details modal"
              >
                <span className="text-3xl font-light" aria-hidden="true">
                  ✕
                </span>
              </motion.button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Company Logo Section */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl shadow-xl shadow-accent-cyan/30 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="p-8">
                    {experienceList[selectedExperience].icon ? (
                      <img
                        src={experienceList[selectedExperience].icon}
                        alt={`${experienceList[selectedExperience].companyName} company logo`}
                        className="h-32 w-32 object-contain"
                      />
                    ) : (
                      <div className="p-8 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full">
                        <Briefcase className="w-16 h-16 text-cyan-400" />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                  className="flex flex-col justify-between space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {/* Title & Company */}
                  <div>
                    <motion.h2
                      id="modal-title"
                      className="text-4xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {experienceList[selectedExperience].title}
                    </motion.h2>
                    <motion.p
                      className="text-purple-400 font-medium text-xl mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      {experienceList[selectedExperience].companyName}
                    </motion.p>
                    <motion.p
                      className="text-secondary/80 text-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {experienceList[selectedExperience].date}
                    </motion.p>
                  </div>

                  {/* Responsibilities */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <h3 className="text-sm font-bold text-accent-cyan/80 mb-4 uppercase tracking-widest">
                      Key Responsibilities & Achievements
                    </h3>
                    <ul className="space-y-3 text-secondary/90 text-base leading-relaxed">
                      {experienceList[selectedExperience].points?.map((point, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                        >
                          <span className="text-accent-cyan mt-1">▹</span>
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(Experience, 'experience');
