import React from 'react';
import UserInfo from "@/app/Payment/user-info"; 
import Banerek from "@/app/Cart/cart-info"; 
import Etapy from "@/app/Cart/Steps"; 
// 👇 Importujemy nową sekcję wyboru dostawy i płatności
import WyborDostawyIPlatnosci from "@/app/Payment/delivery"; 

export default function PaymentPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Etapy na samej górze */}
      <Etapy currentStep={2} />


      {/* 1. Formularz adresowy z MongoDB */}
      <UserInfo />

      {/* 2. 👇 NOWOŚĆ: Sekcja wyboru dostaw, płatności i wyliczenia sumy częściowej */}
      <WyborDostawyIPlatnosci />

      {/* 3. Niebieski banerek na samym dole */}
      <Banerek />

    </main>
  );
}