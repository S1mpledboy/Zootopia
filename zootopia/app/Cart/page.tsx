"use client";

import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Image from "next/image";
import styles from './cart.module.css';
import Property1Koszyk from './product'; 
import Etapy from './Steps'; 
import Info from './cart-info';
import tablerIconChevronCompactLe from "@/app/Public/Images/tabler-icon-chevron-compact-left.svg";

interface CartItemFromServer {
  _id: string;
  quantity: number;
  product: { 
    _id: string; 
    name: string; 
    price: number; 
    promoPrice?: number | null; 
    images: any[]; 
    company: { name: string; }; 
  };
}

const ProduktyWKoszyku: NextPage = () => {
  const router = useRouter(); 
  const [cartItems, setCartItems] = useState<CartItemFromServer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/cart', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) setCartItems(await res.json());
    } catch (err) {
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchCart(); 
  }, [fetchCart]);

  const totalCartPrice = cartItems.reduce((total, item) => {
    if (!item.product) return total;
    const finalPrice = item.product.promoPrice !== undefined && item.product.promoPrice !== null
      ? item.product.promoPrice
      : item.product.price;
    return total + (finalPrice * item.quantity);
  }, 0);
  
  const formattedTotal = new Intl.NumberFormat('pl-PL', { 
    style: 'currency', 
    currency: 'PLN' 
  }).format(totalCartPrice);

  const onContinueShoppingClick = useCallback(() => {
    router.push('/');
  }, [router]);

  // 👇 ZMIANA: Blokada przejścia, jeśli koszyk jest pusty
  const onCheckoutClick = useCallback(() => {
    if (cartItems.length === 0) {
      return; // Przerywa funkcję i nie pozwala przejść dalej
    }
    router.push('/Payment'); 
  }, [router, cartItems]); // Dodano cartItems do tablicy zależności

  if (loading) return <div className={styles.produktyWKoszyku}>Ładowanie koszyka...</div>;

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className={styles.produktyWKoszyku}>
      <Etapy currentStep={1} />

      <div className={styles.wszystkieProdukty}>
        {isCartEmpty ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Twój koszyk jest pusty.</div>
        ) : (
          cartItems.map((item) => item.product && (
            <div key={item._id} style={{ display: 'contents' }}>
              <Property1Koszyk
                id={item.product._id}
                name={item.product.name}
                price={item.product.price}
                promoPrice={item.product.promoPrice} 
                companyName={item.product.company?.name || "Nieznana marka"}
                images={item.product.images}
                quantity={item.quantity}
                onCartChanged={fetchCart}
              />
              <div className={styles.wszystkieProduktyChild} />
            </div>
          ))
        )}
        <div className={styles.razemParent}>
          <div className={styles.z}>Razem:</div>
          <div className={styles.z}>{formattedTotal}</div>
        </div>
      </div>
      
      <div className={styles.frameParent7}>
        <div className={styles.tablerIconChevronCompactLeParent} onClick={onContinueShoppingClick}>
          <Image 
            className={styles.tablerIconChevronCompactLe} 
            src={tablerIconChevronCompactLe} 
            width={32} 
            height={32} 
            sizes="100vw" 
            alt="Powrót" 
          />
          <div className={styles.kontynuujZakupy}>Kontynuuj zakupy</div>
        </div>
        
        {/* 👇 ZMIANA: Dynamiczna klasa (opcjonalnie dla CSS) oraz blokada onClick */}
        <div 
          className={`${styles.doKasy} ${isCartEmpty ? styles.doKasyDisabled : ''}`} 
          onClick={onCheckoutClick}
          style={isCartEmpty ? { opacity: 0.5, cursor: 'not-allowed' } : {}} // Szybki styl inline, jeśli nie chcesz zmieniać CSS
        >
          <div className={styles.doKasy2}>Do kasy</div>
        </div>
      </div>
      <Info />
    </div>
  );
};

export default ProduktyWKoszyku;