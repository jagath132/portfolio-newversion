import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { SectionWrapper } from '../../hoc';
import { skillCategories } from '../../constants';
import { fadeIn, textVariant, slideIn } from '../../utils/motion';
import { config } from '../../constants/config';
import { Header } from '../atoms/Header';

interface SkillCardProps {
  name: string;
  icon: string;
}

interface CategoryProps {
  title: string;
  technologies: Array<{ name: string; icon: string }>;
  index: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const SkillCard: React.FC<SkillCardProps> = ({ name, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-sm border border-white/[0.1] shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />

        {/* Icon container with enhanced styling */}
        <motion.div
          className="relative z-10 h-16 w-16 rounded-xl bg-gradient-to-br from-white/[0.9] to-white/[0.7] p-3 shadow-lg group-hover:shadow-xl"
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={icon}
            alt={name}
            className="h-full w-full object-contain filter group-hover:brightness-110"
            initial={false}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Skill name with enhanced typography */}
        <motion.p
          className="relative z-10 text-center text-[13px] font-semibold text-white/90 group-hover:text-white transition-colors duration-300"
          initial={false}
          animate={{ y: isHovered ? -2 : 0 }}
        >
          {name}
        </motion.p>

        {/* Floating particles effect */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  initial={{
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SkillCategory: React.FC<CategoryProps> = ({ title, technologies, index }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Show all categories expanded by default

  return (
    <motion.div variants={slideIn('up', 'spring', index * 0.2, 0.75)} className="w-full">
      {/* Category Header */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-8 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.h3
          variants={textVariant()}
          className="text-white font-bold text-[24px] text-center whitespace-nowrap bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          {title}
        </motion.h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/70"
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>

      {/* Skills Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center"
            >
              {technologies.map((technology) => (
                <SkillCard key={technology.name} name={technology.name} icon={technology.icon} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Tech = () => {
  return (
    <>
      <Header useMotion={true} {...config.sections.skills} />

      <motion.div
        variants={fadeIn('', '', 0.1, 1)}
        className="text-secondary mt-4 text-[17px] leading-[30px] text-justify space-y-6"
      >
        <p>
          Here are the key technologies and tools I work with to deliver data-driven solutions and
          automate business processes. Each skill represents a piece of my expertise in building
          efficient, scalable solutions.
        </p>
      </motion.div>

      <div className="mt-20 space-y-16">
        {skillCategories.map((category, categoryIndex) => (
          <SkillCategory
            key={category.title}
            title={category.title}
            technologies={category.technologies}
            index={categoryIndex}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, 'skills');
