"use client";

import React from 'react';
import Image from "next/image";
import styles from './steps.module.css'; // upewnij się, że nazwa pliku CSS się zgadza

// Import ikony ptaszka na samej górze
import checkIcon from "@/app/Public/Images/tabler-icon-check.svg"; 

interface EtapyProps {
  currentStep: number; // Przekazujemy 1, 2 lub 3
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

          // Dobór odpowiedniej klasy dla kółka na podstawie statusu
          let circleClass = styles.container; // domyślny jasny (upcoming)
          if (isActive) circleClass = styles.wrapper; // aktywny ciemnoróżowy
          if (isCompleted) circleClass = styles.tablerIconCheckWrapper; // ukończony jasnoróżowy

          // Dobór klasy dla tekstu (pogrubienie dla aktywnego kroku)
          const labelClass = `${step.defaultClass} ${isActive ? styles.activeLabel : ''}`;

          return (
            <React.Fragment key={step.id}>
              {/* Blok pojedynczego etapu */}
              <div className={index === 0 ? styles.frameGroup : index === 1 ? styles.frameContainer : styles.frameDiv}>
                <div className={circleClass}>
                  {/* 🔥 WARUNEK: Jeśli krok jest wykonany, pokaż ikonę Image, jeśli nie, pokaż numer */}
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

              {/* Linia łącząca etapy – nie pokazuj po ostatnim */}
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