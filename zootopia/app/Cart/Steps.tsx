import React from 'react';
import styles from './steps.module.css';

// Definiujemy strukturę propsów – komponent potrzebuje znać obecny krok (1, 2 lub 3)
interface EtapyProps {
  currentStep: number;
}

const stepsData = [
  { id: 1, label: 'Twój koszyk' },
  { id: 2, label: 'Dane i wysyłka' },
  { id: 3, label: 'Potwierdzenie' }
];

const Etapy: React.FC<EtapyProps> = ({ currentStep }) => {
  return (
    <div className={styles.etapy}>
      <div className={styles.frameParent}>
        {stepsData.map((step, index) => {
          // Logika określająca stan danego kroku
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          // Dynamiczny dobór klasy dla kółka z numerem
          const circleClass = `${styles.circle} ${
            isActive ? styles.activeCircle : isCompleted ? styles.completedCircle : styles.upcomingCircle
          }`;

          // Dynamiczny dobór klasy dla tekstu pod kółkiem
          const labelClass = `${styles.label} ${isActive ? styles.activeLabel : ''}`;

          return (
            <React.Fragment key={step.id}>
              {/* Blok pojedynczego etapu */}
              <div className={styles.stepBlock}>
                <div className={circleClass}>
                  <div className={styles.div}>{step.id}</div>
                </div>
                <div className={labelClass}>{step.label}</div>
              </div>

              {/* Linia łącząca – nie renderujemy jej po ostatnim elemencie */}
              {index < stepsData.length - 1 && (
                <div className={`${styles.line} ${isCompleted ? styles.completedLine : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Etapy;