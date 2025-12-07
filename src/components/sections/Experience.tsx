import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { SectionWrapper } from '../../hoc';
import { Header } from '../atoms/Header';
import { TExperience } from '../../types';
import { config } from '../../constants/config';
import { useFirestore } from '../../hooks/useFirestore';
import { Briefcase } from 'lucide-react';

const ExperienceCard: React.FC<TExperience> = experience => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
      contentArrowStyle={{ borderRight: '7px solid  #232631' }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex h-full w-full items-center justify-center">
          {experience.icon && experience.icon.startsWith('http') ? (
            <img
              src={experience.icon}
              alt={experience.companyName}
              className="h-[60%] w-[60%] object-contain rounded-full"
            />
          ) : (
            <Briefcase className="text-white w-1/2 h-1/2" />
          )}
        </div>
      }
    >
      <div>
        <h3 className="text-[24px] font-bold text-white">{experience.title}</h3>
        <p className="text-secondary text-[16px] font-semibold" style={{ margin: 0 }}>
          {experience.companyName}
        </p>
      </div>

      <ul className="ml-5 mt-5 list-disc space-y-2">
        {experience.points?.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 pl-1 text-[14px] tracking-wider"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { getAll, loading } = useFirestore('experience');
  const [experiences, setExperiences] = useState<TExperience[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getAll();
      setExperiences(data as unknown as TExperience[]);
    };
    fetch();
  }, [getAll]);

  if (loading) return null;

  return (
    <>
      <Header {...config.sections.experience} />

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, 'experience');
