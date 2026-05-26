import React from 'react';
// 👇 Poprawny import Twojego komponentu z folderu payment
import UserInfo from "@/app/Payment/user-info"; 
import Banerek from "@/app/Cart/cart-info"; // dopasuj ścieżkę do swojego baneru

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Górna część strony głównej */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Strona Główna Zootopia</h1>
      </div>

      {/* 👇 Tutaj renderuje się Twój formularz z danymi z bazy 👇 */}
      <UserInfo />

      {/* 👇 Niebieski banerek, który idealnie złączy się ze stopką 👇 */}
      <Banerek />

    </main>
  );
}
