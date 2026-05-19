"use client";

import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import Image from "next/image";
import styles from './cart.module.css';
import Property1Koszyk from './product'; 

// 🔥 IMPORT BRAKUJĄCEJ IKONY
import tablerIconChevronCompactLe from "@/app/Public/Images/tabler-icon-chevron-compact-left.svg";

interface CartItemFromServer {
  _id: string;
  quantity: number;
  product: { 
    _id: string; 
    name: string; 
    price: number; 
    images: string[]; 
    company: { name: string; }; 
  };
}

const ProduktyWKoszyku: NextPage = () => {
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

  const totalCartPrice = cartItems.reduce((total, item) => 
    item.product ? total + (item.product.price * item.quantity) : total, 0
  );
  
  const formattedTotal = new Intl.NumberFormat('pl-PL', { 
    style: 'currency', 
    currency: 'PLN' 
  }).format(totalCartPrice);

  const onFrameContainerClick = useCallback(() => {
    // Logika nawigacji (np. powrót do sklepu)
  }, []);

  if (loading) return <div className={styles.produktyWKoszyku}>Ładowanie koszyka...</div>;

  return (
    <div className={styles.produktyWKoszyku}>
      <div className={styles.wszystkieProdukty}>
        {cartItems.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Twój koszyk jest pusty.</div>
        ) : (
          cartItems.map((item) => item.product && (
            <div key={item._id} style={{ display: 'contents' }}>
              <Property1Koszyk
                id={item.product._id}
                name={item.product.name}
                price={item.product.price}
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
        <div className={styles.tablerIconChevronCompactLeParent} onClick={onFrameContainerClick}>
          {/* 🔥 WPIĘCIE ZAIMPORTOWANEJ IKONY W SRC */}
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
        <div className={styles.doKasy} onClick={onFrameContainerClick}>
          <div className={styles.doKasy2}>Do kasy</div>
        </div>
      </div>
    </div>
  );
};

export default ProduktyWKoszyku;