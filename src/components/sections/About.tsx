import React from 'react';
import { motion } from 'framer-motion';

import { services } from '../../constants';
import { SectionWrapper } from '../../hoc';

import { Header } from '../atoms/Header';
import { useSectionContent } from '../../hooks/useSectionContent';

interface IServiceCard {
  index: number;
  title: string;
  icon: string;
}

const ServiceCard: React.FC<IServiceCard> = ({ title, icon }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div className="max-w-[250px] w-full xs:w-[250px]">
      <div className="glass-card w-full rounded-[20px] p-[1px]">
        <div className="bg-transparent flex min-h-[280px] flex-col items-center justify-evenly rounded-[20px] px-12 py-5">
          <div className="relative h-16 w-16">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan"></div>
              </div>
            )}
            <img
              src={icon}
              alt={`${title} service icon`}
              className={`h-16 w-16 object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>

          <h3 className="text-center text-[20px] font-bold text-white">{title}</h3>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const sectionData = useSectionContent('about');

  return (
    <>
      <Header p={sectionData.p} h2={sectionData.h2} />

      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <p className="text-secondary text-[17px] leading-[30px] text-justify">
          {sectionData.content}
        </p>
      </motion.div>

      <div className="mt-20 flex flex-wrap gap-10 max-sm:justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, 'about');
