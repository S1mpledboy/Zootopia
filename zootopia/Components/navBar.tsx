"use client"; // To pozwala nam na sprawdzanie stanu w przeglądarce

import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Image from "next/image";
import styles from '@/app/modulesCSS/navBar.module.css';
import logo from "@/app/Public/Images/ZOOTOPIA.svg";
import searchicon from "@/app/Public/Images/tabler-icon-search.svg";
import hearticon from "@/app/Public/Images/tabler-icon-heart.svg";
import bagicon from "@/app/Public/Images/tabler-icon-shopping-bag.svg";
import usericon from "@/app/Public/Images/tabler-icon-user-circle.svg";
import Category from '@/Components/category';

const Nawigacja: NextPage = () => {
  // Domyślnie zakładamy false, dopóki przeglądarka nie sprawdzi statusu
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Odpytujemy nasz prosty endpoint zaraz po załadowaniu paska nawigacji
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data.isLoggedIn);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <main>
      <div className={styles.nawigacja}>
        <div className={styles.zootopiaWrapper}>
          <Link href="/">
            <Image src={logo} className={styles.zootopiaIcon} width={253.6} height={40} sizes="100vw" alt="" />
          </Link>
        </div>
        
        <div className={styles.szukajParent}>
          <div className={styles.szukaj}>Szukaj...</div>
          <Image src={searchicon} className={styles.tablerIconSearch} width={24} height={24} sizes="100vw" alt="" />
        </div>
        
        <div className={styles.frameParent}>
          <Link href="/MojeKonto">
            <div className={styles.tablerIconHeartParent}>
              <Image src={hearticon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
              <div className={styles.ulubione}>Ulubione</div>
            </div>
          </Link>

          {/* DYNAMICZNY LINK: Przełącza się w zależności od stanu isLoggedIn */}
          <Link href={isLoggedIn ? "/MojeKonto" : "/Auth"}>
            <div className={styles.tablerIconHeartParent}>
              <Image src={usericon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
              <div className={styles.ulubione}>Moje konto</div>
            </div>
          </Link>

          <div className={styles.tablerIconHeartParent}>
            <Image src={bagicon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
            <div className={styles.ulubione}>Koszyk</div>
          </div>
        </div>
      </div>
      <Category />
    </main>
  );
};

export default Nawigacja;