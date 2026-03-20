import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionWrapper } from '../../hoc';
import { useFirestore } from '../../hooks/useFirestore';
import { config } from '../../constants/config';
import { Header } from '../atoms/Header';
import { TProject } from '../../types';
import { ExternalLink, Github } from 'lucide-react';

const ProjectCard = ({
  project,
  index,
  total,
}: {
  project: TProject;
  index: number;
  total: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // We track the scroll progress while this container sits at the top of the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Sophisticated stacking physics
  // As we scroll down, scale shrinks slightly, opacity fades, and it angles back
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.1]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const { name, description, tags, image, sourceCodeLink, demoLink } = project;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Dynamic border glow logic based on index
  const borderColors = [
    'border-accent-cyan/40 shadow-accent-cyan/10',
    'border-purple-500/40 shadow-purple-500/10',
    'border-accent-pink/40 shadow-accent-pink/10',
    'border-green-500/40 shadow-green-500/10',
  ];
  const activeColor = borderColors[index % borderColors.length];

  return (
    <div
      ref={containerRef}
      className="h-[100vh] flex items-center justify-center sticky top-0 perspective-[1500px]"
    >
      <motion.div
        style={{
          scale,
          opacity,
          y: translateY,
          top: `calc(10vh + ${index * 15}px)`, // Adjusts stack offset
        }}
        className={`w-full max-w-[1200px] mx-auto rounded-[30px] md:rounded-[40px] overflow-hidden bg-[#0d0d14] border ${activeColor} shadow-[0_-10px_60px_rgba(0,0,0,0.6)] flex flex-col md:flex-row h-[85vh] md:h-[75vh] origin-top relative`}
      >
        {/* Left Content Area (Text) */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative overflow-hidden order-2 md:order-1 h-3/5 md:h-full">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col items-start h-full">
            {/* Index Tracker */}
            <div className="text-xl md:text-2xl font-mono text-white/40 mb-6 flex items-center gap-4">
              <span className="w-12 h-px bg-white/20" />
              <span>0{index + 1}</span>
              <span className="text-sm">/ 0{total}</span>
            </div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              {name}
            </h3>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={`text-xs md:text-sm tracking-wider font-bold px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md ${
                    tag.color || 'text-white'
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <p className="text-secondary text-base lg:text-lg leading-relaxed mb-auto line-clamp-4 max-w-lg">
              {description}
            </p>

            {/* Call to Actions (Buttons) */}
            <div className="flex flex-wrap gap-4 mt-8 w-full md:w-auto">
              {sourceCodeLink && (
                <a
                  href={sourceCodeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none group relative px-8 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
                >
                  <Github
                    size={22}
                    className="text-white group-hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-white text-sm md:text-base">Code</span>
                </a>
              )}
              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan via-purple-500 to-accent-pink flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] transition-shadow border border-white/10"
                >
                  <ExternalLink
                    size={22}
                    className="text-white group-hover:scale-110 group-hover:rotate-12 transition-transform"
                  />
                  <span className="font-bold text-white text-sm md:text-base tracking-wide">
                    Live Demo
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Content Area (Image) */}
        <div className="w-full md:w-1/2 relative h-2/5 md:h-full bg-black overflow-hidden group order-1 md:order-2">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d14]">
              <div className="w-10 h-10 border-2 border-white/20 border-t-accent-cyan rounded-full animate-spin" />
            </div>
          )}
          <img
            src={image}
            alt={`${name} preview screenshot`}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.33,1,0.68,1)] transform ${
              imageLoaded ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-0 scale-110'
            }`}
          />
          {/* Overlay fade linking text area with image smoothly */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0d0d14] via-[#0d0d14]/40 to-transparent pointer-events-none" />
          
          {/* Vignette on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};

const Works = () => {
  const { useRealtime, loading } = useFirestore('projects');
  const [projects, setProjects] = useState<TProject[]>([]);

  useRealtime(data => {
    setProjects(data as unknown as TProject[]);
  });

  if (loading)
    return (
      <div className="text-white text-center py-20 min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
        <p className="text-2xl font-light text-secondary">Summoning Projects...</p>
      </div>
    );

  return (
    <div className="relative z-10 w-full">
      <div className="pb-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <Header {...config.sections.works} />

          <div className="mt-8 max-w-4xl">
            <p className="text-secondary text-lg leading-relaxed text-justify rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-accent-cyan px-6 py-5">
              {config.sections.works.content}
            </p>
          </div>
        </motion.div>
      </div>

      {/* 
        The Stack Container 
        By adding margin-top, it distances the first card from the header.
        The bottom padding ensures the user can scroll fully past the last card before stopping.
      */}
      <div className="relative mt-10 w-full mb-[20vh]">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.name || index}
            project={project}
            index={index}
            total={projects.length}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Works, 'projects');
