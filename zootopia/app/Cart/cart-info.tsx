import type { NextPage } from 'next';
import Image from "next/image";
import styles from './info.module.css';

// 🔥 Importowanie ikon na górze kodu
import walletIcon from "@/app/Public/Images/tabler-icon-wallet.svg";
import packageImportIcon from "@/app/Public/Images/tabler-icon-package-import.svg";
import truckDeliveryIcon from "@/app/Public/Images/tabler-icon-truck-delivery.svg";
import rosetteDiscountIcon from "@/app/Public/Images/tabler-icon-rosette-discount-c.svg";

const Banerek: NextPage = () => {
  return (
    <div className={styles.banerek}>
      <div className={styles.frameParent}>
        
        {/* 1. Bezpieczne płatności */}
        <div className={styles.tablerIconWalletParent}>
          <div className={styles.tablerIconWallet}>
            <Image 
              className={styles.vectorIcon} 
              src={walletIcon} 
              width={33.3} 
              height={33.3} 
              sizes="100vw" 
              alt="Portfel" 
            />
          </div>
          <b className={styles.bezpiecznePatnoci}>100% bezpieczne <br/>płatności</b>
        </div>

        {/* 2. 30 dni na zwrot */}
        <div className={styles.tablerIconPackageImportParent}>
          <Image 
            className={styles.tablerIconPackageImport} 
            src={packageImportIcon} 
            width={50} 
            height={50} 
            sizes="100vw" 
            alt="Zwrot paczki" 
          />
          <b className={styles.bezpiecznePatnoci}>30 dni na zwrot<br/>dla zalogowanych</b>
        </div>

        {/* 3. Darmowa dostawa */}
        <div className={styles.tablerIconTruckDeliveryParent}>
          <Image 
            className={styles.tablerIconPackageImport} 
            src={truckDeliveryIcon} 
            width={50} 
            height={50} 
            sizes="100vw" 
            alt="Dostawa" 
          />
          <b className={styles.bezpiecznePatnoci}>darmowa dostawa <br/>od 150 zł</b>
        </div>

        {/* 4. Gwarancja oryginalności */}
        <div className={styles.tablerIconRosetteDiscountCParent}>
          <Image 
            className={styles.tablerIconPackageImport} 
            src={rosetteDiscountIcon} 
            width={50} 
            height={50} 
            sizes="100vw" 
            alt="Certyfikat" 
          />
          <b className={styles.bezpiecznePatnoci}>gwarancja<br/>oryginalności</b>
        </div>

      </div>
    </div>
  );
};

export default Banerek;