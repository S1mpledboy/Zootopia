import type { NextPage } from 'next';
import Image from "next/image";
import styles from './info.module.css';

// 🔥 Importowanie ikon na górze kodu
import walletIcon from "@/app/Public/Images/tabler-icon-wallet.svg";
import packageImportIcon from "@/app/Public/Images/tabler-icon-package-import.svg";
import truckDeliveryIcon from "@/app/Public/Images/tabler-icon-truck-delivery.svg";
import rosetteDiscountIcon from "@/app/Public/Images/tabler-icon-rosette-discount-check.svg";

const Banerek: NextPage = () => {
  return (
    <div className={styles.banerekOuter}>
      <div className={styles.banerekInner}>
        
        {/* 1. Płatności */}
        <div className={styles.banerekItem}>
          <Image src={walletIcon} width={35} height={35} alt="Portfel" />
          <b className={styles.banerekText}>100% bezpieczne <br/>płatności</b>
        </div>

        {/* 2. Zwrot */}
        <div className={styles.banerekItem}>
          <Image src={packageImportIcon} width={45} height={45} alt="Zwrot" />
          <b className={styles.banerekText}>30 dni na zwrot<br/>dla zalogowanych</b>
        </div>

        {/* 3. Dostawa */}
        <div className={styles.banerekItem}>
          <Image src={truckDeliveryIcon} width={45} height={45} alt="Dostawa" />
          <b className={styles.banerekText}>darmowa dostawa <br/>od 150 zł</b>
        </div>

        {/* 4. Oryginalność */}
        <div className={styles.banerekItem}>
          <Image src={rosetteDiscountIcon} width={45} height={45} alt="Gwarancja" />
          <b className={styles.banerekText}>gwarancja<br/>oryginalności</b>
        </div>

      </div>
    </div>
  );
};

export default Banerek;