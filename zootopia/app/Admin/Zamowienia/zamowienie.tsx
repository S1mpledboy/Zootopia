import React from 'react';
import Image from "next/image";
import styles from './zamowienie.module.css';
import listStyles from './zamowienia.module.css'; // Importujemy style z głównej listy zamówień
import { Order } from './testOrders';

import xicon from '@/app/Public/Images/Xicon.svg';
import download from '@/app/Public/Images/downloadIcon.svg';
import line from '@/app/Public/Images/line.svg';

interface ZamowienieModalProps {
  order: Order;
  onClose: () => void;
}

const ZamowienieModal: React.FC<ZamowienieModalProps> = ({ order, onClose }) => {
  // Pobieramy odpowiednią klasę ramki z pliku ZAMÓWIENIA (listStyles)
  const getStatusWrapperClass = (status: Order['status']) => {
    switch (status) {
      case 'ukończone': return listStyles.ukoczoneWrapper;
      case 'w trakcie': return listStyles.wTrakcieWrapper;
      case 'anulowane': return listStyles.anulowaneWrapper;
      case 'wysłane': return listStyles.wysaneWrapper;
      default: return listStyles.ukoczoneWrapper;
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.szczegyZamowienia1} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.frameParent}>
          <div className={styles.zamwienieNr1111Parent}>
            <b className={styles.zamwienieNr1111}>zamówienie nr {order.orderNumber}</b>
            
            {/* Tutaj aplikujemy dynamiczną ramkę oraz klasę tekstową z głównej listy */}
            <div className={getStatusWrapperClass(order.status)}>
              <b className={listStyles.wszystkie}>{order.status}</b>
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
            <b className={styles.z}>{order.date}</b>
          </div>
          <div className={styles.dataZakoczeniaParent}>
            <b className={styles.dataZamwienia}>data zakończenia</b>
            <b className={styles.z}>{order.endDate}</b>
          </div>
          <div className={styles.numerFakturyParent}>
            <b className={styles.numerFaktury}>numer faktury</b>
            <b className={styles.z}>{order.invoiceNumber}</b>
          </div>
          <div className={styles.kosztCakowityParent}>
            <b className={styles.dataZamwienia}>Koszt całkowity</b>
            <b className={styles.z}>{order.totalCost} ZŁ</b>
          </div>
          <div className={styles.kosztDostawyParent}>
            <b className={styles.dataZamwienia}>Koszt dostawy</b>
            <b className={styles.z}>{order.deliveryCost}</b>
          </div>
          <div className={styles.osobaPrywatnaParent}>
            <b className={styles.dataZamwienia}>{order.customerType}</b>
            <b className={styles.z}>{order.customerName}</b>
          </div>
          <div className={styles.adresParent}>
            <b className={styles.adres}>Adres</b>
            <b className={styles.dataZamwienia}>{order.address}</b>
            <div className={styles.parent}>
              <b className={styles.ukoczone}>{order.zipCode}</b>
              <b className={styles.ukoczone}>{order.city}</b>
            </div>
          </div>
          <div className={styles.sposbDostawyParent}>
            <b className={styles.dataZamwienia}>sposób dostawy</b>
            <b className={styles.z}>{order.deliveryMethod}</b>
          </div>
          <div className={styles.firmaParent}>
            <b className={styles.dataZamwienia}>firma</b>
            <b className={styles.z}>{order.companyName}</b>
          </div>
          <div className={styles.nipParent}>
            <b className={styles.dataZamwienia}>nip</b>
            <b className={styles.z}>{order.nip}</b>
          </div>
          <div className={styles.sposbPatnociParent}>
            <b className={styles.dataZamwienia}>sposób płatności</b>
            <b className={styles.z}>{order.paymentMethod}</b>
          </div>
        </div>

        <div className={styles.zamwienieParent}>
          <b className={styles.zamwienie}>zamówienie:</b>
          
          {order.items.map((item) => (
            <div key={item.id} className={styles.frameGroup}>
              <div className={styles.frameWrapper}>
                <div className={styles.frameContainer}>
                  <div className={styles.alphawolfParent}>
                    <div className={styles.alphawolf}>{item.brand}</div>
                    <div className={styles.alphawolf15kgSucha}>{item.name}</div>
                  </div>
                  <div className={styles.x2}>x {item.quantity}</div>
                  <div className={styles.z2}>{item.price}</div>
                </div>
              </div>
              <Image src={line} className={styles.frameChild} width={570} height={1} sizes="100vw" alt="" />
            </div>
          ))}
        </div>
        
        <div className={styles.text} />
      </div>
    </div>
  );
};

export default ZamowienieModal;