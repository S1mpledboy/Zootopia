import React from 'react';
import UserInfo from "@/app/Payment/user-info"; 
import Banerek from "@/app/Cart/cart-info"; 
import Etapy from "@/app/Cart/Steps"; 

import WyborDostawyIPlatnosci from "@/app/Payment/delivery"; 

export default function PaymentPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      

      <Etapy currentStep={2} />



      <UserInfo />


      <WyborDostawyIPlatnosci />


      <Banerek />

    </main>
  );
}