"use client";

import type { NextPage } from 'next';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './delivery.module.css';

import circleIcon from "@/app/Public/Images/Ellipse6.svg"; 
import checkedCircleIcon from "@/app/Public/Images/Ellipse7.svg"; 

// Interfejs odpowiadający strukturze Twojej bazy danych i populacji pól
interface CartItemFromServer {
  _id: string;
  quantity: number;
  product: { 
    _id: string; 
    name: string; 
    price: number; 
    promoPrice?: number | null; 
  };
}

const WyborDostawyIPlatnosci: NextPage = () => {
  const [deliveryMethod, setDeliveryMethod] = useState<string>('paczkomat'); 
  const [paymentMethod, setPaymentMethod] = useState<string>('odbior');     
  
  // 🔥 STANY DLA DANYCH Z BAZY
  const [cartItems, setCartItems] = useState<CartItemFromServer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Funkcja pobierająca koszyk zalogowanego użytkownika
  const fetchCartData = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/cart', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error("Błąd podczas pobierania kwoty koszyka:", err);
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchCartData(); 
  }, [fetchCartData]);

  // 🔥 DYNAMICZNE OBLICZANIE SUMY CZĘŚCIOWEJ NA PODSTAWIE REKORDÓW Z BAZY
  const basePrice = cartItems.reduce((total, item) => {
    if (!item.product) return total;
    // Sprawdzamy czy produkt ma aktywną promocję
    const finalPrice = item.product.promoPrice !== undefined && item.product.promoPrice !== null
      ? item.product.promoPrice
      : item.product.price;
    return total + (finalPrice * item.quantity);
  }, 0);

  const getDeliveryCost = () => {
    switch (deliveryMethod) {
      case 'inpost': return 9.99;
      case 'dhl': return 11.99;
      case 'paczkomat': return 0.00;
      default: return 0.00;
    }
  };

  const getAdditionalCost = () => {
    return paymentMethod === 'odbior' ? 5.99 : 0.00;
  };

  // Całkowita suma (Suma z bazy + koszty dostawy + koszty płatności)
  const totalSum = basePrice + getDeliveryCost() + getAdditionalCost();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', { 
      style: 'currency', 
      currency: 'PLN' 
    }).format(value);
  };

  if (isLoading) {
    return <div className={styles.produktyWKoszyku} style={{textAlign: 'center'}}>Obliczanie kwoty zamówienia...</div>;
  }

  return (
    <div className={styles.frameParent}>
      <div className={styles.produktyWKoszykuParent}>
        
        {/* METODY DOSTAWY */}
        <div className={styles.produktyWKoszyku}>
          <div className={styles.metodyDostawyParent}>
            <div className={styles.metodyDostawy}>Metody dostawy:</div>
            <div className={styles.lineDivider} />
          </div>
          
          <div className={styles.frameGroup}>
            <div className={styles.frameContainer}>
              
              <div className={styles.frameDiv} onClick={() => setDeliveryMethod('inpost')}>
                <div className={styles.ellipseParent}>
                  <Image src={deliveryMethod === 'inpost' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'inpost' ? styles.boldText : ''}`}>
                    Kurier Inpost
                  </div>
                </div>
                <div className={`${styles.od999Z} ${deliveryMethod === 'inpost' ? styles.boldText : ''}`}>9,99 zł</div>
              </div>

              <div className={styles.frameDiv} onClick={() => setDeliveryMethod('dhl')}>
                <div className={styles.ellipseParent}>
                  <Image src={deliveryMethod === 'dhl' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'dhl' ? styles.boldText : ''}`}>
                    Kurier DHL
                  </div>
                </div>
                <div className={`${styles.od999Z} ${deliveryMethod === 'dhl' ? styles.boldText : ''}`}>11,99 zł</div>
              </div>

              <div className={styles.frameDiv} onClick={() => setDeliveryMethod('paczkomat')}>
                <div className={styles.ellipseParent}>
                  <Image src={deliveryMethod === 'paczkomat' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'paczkomat' ? styles.boldText : ''}`}>
                    Paczkomat Inpost
                  </div>
                </div>
                <div className={`${styles.od999Z} ${deliveryMethod === 'paczkomat' ? styles.boldText : ''}`}>Darmowe</div>
              </div>

            </div>

            {deliveryMethod === 'paczkomat' && (
              <div className={styles.wybierzPunktOdbioruWrapper}>
                <div className={styles.wybierzPunktOdbioru}>Wybierz punkt odbioru</div>
              </div>
            )}
          </div>
        </div>

        {/* METODY PŁATNOŚCI */}
        <div className={styles.produktyWKoszyku}>
          <div className={styles.metodyDostawyParent}>
            <div className={styles.metodyDostawy}>Metody płatności:</div>
            <div className={styles.lineDivider} />
          </div>
          
          <div className={styles.produktyWKoszykuInner}>
            <div className={styles.frameContainer}>
              
              <div className={styles.frameDiv} onClick={() => setPaymentMethod('blik')}>
                <div className={styles.ellipseParent}>
                  <Image src={paymentMethod === 'blik' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'blik' ? styles.boldText : ''}`}>
                    Blik
                  </div>
                </div>
                <div className={`${styles.od999Z} ${paymentMethod === 'blik' ? styles.boldText : ''}`}>Darmowe</div>
              </div>

              <div className={styles.frameDiv} onClick={() => setPaymentMethod('p24')}>
                <div className={styles.ellipseParent}>
                  <Image src={paymentMethod === 'p24' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'p24' ? styles.boldText : ''}`}>
                    Przelewy 24h
                  </div>
                </div>
                <div className={`${styles.od999Z} ${paymentMethod === 'p24' ? styles.boldText : ''}`}>Darmowe</div>
              </div>

              <div className={styles.frameDiv} onClick={() => setPaymentMethod('odbior')}>
                <div className={styles.ellipseParent}>
                  <Image src={paymentMethod === 'odbior' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'odbior' ? styles.boldText : ''}`}>
                    Przy odbiorze
                  </div>
                </div>
                <div className={`${styles.od999Z} ${paymentMethod === 'odbior' ? styles.boldText : ''}`}>5,99 zł</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* PODSUMOWANIE ZAMÓWIENIA */}
      <div className={styles.frameParent8}>
        <div className={styles.metodyDostawyParent}>
          <div className={styles.metodyDostawy}>Podsumowanie:</div>
          <div className={styles.lineDivider} />
        </div>
        
        <div className={styles.frameParent9}>
          <div className={styles.frameDivSummary}>
            <div className={styles.kurierInpost}>Suma częściowa:</div>
            {/* Wyświetla zsumowaną kwotę produktów z bazy */}
            <div className={styles.kurierInpost}>{formatCurrency(basePrice)}</div>
          </div>
          <div className={styles.frameDivSummary}>
            <div className={styles.kurierInpost}>Dostawa:</div>
            <div className={styles.kurierInpost}>
              {getDeliveryCost() === 0 ? 'darmowa' : formatCurrency(getDeliveryCost())}
            </div>
          </div>
          <div className={styles.frameDivSummary}>
            <div className={styles.kurierInpost}>Dodatkowe opłaty:</div>
            <div className={styles.kurierInpost}>
              {getAdditionalCost() === 0 ? 'brak' : formatCurrency(getAdditionalCost())}
            </div>
          </div>
        </div>
        
        <div className={styles.metodyDostawyParentTotal}>
          <div className={styles.lineDivider} />
          <div className={styles.frameDivSummaryTotal}>
            <div className={styles.cakowitaSumaZContainer}>
              <span className={styles.cakowitaSuma}>Całkowita suma</span>
              <span className={styles.zVat}> z VAT</span>
            </div>
            <div className={styles.totalAmountBig}>{formatCurrency(totalSum)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WyborDostawyIPlatnosci;