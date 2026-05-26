"use client";

import type { NextPage } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import styles from './index.module.css';

// Importowanie ikon
import circleIcon from "@/app/Public/Images/Ellipse6.svg"; 
import checkedCircleIcon from "@/app/Public/Images/Ellipse7.svg"; 

const WyborDostawyIPlatnosci: NextPage = () => {
  const [deliveryMethod, setDeliveryMethod] = useState<string>('paczkomat'); 
  const [paymentMethod, setPaymentMethod] = useState<string>('odbior');     

  const basePrice = 478.00;

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
              
              {/* Kurier Inpost */}
              <div 
                className={`${styles.frameDiv} ${deliveryMethod === 'inpost' ? styles.activeOption : ''}`}
                onClick={() => setDeliveryMethod('inpost')}
              >
                <div className={styles.ellipseParent}>
                  <Image src={deliveryMethod === 'inpost' ? checkedCircleIcon : circleIcon} width={20} height={20} alt="wybór" />
                  {/* 👇 Pogrubianie tekstu warunkiem (klasa lub tag 'b') */}
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'inpost' ? styles.boldText : ''}`}>
                    Kurier Inpost
                  </div>
                </div>
                <div className={styles.od999Z}>9,99 zł</div>
              </div>

              {/* Kurier DHL */}
              <div 
                className={`${styles.frameDiv} ${deliveryMethod === 'dhl' ? styles.activeOption : ''}`}
                onClick={() => setDeliveryMethod('dhl')}
              >
                <div className={styles.ellipseParent}>
                  <Image src={deliveryMethod === 'dhl' ? checkedCircleIcon : circleIcon} width={20} height={20} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'dhl' ? styles.boldText : ''}`}>
                    Kurier DHL
                  </div>
                </div>
                <div className={styles.od999Z}>11,99 zł</div>
              </div>

              {/* Paczkomat Inpost */}
              <div 
                className={`${styles.frameDiv} ${deliveryMethod === 'paczkomat' ? styles.activeOption : ''}`}
                onClick={() => setDeliveryMethod('paczkomat')}
              >
                <div className={styles.ellipseParent}>
                  <Image src={deliveryMethod === 'paczkomat' ? checkedCircleIcon : circleIcon} width={20} height={20} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${deliveryMethod === 'paczkomat' ? styles.boldText : ''}`}>
                    Paczkomat Inpost
                  </div>
                </div>
                <div className={styles.od999Z}>Darmowe</div>
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
              
              {/* Blik */}
              <div 
                className={`${styles.frameDiv} ${paymentMethod === 'blik' ? styles.activeOption : ''}`}
                onClick={() => setPaymentMethod('blik')}
              >
                <div className={styles.ellipseParent}>
                  <Image src={paymentMethod === 'blik' ? checkedCircleIcon : circleIcon} width={20} height={20} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'blik' ? styles.boldText : ''}`}>
                    Blik
                  </div>
                </div>
                <div className={styles.od999Z}>Darmowe</div>
              </div>

              {/* Przelewy 24h */}
              <div 
                className={`${styles.frameDiv} ${paymentMethod === 'p24' ? styles.activeOption : ''}`}
                onClick={() => setPaymentMethod('p24')}
              >
                <div className={styles.ellipseParent}>
                  <Image src={paymentMethod === 'p24' ? checkedCircleIcon : circleIcon} width={20} height={20} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'p24' ? styles.boldText : ''}`}>
                    Przelewy 24h
                  </div>
                </div>
                <div className={styles.od999Z}>Darmowe</div>
              </div>

              {/* Przy odbiorze */}
              <div 
                className={`${styles.frameDiv} ${paymentMethod === 'odbior' ? styles.activeOption : ''}`}
                onClick={() => setPaymentMethod('odbior')}
              >
                <div className={styles.ellipseParent}>
                  <Image src={paymentMethod === 'odbior' ? checkedCircleIcon : circleIcon} width={20} height={20} alt="wybór" />
                  <div className={`${styles.kurierInpost} ${paymentMethod === 'odbior' ? styles.boldText : ''}`}>
                    Przy odbiorze
                  </div>
                </div>
                <div className={styles.od999Z}>5,99 zł</div>
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
            <div className={styles.metodyDostawy}>{formatCurrency(totalSum)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WyborDostawyIPlatnosci;