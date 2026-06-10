'use client';

import React from 'react';
import Image from "next/image";
import styles from './zamowienie.module.css';
import listStyles from './zamowienia.module.css';

import xicon from '@/app/Public/Images/Xicon.svg';
import download from '@/app/Public/Images/downloadIcon.svg';
import line from '@/app/Public/Images/line.svg';

interface DbOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface DbOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingMethod: string;
  paymentMethod: string;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
  };
  invoiceData?: {
    companyName?: string;
    nip?: string;
  };
  createdAt: string;
  updatedAt: string;
  items: DbOrderItem[];
}

interface ZamowienieModalProps {
  order: DbOrder;
  onClose: () => void;
}

const ZamowienieModal: React.FC<ZamowienieModalProps> = ({ order, onClose }) => {
  
  // 1. Uniwersalna normalizacja statusu
  const getNormalizedStatus = (status: string): string => {
    if (!status) return 'w trakcie';
    const s = status.toLowerCase().trim();
    
    if (s === 'completed' || s === 'finished' || s === 'ukończone') return 'ukończone';
    if (s === 'in_progress' || s === 'in progress' || s === 'w trakcie') return 'w trakcie';
    if (s === 'shipped' || s === 'wysłane') return 'wysłane';
    if (s === 'cancelled' || s === 'anulowane') return 'anulowane';
    
    return s;
  };

  // 2. Dynamiczny wybór klasy CSS z pliku zamowienia.module.css
  const getStatusWrapperClass = (status: string) => {
    const normalized = getNormalizedStatus(status);
    switch (normalized) {
      case 'ukończone': return listStyles.ukoczoneWrapper;
      case 'w trakcie': return listStyles.wTrakcieWrapper;
      case 'anulowane': return listStyles.anulowaneWrapper;
      case 'wysłane': return listStyles.wysaneWrapper;
      default: return listStyles.wTrakcieWrapper;
    }
  };

  // Wyliczanie kosztów dostawy na podstawie wybranej metody
  const deliveryCost = order.shippingMethod.includes("InPost") ? "0.00 ZŁ" : "15.00 ZŁ";
  
  // Identyfikacja typu klienta i formatowanie imienia/nazwiska
  const customerType = order.invoiceData?.companyName ? "Firma" : "Osoba prywatna";
  const customerName = `${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName}`;
  
  const invoiceNumber = order.invoiceData?.nip 
    ? `FV/${order.orderNumber.replace("ZOOTOPIA-", "")}` 
    : "Brak (Paragon)";

  const displayStatus = getNormalizedStatus(order.status);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.szczegyZamowienia1} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.frameParent}>
          <div className={styles.zamwienieNr1111Parent}>
            <b className={styles.zamwienieNr1111}>zamówienie nr {order.orderNumber}</b>
            {/* Przypisanie poprawnej klasy wrapującej */}
            <div className={getStatusWrapperClass(order.status)}>
              {/* Wyświetlenie jednolitego tekstu statusu */}
              <b className={listStyles.wszystkie}>{displayStatus}</b>
            </div>
          </div>
          <div className={styles.vectorParent}>
            <Image 
              src={xicon} 
              className={styles.vectorIcon} 
              width={16} 
              height={18} 
              sizes="100vw" 
              alt="Zamknij" 
              onClick={onClose} 
              style={{ cursor: 'pointer' }}
            />
            <Image src={download} className={styles.vectorIcon} width={16} height={18} sizes="100vw" alt="Pobierz" />
          </div>
        </div>

        <div className={styles.szczegoweInformacje}>
          <div className={styles.dataZamwieniaParent}>
            <b className={styles.dataZamwienia}>data zamówienia</b>
            <b className={styles.z}>{order.createdAt}</b>
          </div>
          <div className={styles.dataZakoczeniaParent}>
            <b className={styles.dataZamwienia}>data zakończenia</b>
            {/* Wyświetlanie daty modyfikacji tylko dla zamówień sfinalizowanych */}
            <b className={styles.z}>{displayStatus === 'ukończone' ? order.updatedAt : '—'}</b>
          </div>
          <div className={styles.numerFakturyParent}>
            <b className={styles.numerFaktury}>numer faktury</b>
            <b className={styles.z}>{invoiceNumber}</b>
          </div>
          <div className={styles.kosztCakowityParent}>
            <b className={styles.dataZamwienia}>Koszt całkowity</b>
            <b className={styles.z}>{order.totalAmount.toFixed(2)} ZŁ</b>
          </div>
          <div className={styles.kosztDostawyParent}>
            <b className={styles.dataZamwienia}>Koszt dostawy</b>
            <b className={styles.z}>{deliveryCost}</b>
          </div>
          <div className={styles.osobaPrywatnaParent}>
            <b className={styles.dataZamwienia}>{customerType}</b>
            <b className={styles.z}>{customerName}</b>
          </div>
          <div className={styles.adresParent}>
            <b className={styles.adres}>Adres</b>
            <b className={styles.dataZamwienia}>{order.deliveryAddress.street}</b>
            <div className={styles.parent}>
              <b className={styles.ukoczone}>{order.deliveryAddress.postalCode}</b>
              <b className={styles.ukoczone}>{order.deliveryAddress.city}</b>
            </div>
          </div>
          <div className={styles.sposbDostawyParent}>
            <b className={styles.dataZamwienia}>sposób dostawy</b>
            <b className={styles.z}>{order.shippingMethod}</b>
          </div>
          <div className={styles.firmaParent}>
            <b className={styles.dataZamwienia}>firma</b>
            <b className={styles.z}>{order.invoiceData?.companyName || "—"}</b>
          </div>
          <div className={styles.nipParent}>
            <b className={styles.dataZamwienia}>nip</b>
            <b className={styles.z}>{order.invoiceData?.nip || "—"}</b>
          </div>
          <div className={styles.sposbPatnociParent}>
            <b className={styles.dataZamwienia}>sposób płatności</b>
            <b className={styles.z}>{order.paymentMethod}</b>
          </div>
        </div>

        <div className={styles.zamwienieParent}>
          <b className={styles.zamwienie}>zamówienie:</b>
          
          {order.items.map((item, idx) => (
            <div key={item.productId || idx} className={styles.frameGroup}>
              <div className={styles.frameWrapper}>
                <div className={styles.frameContainer}>
                  <div className={styles.alphawolfParent}>
                    <div className={styles.alphawolf}>Produkt</div>
                    <div className={styles.alphawolf15kgSucha}>{item.name}</div>
                  </div>
                  <div className={styles.x2}>x {item.quantity}</div>
                  <div className={styles.z2}>{item.price.toFixed(2)} ZŁ</div>
                </div>
              </div>
              <Image src={line} className={styles.frameChild} alt="" />
            </div>
          ))}
        </div>
        
        <div className={styles.text} />
      </div>
    </div>
  );
};

export default ZamowienieModal;