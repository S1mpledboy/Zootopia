import React from 'react';
import Image from 'next/image';
import styles from './zamowienia.module.css';
import arrowRed from '@/app/Public/Images/arrowRed.svg';

// Definiujemy interfejs dopasowany do zserializowanych danych z MongoDB
interface DbOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingMethod: string;
  paymentMethod: string;
  invoiceData?: {
    companyName?: string;
    nip?: string;
  };
  createdAt: string;
}

interface OrderCardProps {
  order: DbOrder;
  onOpenDetails: () => void;
}

const ZamowienieKarta: React.FC<OrderCardProps> = ({ order, onOpenDetails }) => {
  // 1. Mapowanie surowego statusu z bazy na odpowiednią klasę CSS
  const getStatusWrapperClass = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case 'COMPLETED':
      case 'UKOŃCZONE': 
        return styles.ukoczoneWrapper;
      case 'IN_PROGRESS':
      case 'W TRAKCIE': 
        return styles.wTrakcieWrapper;
      case 'CANCELLED':
      case 'ANULOWANE': 
        return styles.anulowaneWrapper;
      case 'SHIPPED':
      case 'WYSŁANE': 
        return styles.wysaneWrapper;
      default: 
        return styles.wTrakcieWrapper;
    }
  };

  // 2. Mapowanie surowego statusu z bazy na polski tekst wyświetlany użytkownikowi
  const getStatusLabel = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case 'COMPLETED':
      case 'UKOŃCZONE': 
        return 'ukończone';
      case 'IN_PROGRESS':
      case 'W TRAKCIE': 
        return 'w trakcie';
      case 'CANCELLED':
      case 'ANULOWANE': 
        return 'anulowane';
      case 'SHIPPED':
      case 'WYSŁANE': 
        return 'wysłane';
      default: 
        return status; // Zwraca oryginalny status, jeśli nie pasuje do żadnego wzorca
    }
  };

  // Dynamiczne generowanie informacji o fakturze/paragonie
  const invoiceNumber = order.invoiceData?.nip 
    ? `FV/${order.orderNumber.replace("ZOOTOPIA-", "")}` 
    : "Brak (Paragon)";

  return (
    <div className={styles.frameGroup}>
      <div className={styles.zarzdzanieZamwieniamiParent}>
        <b className={styles.zamwienieNr1111}>zamówienie nr {order.orderNumber}</b>
        {/* Przekazujemy status do funkcji wybierającej klasę CSS */}
        <div className={getStatusWrapperClass(order.status)}>
          {/* Wyświetlamy przetłumaczony tekst statusu */}
          <b className={styles.wszystkie}>{getStatusLabel(order.status)}</b>
        </div>
      </div>
      <div className={styles.frameWrapper}>
        <div className={styles.zarzdzanieZamwieniamiParent}>
          <div className={styles.frameDiv}>
            <div className={styles.dataZamwieniaParent}>
              <b className={styles.wszystkie}>data zamówienia</b>
              <b className={styles.z}>{order.createdAt}</b>
            </div>
            <div className={styles.dataZamwieniaParent}>
              <b className={styles.wszystkie}>Koszt całkowity</b>
              <b className={styles.z}>{order.totalAmount.toFixed(2)} ZŁ</b>
            </div>
            <div className={styles.dataZamwieniaParent}>
              <b className={styles.wszystkie}>numer faktury</b>
              <b className={styles.z}>{invoiceNumber}</b>
            </div>
          </div>
          
          <div className={styles.szczegyParent} onClick={onOpenDetails} style={{ cursor: 'pointer' }}>
            <b className={styles.wszystkie}>SZCZEGÓŁY </b>
            <Image src={arrowRed} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="Szczegóły" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZamowienieKarta;