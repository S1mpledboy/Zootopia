import React from 'react';
import UserInfo from "@/app/Payment/user-info"; 
import Banerek from "@/app/Cart/cart-info"; 
// 👇 Importujemy komponent etapów z folderu Cart
import Etapy from "@/app/Cart/Steps"; 

export default function PaymentPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 👇 Komponent etapów ustawiony na górze strony z wartością 2 👇 */}
      <Etapy currentStep={2} />

      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: '24px', margin: '20px 0' }}>
          Strona Płatności Zootopia
        </h1>
      </div>

      {/* Formularz pobierający dane z MongoDB */}
      <UserInfo />

      {/* Niebieski banerek */}
      <Banerek />

    </main>
  );
}