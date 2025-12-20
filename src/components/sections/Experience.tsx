import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { SectionWrapper } from '../../hoc';
import { Header } from '../atoms/Header';
import { TExperience } from '../../types';
import { config } from '../../constants/config';
import { experiences } from '../../constants';
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
      iconStyle={{ background: experience.iconBg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      icon={
        <div className="flex h-full w-full items-center justify-center" role="img" aria-label={`${experience.companyName} logo`}>
          {experience.icon ? (
            <img
              src={experience.icon}
              alt={`${experience.companyName} company logo`}
              className="h-[60%] w-[60%] object-contain"
            />
          ) : (
            <Briefcase className="text-white w-1/2 h-1/2" aria-label="Work experience icon" />
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
