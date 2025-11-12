import React from "react";
import { motion } from "framer-motion";

import { SectionWrapper } from "../../hoc";
import { technologies } from "../../constants";
import { fadeIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";

interface SkillCardProps {
  name: string;
  icon: string;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ name, icon, index }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.1, 0.75)}
    className="flex flex-col items-center justify-center gap-3 rounded-xl bg-tertiary p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
  >
    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-emerald-400 to-purple-600 p-3 shadow-md">
      <img src={icon} alt={name} className="h-full w-full object-contain" />
    </div>
    <p className="text-center text-[14px] font-semibold text-white">{name}</p>
  </motion.div>
);

const Tech = () => {
  return (
    <>
      <Header useMotion={true} {...config.sections.skills} />

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="text-secondary mt-4 text-[17px] leading-[30px] text-justify"
      >
        Here are the key technologies and tools I work with to deliver data-driven solutions and automate business processes.
      </motion.p>

      <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {technologies.map((technology, index) => (
          <SkillCard
            key={technology.name}
            name={technology.name}
            icon={technology.icon}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");
