type TSection = {
  p: string;
  h2: string;
  content?: string;
};

type TConfig = {
  html: {
    title: string;
    fullName: string;
    email: string;
  };
  hero: {
    name: string;
    p: string[];
  };
  contact: {
    form: {
      name: {
        span: string;
        placeholder: string;
      };
      email: {
        span: string;
        placeholder: string;
      };
      message: {
        span: string;
        placeholder: string;
      };
    };
  } & TSection;
  sections: {
    about: Required<TSection>;
    skills: TSection;
    experience: TSection;
    education: TSection;
    works: Required<TSection>;
  };
};

export const config: TConfig = {
  html: {
    title: 'Portfolio',
    fullName: 'Jagath R',
    email: 'jagathrnganathan@gmail.com',
  },
  hero: {
    name: 'Jagath R',
    p: ['Data Analyst', 'Automation Enthusiast'],
  },
  contact: {
    p: 'Get in touch',
    h2: 'Contact.',
    form: {
      name: {
        span: 'Your Name',
        placeholder: "What's your name?",
      },
      email: { span: 'Your Email', placeholder: "What's your email?" },
      message: {
        span: 'Your Message',
        placeholder: 'What do you want to say?',
      },
    },
  },
  sections: {
    about: {
      p: 'Introduction',
      h2: 'Overview.',
      content: `Data Analytical and detail-driven Data Analyst skilled in SQL, Python, Power BI, and process automation tools such as Power Apps and n8n. Experienced in transforming raw data into
        strategic insights and developing interactive dashboards to support business and cybersecurity operations.Strong foundation in data integration, workflow automation, and testing across diverse environments.
        Proven ability to streamline processes, enhance decision-making, and bridge technical solutions with business objectives.`,
    },
    skills: {
      p: 'My technical skills',
      h2: 'Skills.',
      content: `My technical expertise is built on a foundation of diverse technologies, spanning from core programming languages and data analytics to cutting-edge AI automation. I focus on selecting the right tools to build efficient, scalable solutions that bridge the gap between complex data and actionable insights.`,
    },
    experience: {
      p: 'What I have done so far',
      h2: 'Work Experience.',
      content: `Throughout my career, I've built a strong foundation in data analysis, automation, and software development. From implementing complex data pipelines to developing user-friendly dashboards and automating business processes, I've consistently delivered solutions that drive efficiency and informed decision-making. My experience spans across various industries, working with cutting-edge technologies to solve real-world challenges.`,
    },
    education: {
      p: 'My education',
      h2: 'Education.',
    },
    works: {
      p: 'My work',
      h2: 'Projects.',
      content: `These projects represent my journey in solving real-world challenges through data-driven approaches and innovative automation. Each work demonstrates my commitment to excellence, showing how I leverage various technologies to build impactful tools, streamline workflows, and deliver meaningful results.`,
    },
  },
};
