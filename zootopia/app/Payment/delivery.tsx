"use client";

import type { NextPage } from 'next';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 🔥 1. DODANY IMPORT
import styles from './delivery.module.css';

import circleIcon from "@/app/Public/Images/Ellipse6.svg"; 
import checkedCircleIcon from "@/app/Public/Images/Ellipse7.svg"; 

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
  const router = useRouter(); // 🔥 2. INICJALIZACJA ROUTERA
  
  const [deliveryMethod, setDeliveryMethod] = useState<string>('paczkomat'); 
  const [paymentMethod, setPaymentMethod] = useState<string>('blik');     
  const [cartItems, setCartItems] = useState<CartItemFromServer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const basePrice = cartItems.reduce((total, item) => {
    if (!item.product) return total;
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

  const totalSum = basePrice + getDeliveryCost() + getAdditionalCost();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Twój koszyk jest pusty!");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Musisz być zalogowany, aby złożyć zamówienie.");
      return;
    }

    setIsSubmitting(true);

    try {
      const customerData = await new Promise<any>((resolve) => {
        const responder = (e: any) => {
          window.removeEventListener("responsePaymentFormData", responder);
          resolve(e.detail);
        };
        window.addEventListener("responsePaymentFormData", responder);
        window.dispatchEvent(new Event("requestPaymentFormData"));
      });

      const { formData, showInvoice, showOtherAddress } = customerData;

      const deliveryNames: Record<string, string> = { paczkomat: "Paczkomat InPost", inpost: "Kurier InPost", dhl: "Kurier DHL" };
      const paymentNames: Record<string, string> = { blik: "BLIK", p24: "Przelewy24", odbior: "Przy odbiorze" };

      const orderData = {
        cartItems: cartItems.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.promoPrice ?? item.product.price,
          quantity: item.quantity
        })),
        deliveryAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
          email: formData.email
        },
        shippingMethod: deliveryNames[deliveryMethod],
        paymentMethod: paymentNames[paymentMethod],
        invoiceData: showInvoice ? { companyName: formData.companyName, nip: formData.nip } : undefined,
        alternativeShippingAddress: showOtherAddress ? {
          country: formData.shippingCountry,
          street: formData.shippingStreet,
          city: formData.shippingCity,
          postalCode: formData.shippingPostalCode
        } : undefined,
        notes: formData.notes,
        totalAmount: totalSum
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // 🔥 3. TUTAJ WKLEJAMY PRZEJŚCIE DO NOWEJ STRONY
        // Przekierowujemy pod adres folderu Twojej nowej strony sukcesu (np. /order-success)
        // i przekazujemy wygenerowany przez bazę numer zamówienia jako parametr 'number'
        router.push(`/Order-success?number=${result.orderNumber}`);
      } else {
        alert(`Błąd składania zamówienia: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas finalizacji zamówienia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.produktyWKoszyku} style={{textAlign: 'center'}}>Obliczanie kwoty zamówienia...</div>;
  }

  return (
    <div className={styles.frameParent}>
      <div className={styles.produktyWKoszykuParent}>
        
        {/* DOSTAWA */}
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
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'inpost' ? styles.boldText : ''}`}>Kurier Inpost</div>
                </div>
                <div className={`${styles.od999Z} ${deliveryMethod === 'inpost' ? styles.boldText : ''}`}>9,99 zł</div>
              </div>

              <div className={styles.frameDiv} onClick={() => setDeliveryMethod('dhl')}>
                <div className={styles.ellipseParent}>
                  <Image src={deliveryMethod === 'dhl' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'dhl' ? styles.boldText : ''}`}>Kurier DHL</div>
                </div>
                <div className={`${styles.od999Z} ${deliveryMethod === 'dhl' ? styles.boldText : ''}`}>11,99 zł</div>
              </div>

              <div className={styles.frameDiv} onClick={() => setDeliveryMethod('paczkomat')}>
                <div className={styles.ellipseParent}>
                  <Image src={deliveryMethod === 'paczkomat' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'paczkomat' ? styles.boldText : ''}`}>Paczkomat Inpost</div>
                </div>
                <div className={`${styles.od999Z} ${deliveryMethod === 'paczkomat' ? styles.boldText : ''}`}>Darmowe</div>
              </div>
            </div>
          </div>
        </div>

        {/* PŁATNOŚCI */}
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
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'blik' ? styles.boldText : ''}`}>Blik</div>
                </div>
                <div className={`${styles.od999Z} ${paymentMethod === 'blik' ? styles.boldText : ''}`}>Darmowe</div>
              </div>

              <div className={styles.frameDiv} onClick={() => setPaymentMethod('p24')}>
                <div className={styles.ellipseParent}>
                  <Image src={paymentMethod === 'p24' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'p24' ? styles.boldText : ''}`}>Przelewy 24h</div>
                </div>
                <div className={`${styles.od999Z} ${paymentMethod === 'p24' ? styles.boldText : ''}`}>Darmowe</div>
              </div>

              <div className={styles.frameDiv} onClick={() => setPaymentMethod('odbior')}>
                <div className={styles.ellipseParent}>
                  <Image src={paymentMethod === 'odbior' ? checkedCircleIcon : circleIcon} width={18} height={18} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'odbior' ? styles.boldText : ''}`}>Przy odbiorze</div>
                </div>
                <div className={`${styles.od999Z} ${paymentMethod === 'odbior' ? styles.boldText : ''}`}>5,99 zł</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PODSUMOWANIE */}
      <div className={styles.frameParent8}>
        <div className={styles.metodyDostawyParent}>
          <div className={styles.metodyDostawy}>Podsumowanie:</div>
          <div className={styles.lineDivider} />
        </div>
        
        <div className={styles.frameParent9}>
          <div className={styles.frameDivSummary}>
            <div className={styles.kurierInpost}>Suma częściowa:</div>
            <div className={styles.kurierInpost}>{formatCurrency(basePrice)}</div>
          </div>
          <div className={styles.frameDivSummary}>
            <div className={styles.kurierInpost}>Dostawa:</div>
            <div className={styles.kurierInpost}>{getDeliveryCost() === 0 ? 'darmowa' : formatCurrency(getDeliveryCost())}</div>
          </div>
          <div className={styles.frameDivSummary}>
            <div className={styles.kurierInpost}>Dodatkowe opłaty:</div>
            <div className={styles.kurierInpost}>{getAdditionalCost() === 0 ? 'brak' : formatCurrency(getAdditionalCost())}</div>
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

        <button 
          onClick={handlePlaceOrder} 
          disabled={isSubmitting}
          style={{
            width: '100%',
            backgroundColor: '#fc5773',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: 'Poppins, sans-serif',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            marginTop: '20px',
            transition: 'background-color 0.2s'
          }}
        >
          {isSubmitting ? "Przetwarzanie..." : "Kupuję i płacę"}
        </button>

      </div>
    </div>
  );
};

export default WyborDostawyIPlatnosci;