"use client";

import type { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from './success.module.css';


import StepsProgressBar from "@/app/Cart/Steps"; 
import FooterFeaturesBar from "@/app/Cart/cart-info"; 

const SuccessContent = () => {
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get('number') || '1111';

  return (
    <>

      <StepsProgressBar currentStep={3} />


      <div className={styles.produktyWKoszyku}>
        

        <div className={styles.twojeZamwienieZostao}>
          Twoje zamówienie zostało przyjęte do realizacji.
        </div>


        <div className={styles.frameParent}>
          

          <div className={styles.numerTwojegoZamwieniaToParent}>
            <div className={styles.numerTwojegoZamwienia}>
              Numer Twojego zamówienia to:
            </div>
            <div className={styles.div}>
              {orderNumber}
            </div>
          </div>


          <div className={styles.potwierdzenieZamwieniaWraz}>
            Potwierdzenie zamówienia wraz z jego podsumowaniem wysłaliśmy właśnie na Twój adres e-mail.
          </div>

        </div>


        <div className={styles.dzikujemyZaZakupy}>
          Dziękujemy za zakupy w naszym sklepie.
        </div>

      </div>

      <FooterFeaturesBar />
    </>
  );
};

const ProduktyWKoszykuPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Ładowanie potwierdzenia zamówienia...</div>}>
      <SuccessContent />
    </Suspense>
  );
};

export default ProduktyWKoszykuPage;