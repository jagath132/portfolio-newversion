import type { TNavLink, TService, TTechnology, TExperience, TProject, TEducation } from '../types';

import {
  mobile,
  backend,
  creator,
  web,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  // tripguide,
  css,
  figma,
  git,
  html,
  javascript,
  mongodb,
  nodejs,
  reactjs,
  redux,
  tailwind,
  typescript,
  threejs,
} from '../assets';

export const navLinks: TNavLink[] = [
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'education',
    title: 'Education',
  },
  {
    id: 'skills',
    title: 'Skills',
  },
  {
    id: 'experience',
    title: 'Experience',
  },
  {
    id: 'projects',
    title: 'Projects',
  },
  {
    id: 'contact',
    title: 'Contact',
  },
];

const services: TService[] = [
  {
    title: 'Turning Data into Decisions',
    icon: web,
  },
  {
    title: 'Driving Business Clarity',
    icon: mobile,
  },
  {
    title: 'Analyst — Translating Data to Value',
    icon: backend,
  },
  {
    title: 'Automation & Workflow Optimization',
    icon: creator,
  },
];

const technologies: TTechnology[] = [
  {
    name: 'SQL',
    icon: html,
  },
  {
    name: 'Python',
    icon: javascript,
  },
  {
    name: 'Power BI',
    icon: css,
  },
  {
    name: 'Excel',
    icon: typescript,
  },
  {
    name: 'Power Apps',
    icon: reactjs,
  },
  {
    name: 'n8n',
    icon: redux,
  },
  {
    name: 'Selenium',
    icon: tailwind,
  },
  {
    name: 'Java',
    icon: nodejs,
  },
  {
    name: 'Git',
    icon: git,
  },
  {
    name: 'Tableau',
    icon: figma,
  },
  {
    name: 'MySQL',
    icon: mongodb,
  },
  {
    name: 'MongoDB',
    icon: threejs,
  },
];

const experiences: TExperience[] = [
  {
    title: 'SOC Operations Intern',
    companyName: 'L&T Technology Services',
    icon: starbucks,
    iconBg: '#383E56',
    date: 'Jul 2024 – Aug 2024',
    points: [
      'Gained a comprehensive understanding of Security Operations Center (SOC) functions and workflows.',
      'Studied common types of cyber threats and how incidents are prioritized.',
      'Acquired foundational knowledge of Security Information and Event Management (SIEM) concepts and their role in threat detection.',
      'Learned about common cyber threats, attack vectors, and methods of incident prioritization.',
      'Learned how log data is analyzed and correlated to identify potential threats.',
    ],
  },
  {
    title: 'Data Analyst Intern',
    companyName: 'Intelizign',
    icon: tesla,
    iconBg: '#E6DEDD',
    date: 'Jan 2025 – Mar 2025 ',
    points: [
      'Collaborated with the Data Analytics team to understand organizational workflows and data analysis processes. ',
      'Collaborated with the data analytics team to understand data processes and workflows. ',
      'Developed a dashboard to track cybersecurity incidents from various sources such as endpoints, networks, cloud, web, and antivirus systems.',
      'Created visual reports to support better monitoring and security analysis..',
    ],
  },
  {
    title: 'Automation Testing Intern',
    companyName: 'fastack.ai',
    icon: shopify,
    iconBg: '#383E56',
    date: 'Jun 2025 - Aug 2025',
    points: [
      'Contributed to LucaGPT, an AI-powered accounting assistant for Tally Prime users.',
      'Gained knowledge of Designing and automation test scripts using Selenium with Java to validate core workflows and feature functionality.',
      'Performed functional, regression, and UI testing to ensure product reliability across releases.',
      'Documented and managed test cases, test data, and bug reports systematically using Excel.',
      'Collaborated with developers and QA teams to identify, reproduce, and resolve defects efficiently',
    ],
  },
  {
    title: 'Process Optimization Intern',
    companyName: 'House of Accountants ',
    icon: meta,
    iconBg: '#E6DEDD',
    date: 'Aug 2025 – Oct 2025',
    points: [
      'Developed and automating accounting workflows using n8n, integrating multi-source financial data to reduce manual processing.',
      'Acquired hands-on experience in workflow automation, API integration, and process optimization within a finance-focused environment.',
    ],
  },
];

const educations: TEducation[] = [
  {
    name: 'Bachelor of Science in Computer Science',
    degree: 'BSc Computer Science',
    institution: 'Chennai National Arts & Science College',
    year: '2020-2023',
    // description: '',
  },
  {
    name: 'Master of Science in Computer Science',
    degree: 'MSc Computer Science',
    institution: 'The New College',
    year: '2023-2025',
    // description: '',
  },
];

const projects: TProject[] = [
  {
    name: 'Car Rent',
    description:
      'Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'mongodb',
        color: 'green-text-gradient',
      },
      {
        name: 'tailwind',
        color: 'pink-text-gradient',
      },
    ],
    image: carrent,
    sourceCodeLink: 'https://github.com/',
  },
  {
    name: 'Job IT',
    description:
      'Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'restapi',
        color: 'green-text-gradient',
      },
      {
        name: 'scss',
        color: 'pink-text-gradient',
      },
    ],
    image: jobit,
    sourceCodeLink: 'https://github.com/',
  },
  // {
  //   name: 'Trip Guide',
  //   description:
  //     'A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.',
  //   tags: [
  //     {
  //       name: 'nextjs',
  //       color: 'blue-text-gradient',
  //     },
  //     {
  //       name: 'supabase',
  //       color: 'green-text-gradient',
  //     },
  //     {
  //       name: 'css',
  //       color: 'pink-text-gradient',
  //     },
  //   ],
  //   image: tripguide,
  //   sourceCodeLink: 'https://github.com/',
  // },
];

export { services, technologies, experiences, projects, educations };
