import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PERSONAL_INFO,
  EDUCATION_DATA,
  SKILLS_CATEGORIES,
  EXPERIENCE_DATA,
  PROJECTS_DATA
} from '../data/portfolioData';
import { EducationItem, SkillCategory, ExperienceItem, ProjectItem } from '../types';

interface PortfolioContextType {
  loading: boolean;
  error: boolean;
  personalInfo: typeof PERSONAL_INFO;
  educationData: EducationItem[];
  skillsCategories: SkillCategory[];
  experienceData: ExperienceItem[];
  projectsData: ProjectItem[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<{
    personalInfo: typeof PERSONAL_INFO;
    educationData: EducationItem[];
    skillsCategories: SkillCategory[];
    experienceData: ExperienceItem[];
    projectsData: ProjectItem[];
  }>({
    personalInfo: PERSONAL_INFO,
    educationData: EDUCATION_DATA,
    skillsCategories: SKILLS_CATEGORIES,
    experienceData: EXPERIENCE_DATA,
    projectsData: PROJECTS_DATA
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) throw new Error('Failed to load portfolio data');
        const json = await res.json();
        
        setData({
          personalInfo: json.personalInfo || PERSONAL_INFO,
          educationData: json.educationData || EDUCATION_DATA,
          skillsCategories: json.skillsCategories || SKILLS_CATEGORIES,
          experienceData: json.experienceData || EXPERIENCE_DATA,
          projectsData: json.projectsData || PROJECTS_DATA
        });
      } catch (err) {
        console.warn('API error: using static fallback portfolio data', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        loading,
        error,
        personalInfo: data.personalInfo,
        educationData: data.educationData,
        skillsCategories: data.skillsCategories,
        experienceData: data.experienceData,
        projectsData: data.projectsData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
