import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionWrapper } from '../../hoc';
import { config } from '../../constants/config';
import { Header } from '../atoms/Header';
import { useFirestore } from '../../hooks/useFirestore';

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
    <div className="group relative w-full" role="listitem" aria-label={`Skill: ${name}`}>
      {/* Card Content */}
      <div className="relative flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-gray-900/50 p-4 transition-all duration-300 hover:border-accent-cyan/50 hover:bg-gray-900/80 hover:shadow-neon">
        {/* Icon (if available) */}


        {/* Skill Name */}
        <span className="text-center text-sm font-medium text-gray-300 transition-colors duration-300 group-hover:text-white">
          {name}
        </span>

        {/* Decorative Corner Accents */}
        <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-purple-500/50" aria-hidden="true" />
        <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-blue-500/50" aria-hidden="true" />
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
        aria-expanded={isExpanded}
        aria-controls={`category-${title.replace(/\s+/g, '-').toLowerCase()}`}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} skills category`}
      >
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-accent-cyan to-accent-pink" aria-hidden="true" />
          <h3 className="text-xl font-bold text-white md:text-2xl">{title}</h3>
        </div>

        <div
          className="rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-md transition-transform duration-300"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <ChevronDown size={20} />
        </div>
      </button>

      {/* Skills Grid */}
      {isExpanded && (
        <div
          className="transition-all duration-400"
          id={`category-${title.replace(/\s+/g, '-').toLowerCase()}`}
          role="list"
          aria-label={`${title} technologies`}
        >
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
  const { useRealtime } = useFirestore('skills');
  const [skillCategories, setSkillCategories] = useState<Array<{ title: string; technologies: any[] }>>([]);

  useRealtime((data) => {
    const grouped: Record<string, any[]> = {};

    data.forEach((skill) => {
      const category = skill.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });

    // Define preferred order if needed, otherwise just sort alphabetical or use valid preset categories
    // Matches admin panel categories
    const PRESET_ORDER = [
      'AI & Automation Tools',
      'Programming Languages',
      'Data & Analytics Tools',
      'Testing & Automation Tools',
      'Version Control & Development',
      'Other'
    ];

    const sortedCategories = Object.keys(grouped)
      .sort((a, b) => {
        const indexA = PRESET_ORDER.indexOf(a);
        const indexB = PRESET_ORDER.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
      })
      .map(title => ({
        title,
        technologies: grouped[title]
      }));

    setSkillCategories(sortedCategories);
  });

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
        {skillCategories.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No skills added yet. Add them in the Admin Panel.
          </div>
        )}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, 'skills');
