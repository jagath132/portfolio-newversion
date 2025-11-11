import { motion } from 'framer-motion';

import { styles } from '../../constants/styles';
import { fadeIn } from '../../utils/motion';
import { SectionWrapper } from '../../hoc';
import { educations } from '../../constants';
import { Header } from '../atoms/Header';
import { config } from '../../constants/config';
import { TEducation } from '../../types';

const EducationCard: React.FC<{ index: number } & TEducation> = ({
  index,
  degree,
  institution,
  year,
  description,
}) => (
  <motion.div
    variants={fadeIn('up', 'spring', index * 0.5, 0.75)}
    className="bg-black-200 xs:w-[320px] w-full rounded-3xl p-10"
  >
    <div className="mt-1">
      <h3 className="text-[24px] font-bold text-white">{degree}</h3>
      <p className="text-secondary mt-2 text-[16px] font-semibold">{institution}</p>
      <p className="text-secondary mt-1 text-[14px]">{year}</p>
      {description && <p className="text-white mt-4 text-[14px] leading-[24px]">{description}</p>}
    </div>
  </motion.div>
);

const Education = () => {
  return (
    <div className="bg-black-100 mt-12 rounded-[20px]">
      <div className={`${styles.padding} bg-tertiary min-h-[300px] rounded-2xl`}>
        <Header useMotion={true} {...config.sections.education} />
      </div>
      <div className={`${styles.paddingX} -mt-20 flex flex-wrap gap-7 pb-14 max-sm:justify-center`}>
        {educations.map((education, index) => (
          <EducationCard key={education.name} index={index} {...education} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Education, 'education');
