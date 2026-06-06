import React from 'react';
import Image from 'next/image';
import { Order } from './testOrders';
import styles from './zamowienia.module.css';
import arrowRed from '@/app/Public/Images/arrowRed.svg';

interface OrderCardProps {
  order: Order;
  onOpenDetails: () => void; // Nowy prop przekazany z rodzica
}

const ZamowienieKarta: React.FC<OrderCardProps> = ({ order, onOpenDetails }) => {
  const getStatusWrapperClass = (status: Order['status']) => {
    switch (status) {
      case 'ukończone': return styles.ukoczoneWrapper;
      case 'w trakcie': return styles.wTrakcieWrapper;
      case 'anulowane': return styles.anulowaneWrapper;
      case 'wysłane': return styles.wysaneWrapper;
      default: return styles.ukoczoneWrapper;
    }
  };

  return (
    <div className={styles.frameGroup}>
      <div className={styles.zarzdzanieZamwieniamiParent}>
        <b className={styles.zamwienieNr1111}>zamówienie nr {order.orderNumber}</b>
        <div className={getStatusWrapperClass(order.status)}>
          <b className={styles.wszystkie}>{order.status}</b>
        </div>
      </div>
      <div className={styles.frameWrapper}>
        <div className={styles.zarzdzanieZamwieniamiParent}>
          <div className={styles.frameDiv}>
            <div className={styles.dataZamwieniaParent}>
              <b className={styles.wszystkie}>data zamówienia</b>
              <b className={styles.z}>{order.date}</b>
            </div>
            <div className={styles.dataZamwieniaParent}>
              <b className={styles.wszystkie}>Koszt całkowity</b>
              <b className={styles.z}>{order.totalCost} ZŁ</b>
            </div>
            <div className={styles.dataZamwieniaParent}>
              <b className={styles.wszystkie}>numer faktury</b>
              <b className={styles.z}>{order.invoiceNumber}</b>
            </div>
          </div>
          {/* Wywołanie otwarcia szczegółów */}
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