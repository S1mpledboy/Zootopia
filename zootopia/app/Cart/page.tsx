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
    stock: number; // 🔥 DODANE: potrzebne do walidacji
    company: { name: string; };
  };
}

const ProduktyWKoszyku: NextPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemFromServer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // 🔥 NOWE: Lista ID produktów które przekraczają dostępny stock
  const [stockErrors, setStockErrors] = useState<{ productId: string; name: string; available: number; inCart: number }[]>([]);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);

        // 🔥 Po każdym pobraniu koszyka od razu sprawdź stock
        const errors = data
          .filter((item: CartItemFromServer) => item.product && item.quantity > item.product.stock)
          .map((item: CartItemFromServer) => ({
            productId: item.product._id,
            name: item.product.name,
            available: item.product.stock,
            inCart: item.quantity
          }));
        setStockErrors(errors);
      }
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

  const onCheckoutClick = useCallback(async () => {
    if (cartItems.length === 0) return;

    // 🔥 WALIDACJA STOCKU: świeże dane z serwera tuż przed przejściem
    setIsValidating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const freshData: CartItemFromServer[] = await res.json();
        setCartItems(freshData);

        const errors = freshData
          .filter(item => item.product && item.quantity > item.product.stock)
          .map(item => ({
            productId: item.product._id,
            name: item.product.name,
            available: item.product.stock,
            inCart: item.quantity
          }));

        setStockErrors(errors);

        // Jeśli są błędy stocku – blokujemy przejście
        if (errors.length > 0) {
          setIsValidating(false);
          return;
        }
      }
    } catch (err) {
      console.error(err);
      setIsValidating(false);
      return;
    }

    setIsValidating(false);
    router.push('/Payment');
  }, [router, cartItems]);

  if (loading) return <div className={styles.produktyWKoszyku}>Ładowanie koszyka...</div>;

  const isCartEmpty = cartItems.length === 0;
  const hasStockErrors = stockErrors.length > 0;
  const isCheckoutBlocked = isCartEmpty || hasStockErrors;

  return (
    <div className={styles.produktyWKoszyku}>
      <Etapy currentStep={1} />

      {/* 🔥 BANNER Z BŁĘDAMI STOCKU */}
      {hasStockErrors && (
        <div style={{
          backgroundColor: '#fff3f5',
          border: '1px solid #fc5773',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '16px',
        }}>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '600',
            fontSize: '14px',
            color: '#fc5773',
            marginBottom: '8px'
          }}>
            Niektóre produkty nie są dostępne w wybranej ilości:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {stockErrors.map(err => (
              <li key={err.productId} style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                color: '#333',
                marginBottom: '4px'
              }}>
                <strong>{err.name}</strong> – masz {err.inCart} szt., dostępne: {err.available} szt.
              </li>
            ))}
          </ul>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '13px',
            color: '#666',
            marginTop: '8px',
            marginBottom: 0
          }}>
            Zmniejsz ilość tych produktów, aby kontynuować.
          </p>
        </div>
      )}

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
                // 🔥 NOWE: podświetl produkt jeśli ma błąd stocku
                hasStockError={stockErrors.some(e => e.productId === item.product._id)}
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

        <div
          className={`${styles.doKasy} ${isCheckoutBlocked ? styles.doKasyDisabled : ''}`}
          onClick={isCheckoutBlocked ? undefined : onCheckoutClick}
          style={isCheckoutBlocked
            ? { opacity: 0.5, cursor: 'not-allowed' }
            : { cursor: isValidating ? 'wait' : 'pointer' }
          }
        >
          <div className={styles.doKasy2}>
            {isValidating ? 'Sprawdzanie...' : 'Do kasy'}
          </div>
        </div>
      </div>
      <Info />
    </div>
  );
};

export default ProduktyWKoszyku;