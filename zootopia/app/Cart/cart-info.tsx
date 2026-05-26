import type { NextPage } from 'next';
import Image from "next/image";
import styles from './info.module.css';

// Importowanie ikon
import walletIcon from "@/app/Public/Images/tabler-icon-wallet.svg";
import packageImportIcon from "@/app/Public/Images/tabler-icon-package-import.svg";
import truckDeliveryIcon from "@/app/Public/Images/tabler-icon-truck-delivery.svg";
import rosetteDiscountIcon from "@/app/Public/Images/tabler-icon-rosette-discount-check.svg";

const Banerek: NextPage = () => {
  return (
    <div className={styles.banerek}>
      <div className={styles.frameParent}>
        
        {/* 1. Bezpieczne płatności */}
        <div className={styles.tablerIconWalletParent}>
          <div className={styles.tablerIconPackageImport}>
            <Image 
              src={walletIcon} 
              width={40} 
              height={40} 
              alt="Portfel" 
            />
          </div>
          <b className={styles.bezpiecznePatnoci}>100% bezpieczne <br/>płatności</b>
        </div>

        {/* 2. 30 dni na zwrot */}
        <div className={styles.tablerIconPackageImportParent}>
          <div className={styles.tablerIconPackageImport}>
            <Image 
              src={packageImportIcon} 
              width={40} 
              height={40} 
              alt="Zwrot paczki" 
            />
          </div>
          <b className={styles.bezpiecznePatnoci}>30 dni na zwrot<br/>dla zalogowanych</b>
        </div>

        {/* 3. Darmowa dostawa */}
        <div className={styles.tablerIconTruckDeliveryParent}>
          <div className={styles.tablerIconPackageImport}>
            <Image 
              src={truckDeliveryIcon} 
              width={40} 
              height={40} 
              alt="Dostawa" 
            />
          </div>
          <b className={styles.bezpiecznePatnoci}>darmowa dostawa <br/>od 150 zł</b>
        </div>

        {/* 4. Gwarancja oryginalności */}
        <div className={styles.tablerIconRosetteDiscountCParent}>
          <div className={styles.tablerIconPackageImport}>
            <Image 
              src={rosetteDiscountIcon} 
              width={40} 
              height={40} 
              alt="Certyfikat" 
            />
          </div>
          <b className={styles.bezpiecznePatnoci}>gwarancja<br/>oryginalności</b>
        </div>

      </div>
    </div>
  );
};

export default Banerek;