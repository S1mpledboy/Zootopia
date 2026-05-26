// pages/ulubione/index.tsx

import type { NextPage } from "next";
import Link from "next/link";

import Property1Ulubione from "./likedItem";


import styles from 'app/Liked/liked.module.css';

const UlubionePage: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Polubione produkty</h1>

      <div className={styles.list}>
        <div className={styles.item}>
          <Property1Ulubione />
        </div>

        <div className={styles.item}>
          <Property1Ulubione />
        </div>

        <div className={styles.item}>
          <Property1Ulubione />
        </div>
      </div>

      <div className={styles.summary}>
        <span>Razem:</span>
        <span>478,00 zł</span>
      </div>

      <Link href="/" className={styles.backButton}>
        <span className={styles.arrow}>‹</span>
        Kontynuuj zakupy
      </Link>
    </div>
  );
};

export default UlubionePage;