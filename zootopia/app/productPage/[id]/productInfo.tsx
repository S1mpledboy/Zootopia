'use client';
import { useState } from 'react';
import Image from "next/image";
import styles from './productInfo.module.css';

import chevronIcon from "@/app/Public/Images/tabler-icon-chevron.svg";

interface AccordionProps {
  title: string;
  content: React.ReactNode;
}

const Accordion = ({ title, content }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`${styles.accordion} ${!isOpen ? styles.collapsed : ''}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={styles.opisParent}>
        <div className={styles.opis}>{title}</div>
        <Image 
          className={`${styles.tablerIconChevronCompactRi} ${isOpen ? styles.rotate : ''}`} 
          src={chevronIcon} // Używamy zaimportowanej zmiennej
          alt="arrow" 
          width={24} 
          height={24} 
        />
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.text}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Accordion;