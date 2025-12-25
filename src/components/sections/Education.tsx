import { styles } from '../../constants/styles';
import { SectionWrapper } from '../../hoc';
import { Header } from '../atoms/Header';
import { config } from '../../constants/config';
import { TEducation } from '../../types';
import { useFirestore } from '../../hooks/useFirestore';
import { useState } from 'react';

const EducationCard: React.FC<{ index: number } & TEducation> = ({
  degree,
  institution,
  year,
  description,
}) => (
  <div className="glass-card xs:w-[320px] w-full rounded-3xl p-10">
    <div className="mt-1">
      <h3 className="text-[24px] font-bold text-white">{degree}</h3>
      <p className="text-secondary mt-2 text-[16px] font-semibold">{institution}</p>
      <p className="text-secondary mt-1 text-[14px]">{year}</p>
      {description && <p className="text-white mt-4 text-[14px] leading-[24px]">{description}</p>}
    </div>
  </div>
);

const Education = () => {
  const { useRealtime, loading } = useFirestore('education');
  const [educations, setEducations] = useState<TEducation[]>([]);

  useRealtime(data => {
    setEducations(data as unknown as TEducation[]);
  });

  if (loading) return null;

  return (
    <div className="mt-12 rounded-[20px]">
      <div className={`${styles.padding} glass-card min-h-[300px] rounded-2xl`}>
        <Header {...config.sections.education} />
      </div>
      <div className={`${styles.paddingX} -mt-20 flex flex-wrap gap-7 pb-14 max-sm:justify-center`}>
        {educations.map((education, index) => (
          <EducationCard key={education.degree || index} index={index} {...education} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Education, 'education');
