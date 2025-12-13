import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionWrapper } from '../../hoc';
import { config } from '../../constants/config';
import { skillCategories } from '../../constants';
import { Header } from '../atoms/Header';

interface SkillCardProps {
  name: string;
  index: number;
}

interface CategoryProps {
  title: string;
  technologies: Array<{ name: string; icon: string }>;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ name }) => {
  return (
    <div className="group relative w-full">
      {/* Card Content */}
      <div className="relative flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-gray-900/50 p-4 transition-all duration-300 hover:border-accent-cyan/50 hover:bg-gray-900/80 hover:shadow-neon">
        {/* Skill Name */}
        <span className="text-center text-sm font-medium text-gray-300 transition-colors duration-300 group-hover:text-white">
          {name}
        </span>

        {/* Decorative Corner Accents */}
        <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-purple-500/50" />
        <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-blue-500/50" />
      </div>
    </div>
  );
};

const SkillCategory: React.FC<CategoryProps> = ({ title, technologies, isExpanded, onToggle }) => {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 sm:p-6 transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-accent-cyan to-accent-pink" />
          <h3 className="text-xl font-bold text-white md:text-2xl">{title}</h3>
        </div>

        <div
          className="rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-md transition-transform duration-300"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronDown size={20} />
        </div>
      </button>

      {/* Skills Grid */}
      {isExpanded && (
        <div className="transition-all duration-400">
          <div className="grid grid-cols-2 gap-3 p-4 pt-0 sm:gap-4 sm:p-6 sm:pt-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {technologies.map((technology, idx) => (
              <SkillCard
                key={technology.name}
                name={technology.name}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Tech = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <>
      <Header {...config.sections.skills} />

      <div className="mt-4 max-w-3xl text-[17px] leading-[30px] text-secondary">
        <p>
          I leverage a diverse set of technologies to build robust, scalable applications. From
          front-end interfaces to back-end logic and data analysis, my toolkit is constantly
          evolving to meet modern development standards.
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-8">
        {skillCategories.map((category, index) => (
          <SkillCategory
            key={category.title}
            title={category.title}
            technologies={category.technologies}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, 'skills');
