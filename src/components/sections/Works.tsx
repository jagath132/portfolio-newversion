import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../../hoc';
import { useFirestore } from '../../hooks/useFirestore';
import { config } from '../../constants/config';
import { Header } from '../atoms/Header';
import { TProject } from '../../types';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const ProjectCard = React.memo<{ index: number; onSelect: () => void } & TProject>(
  ({ index, name, description, tags, image, sourceCodeLink, onSelect }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <motion.div
          onClick={onSelect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group cursor-pointer"
          whileHover={{ x: 8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Number Badge */}
          <motion.div
            className="absolute -left-8 top-0 text-7xl font-bold text-accent-cyan/10 group-hover:text-accent-cyan/20 transition-colors duration-300"
            animate={{ opacity: isHovered ? 0.4 : 0.2 }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.div>

          {/* Main Card Container */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* Image Section */}
            <motion.div className="relative h-[280px] overflow-hidden rounded-2xl">
              <motion.img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Dark Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"
                animate={{ opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
              />

              {/* Tech Stack Badges on Image */}
              <motion.div
                className="absolute top-4 left-4 flex gap-2 flex-wrap"
                animate={{ opacity: isHovered ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
              >
                {tags.slice(0, 2).map(tag => (
                  <span
                    key={tag.name}
                    className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-accent-cyan to-purple-500 text-black rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </motion.div>

              {/* Action Icons */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center gap-6"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {sourceCodeLink && (
                  <motion.a
                    href={sourceCodeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent-cyan/90 hover:bg-accent-cyan p-4 rounded-full text-black transition-all backdrop-blur-sm"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <Github size={24} />
                  </motion.a>
                )}
                <motion.button
                  className="bg-purple-500/90 hover:bg-purple-500 p-4 rounded-full text-white transition-all backdrop-blur-sm"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={e => {
                    e.stopPropagation();
                    onSelect();
                  }}
                >
                  <ExternalLink size={24} />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              className="p-6 bg-gradient-to-b from-white/8 to-white/3 backdrop-blur-sm border border-white/10"
              animate={{
                backgroundColor: isHovered
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(255, 255, 255, 0.05)',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3
                className="text-2xl font-bold text-white mb-2 flex items-center gap-2"
                animate={{
                  color: isHovered ? '#00f2ea' : '#ffffff',
                }}
                transition={{ duration: 0.3 }}
              >
                <span>{name}</span>
                <motion.span animate={{ x: isHovered ? 4 : 0 }} transition={{ duration: 0.3 }}>
                  <ArrowRight size={20} />
                </motion.span>
              </motion.h3>

              <p className="text-sm text-secondary/80 line-clamp-2 mb-4">{description}</p>

              {/* Tag Grid */}
              <motion.div
                className="flex flex-wrap gap-2"
                animate={{ opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
              >
                {tags.map(tag => (
                  <span
                    key={tag.name}
                    className={`text-xs font-medium px-2 py-1 rounded-md ${tag.color} bg-white/5 border border-white/10`}
                  >
                    {tag.name}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Hover Border Glow */}
          <motion.div
            className="absolute -inset-1 rounded-2xl border border-accent-cyan/50 opacity-0 pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0,
              boxShadow: isHovered
                ? '0 0 20px rgba(0, 242, 234, 0.3)'
                : '0 0 0px rgba(0, 242, 234, 0)',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    );
  }
);

const Projects = () => {
  const { getAll, loading } = useFirestore('projects');
  const [projects, setProjects] = useState<TProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAll();
      setProjects(data as unknown as TProject[]);
    };
    fetchProjects();
  }, [getAll]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  if (loading) return <div className="text-white text-center">Loading Projects...</div>;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Header {...config.sections.works} />
      </motion.div>

      {/* Description */}
      <motion.div
        className="mt-8 max-w-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <p className="text-[17px] leading-[30px] text-secondary">{config.sections.works.content}</p>
      </motion.div>

      {/* Projects Grid - 2 Column Layout */}
      <motion.div
        className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            onSelect={() => setSelectedProject(selectedProject === index ? null : index)}
            {...project}
          />
        ))}
      </motion.div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject !== null && projects[selectedProject] && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setSelectedProject(null);
              document.body.style.overflow = 'auto';
              document.querySelector('nav')?.classList.remove('hidden');
            }}
            onAnimationComplete={() => {
              if (selectedProject !== null) {
                document.body.style.overflow = 'hidden';
                document.querySelector('nav')?.classList.add('hidden');
              }
            }}
          >
            <motion.div
              className="relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl p-12 max-w-5xl w-full border border-white/30 backdrop-blur-2xl shadow-2xl shadow-accent-cyan/40 my-12"
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedProject(null)}
                className="absolute top-8 right-8 text-white/60 hover:text-accent-cyan transition-colors z-10 p-3 hover:bg-white/10 rounded-full"
                whileHover={{ scale: 1.2, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-3xl font-light">✕</span>
              </motion.button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Section */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl shadow-xl shadow-accent-cyan/30"
                  layoutId={`modal-image-${selectedProject}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative h-[450px]">
                    <img
                      src={projects[selectedProject].image}
                      alt={projects[selectedProject].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                  className="flex flex-col justify-between space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {/* Title & Description */}
                  <div>
                    <motion.h2
                      className="text-5xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {projects[selectedProject].name}
                    </motion.h2>
                    <motion.p
                      className="text-secondary/90 text-lg leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      {projects[selectedProject].description}
                    </motion.p>
                  </div>

                  {/* Technologies */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-sm font-bold text-accent-cyan/80 mb-4 uppercase tracking-widest">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {projects[selectedProject].tags.map((tag, idx) => (
                        <motion.span
                          key={tag.name}
                          className={`px-4 py-2 rounded-lg font-medium ${tag.color} bg-white/10 border border-white/20 text-sm`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.35 + idx * 0.05 }}
                          whileHover={{ scale: 1.08, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                        >
                          {tag.name}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.a
                    href={projects[selectedProject].sourceCodeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-cyan via-purple-500 to-accent-pink hover:shadow-2xl hover:shadow-accent-cyan/60 text-white/90 px-8 py-4 rounded-xl font-bold transition-all border border-accent-cyan/40 group text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={24} className="group-hover:rotate-12 transition-transform" />
                    <span>View on GitHub</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SectionWrapper(Projects, 'projects');
