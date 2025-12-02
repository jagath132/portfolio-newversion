import React from "react";

import { styles } from "../../constants/styles";

interface IHeader {
  p: string;
  h2: string;
}

export const Header: React.FC<IHeader> = ({ p, h2 }) => {
  return (
    <>
      <p className={styles.sectionSubText}>{p}</p>
      <h2 className={styles.sectionHeadText}>{h2}</h2>
    </>
  );
};
