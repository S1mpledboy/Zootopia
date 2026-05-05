"use client";
import type { NextPage } from 'next';
import { useCallback } from 'react';
import styles from './shoppingcart.module.css';
import { AuthInput } from './AuthInput';
import Category from "@/app/category";
const ProduktyWKoszyku: NextPage = () => {
  const onLoginSubmit = useCallback(() => {
    console.log("Logowanie...");
  }, []);

  const onRegisterSubmit = useCallback(() => {
    console.log("Rejestracja...");
  }, []);

  return (
<div className={styles.container}> {/* Nowy kontener nadrzędny */}
      
      {/* Kategorie na samej górze, poza zielonym tłem */}
      <div className={styles.categoryHeader}>
        <Category />
      </div>

      {/* Dopiero tutaj zaczyna się sekcja z formularzami */}
      <div className={styles.produktyWKoszyku}>
         <div className={styles.frameParent}>
        
        {/* SEKCJA: LOGOWANIE */}
        <div className={styles.frameWrapper}>
          <div className={styles.zalogujSiParent}>
            <div className={styles.zalogujSi}>Zaloguj się</div>
            <div className={styles.frameGroup}>
              <div className={styles.frameContainer}>
                <AuthInput label="E-mail" type="email" />
                <AuthInput label="Hasło" type="password" isPassword />
              </div>
              
              <div className={styles.frameParent2}>
                <div className={styles.rectangleParent}>
                  <input type="checkbox" className={styles.frameChild} />
                  <div className={styles.zapamitajMnie}>Zapamiętaj mnie</div>
                </div>
                <div className={styles.zapamitajMnie} style={{ cursor: 'pointer' }}>
                  Nie pamiętam hasła
                </div>
              </div>
            </div>
            
            <button className={styles.doKasy} onClick={onLoginSubmit}>
              <div className={styles.zalogujSi2}>ZALOGUJ SIĘ</div>
            </button>
          </div>
        </div>

        {/* SEKCJA: SEPARATOR */}
        <div className={styles.lineParent}>
          <div className={styles.frameItem} />
          <b className={styles.lub}>lub</b>
          <div className={styles.frameItem} />
        </div>

        {/* SEKCJA: REJESTRACJA */}
        <div className={styles.frameWrapper2}>
          <div className={styles.zalogujSiParent}>
            <div className={styles.zalogujSi}>Zarejestruj się</div>
            <div className={styles.frameWrapper3}>
              <div className={styles.frameContainer}>
                <AuthInput label="E-mail" type="email" />
                <AuthInput label="Hasło" type="password" isPassword />
              </div>
            </div>
            
            <button className={styles.doKasy2} onClick={onRegisterSubmit}>
              <div className={styles.zalogujSi2}>ZAREJESTRUJ SIĘ</div>
            </button>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default ProduktyWKoszyku;