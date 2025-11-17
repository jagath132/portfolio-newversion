import type { TNavLink, TService, TTechnology, TExperience, TProject, TEducation } from '../types';

import {
  mobile,
  backend,
  creator,
  web,
  Fastack,
  HOA,
  intelizign,
  L_T, // FIXED: variable cannot be L&T
  carrent,
  jobit,
  git,
  python,
  sql,
  techGithub,
  uipath,
  powerautomate,
  n8n,
  zohoanalytics,
  powerbi,
  tableau,
  excel,
  mysql,
  zohoqengine,
  selenium,
  powerapps,
  appium,
  quadratic,
} from '../assets';

export const navLinks: TNavLink[] = [
  { id: 'about', title: 'About' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'experience', title: 'Experience' },
  { id: 'projects', title: 'Projects' },
  { id: 'contact', title: 'Contact' },
];

const services: TService[] = [
  { title: 'Turning Data into Decisions', icon: web },
  { title: 'Driving Business Clarity', icon: mobile },
  { title: 'Analyst — Translating Data to Value', icon: backend },
  { title: 'Automation & Workflow Optimization', icon: creator },
];

const skillCategories = [
  {
    title: 'AI & Automation Tools',
    technologies: [
      { name: 'Quadratic.ai', icon: quadratic },
      { name: 'UiPath', icon: uipath },
      { name: 'Power Automate', icon: powerautomate },
      { name: 'N8N', icon: n8n },
    ],
  },
  {
    title: 'Programming Languages',
    technologies: [
      { name: 'Python', icon: python },
      { name: 'SQL', icon: sql },
    ],
  },
  {
    title: 'Data & Analytics Tools',
    technologies: [
      { name: 'Zoho Analytics', icon: zohoanalytics },
      { name: 'Power BI', icon: powerbi },
      { name: 'Tableau', icon: tableau },
      { name: 'Microsoft Excel', icon: excel },
      { name: 'MySQL', icon: mysql },
    ],
  },
  {
    title: 'Testing & Automation Tools',
    technologies: [
      { name: 'Zoho QEngine', icon: zohoqengine },
      { name: 'Selenium WebDriver', icon: selenium },
      { name: 'Power Apps', icon: powerapps },
      { name: 'Appium', icon: appium },
    ],
  },
  {
    title: 'Version Control & Development',
    technologies: [
      { name: 'GitHub', icon: techGithub },
      { name: 'Git', icon: git },
    ],
  },
];

const technologies: TTechnology[] = [
  { name: 'SQL', icon: sql },
  { name: 'Python', icon: python },
  { name: 'Power BI', icon: powerbi },
  { name: 'n8n', icon: n8n },
  { name: 'Git', icon: git },
  { name: 'Tableau', icon: tableau },
];

const experiences: TExperience[] = [
  {
    title: 'SOC Operations Intern',
    companyName: 'L&T Technology Services',
    icon: L_T,
    iconBg: '#383E56',
    date: 'Jul 2024 – Aug 2024',
    points: [
      'Developed a clear understanding of SOC workflows and operations.',
      'Explored common cyber threats, attack vectors, and incident prioritization.',
      'Gained foundational knowledge of SIEM tools and threat detection processes.',
      'Learned how log data is analyzed and correlated for threat identification.',
    ],
  },
  {
    title: 'Data Analyst Intern',
    companyName: 'Intelizign',
    icon: intelizign,
    iconBg: '#E6DEDD',
    date: 'Jan 2025 – Mar 2025',
    points: [
      'Collaborated with the data analytics team to understand internal workflows.',
      'Developed dashboards to track cybersecurity incidents across multiple sources.',
      'Built visual reports for improved security monitoring and insights.',
    ],
  },
  {
    title: 'Automation Testing Intern',
    companyName: 'Fastack.ai',
    icon: Fastack,
    iconBg: '#383E56',
    date: 'Jun 2025 – Aug 2025',
    points: [
      'Contributed to LucaGPT, an AI assistant for Tally Prime users.',
      'Designed and automated test scripts using Selenium with Java.',
      'Performed functional, regression, and UI testing for product stability.',
      'Documented test cases, test data, and structured bug reports.',
      'Worked with QA and development teams to reproduce and resolve defects.',
    ],
  },
  {
    title: 'Process Optimization Intern',
    companyName: 'House of Accountants',
    icon: HOA,
    iconBg: '#E6DEDD',
    date: 'Aug 2025 – Oct 2025',
    points: [
      'Automated financial workflows with n8n, reducing manual processes.',
      'Gained experience with workflow automation, APIs, and process optimization.',
    ],
  },
];

const educations: TEducation[] = [
  {
    name: 'Bachelor of Science in Computer Science',
    degree: 'BSc Computer Science',
    institution: 'Chennai National Arts & Science College',
    year: '2020-2023',
  },
  {
    name: 'Master of Science in Computer Science',
    degree: 'MSc Computer Science',
    institution: 'The New College',
    year: '2023-2025',
  },
];

const projects: TProject[] = [
  {
    name: 'Car Rent',
    description:
      'Web platform for browsing, booking, and managing car rentals from multiple providers.',
    tags: [
      { name: 'react', color: 'blue-text-gradient' },
      { name: 'mongodb', color: 'green-text-gradient' },
      { name: 'tailwind', color: 'pink-text-gradient' },
    ],
    image: carrent,
    sourceCodeLink: 'https://github.com/',
  },
  {
    name: 'Job IT',
    description:
      'Application for searching job openings, viewing salary ranges, and finding roles by location.',
    tags: [
      { name: 'react', color: 'blue-text-gradient' },
      { name: 'restapi', color: 'green-text-gradient' },
      { name: 'scss', color: 'pink-text-gradient' },
    ],
    image: jobit,
    sourceCodeLink: 'https://github.com/',
  },
];

export { services, technologies, skillCategories, experiences, projects, educations };
