"use client";

import type { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from './success.module.css';

// 🔥 1. IMPORT TWOICH GLOBALNYCH KOMPONENTÓW
// Podmień ścieżki '@/components/...' na prawdziwe ścieżki w Twoim projekcie!
import StepsProgressBar from "@/app/Cart/Steps"; 
import FooterFeaturesBar from "@/app/Cart/cart-info"; 

const SuccessContent = () => {
  const searchParams = useSearchParams();
  // Pobieramy prawdziwy numer zamówienia z adresu URL. Jeśli brak, wstawia 1111
  const orderNumber = searchParams.get('number') || '1111';

  return (
    <>
      {/* GÓRNY PASEK POSTĘPU (Krok 3 aktywny) */}
      <StepsProgressBar currentStep={3} />

      {/* ŚRODKOWA SEKCJA Z TWOJEGO PROJEKTU */}
      <div className={styles.produktyWKoszyku}>
        
        {/* Główny nagłówek (Duży tekst 45px) */}
        <div className={styles.twojeZamwienieZostao}>
          Twoje zamówienie zostało przyjęte do realizacji.
        </div>

        {/* Środkowy blok z informacjami o zamówieniu */}
        <div className={styles.frameParent}>
          
          {/* Kontener trzymający tekst i numer w jednej linii */}
          <div className={styles.numerTwojegoZamwieniaToParent}>
            <div className={styles.numerTwojegoZamwienia}>
              Numer Twojego zamówienia to:
            </div>
            <div className={styles.div}>
              {orderNumber}
            </div>
          </div>

          {/* Informacja o wysyłce maila */}
          <div className={styles.potwierdzenieZamwieniaWraz}>
            Potwierdzenie zamówienia wraz z jego podsumowaniem wysłaliśmy właśnie na Twój adres e-mail.
          </div>

        </div>

        {/* Podziękowanie na dole sekcji (Tekst 29px) */}
        <div className={styles.dzikujemyZaZakupy}>
          Dziękujemy za zakupy w naszym sklepie.
        </div>

      </div>

      {/* DOLNY BANER Z CECHAMI SKLEPU (Płatności, Zwroty, Dostawa) */}
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