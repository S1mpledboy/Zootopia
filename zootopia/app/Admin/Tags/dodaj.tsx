'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './dodaj.module.css'; 
import add from '@/app/Public/Images/+icon.svg';

interface ModalProps {
  isOpen: boolean;
  title: string;
  initialValue?: string;
  buttonLabel?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export default function DodawanieModal({ 
  isOpen, 
  title, 
  initialValue = '', 
  buttonLabel = 'DODAJ', 
  onClose, 
  onConfirm 
}: ModalProps) {
  const [inputValue, setInputValue] = useState(initialValue);

  // Synchronizacja wartości, gdy modal otwiera się do edycji
  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim() !== '') {
      onConfirm(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dodawanieCaejKategorii} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dodajKategoriParent}>
          <div className={styles.dodajKategori}>{title}</div>
          
          <div className={styles.frameParent}>
            <div className={styles.karmyWrapper}>
              <input 
                type="text"
                className={styles.karmyInput} 
                placeholder="Wpisz nazwę..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              />
            </div>
            <div className={styles.doKasy} onClick={handleConfirm}>
              <div className={styles.vectorParent}>
                {buttonLabel === 'DODAJ' && <Image src={add} className={styles.vectorIcon} width={14} height={14} alt="" />}
                <div className={styles.dodaj}>{buttonLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}