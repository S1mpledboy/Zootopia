"use client";

import React from 'react';
import Image from "next/image";
import styles from './steps.module.css';


import checkIcon from "@/app/Public/Images/tabler-icon-check.svg"; 

interface EtapyProps {
  currentStep: number; 
}

const stepsData = [
  { id: 1, label: 'Twój koszyk', defaultClass: styles.twjKoszyk },
  { id: 2, label: 'Dane i wysyłka', defaultClass: styles.daneIWysyka },
  { id: 3, label: 'Potwierdzenie', defaultClass: styles.potwierdzenie }
];

const Etapy: React.FC<EtapyProps> = ({ currentStep }) => {
  return (
    <div className={styles.etapy}>
      <div className={styles.frameParent}>
        {stepsData.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

   
          let circleClass = styles.container;
          if (isActive) circleClass = styles.wrapper; 
          if (isCompleted) circleClass = styles.tablerIconCheckWrapper;


          const labelClass = `${step.defaultClass} ${isActive ? styles.activeLabel : ''}`;

          return (
            <React.Fragment key={step.id}>

              <div className={index === 0 ? styles.frameGroup : index === 1 ? styles.frameContainer : styles.frameDiv}>
                <div className={circleClass}>

                  {isCompleted ? (
                    <Image 
                      className={styles.tablerIconCheck} 
                      src={checkIcon} 
                      width={32} 
                      height={32} 
                      alt="Ukończono" 
                    />
                  ) : (
                    <div className={styles.div}>{step.id}</div>
                  )}
                </div>
                <div className={labelClass}>{step.label}</div>
              </div>


              {index < stepsData.length - 1 && (
                <div className={`${styles.frameChild} ${step.id < currentStep ? styles.completedLine : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Etapy;