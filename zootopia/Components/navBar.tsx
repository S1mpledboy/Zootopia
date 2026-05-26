"use client";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    fetch('/api/auth/status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
          {/* ZMIENIONY PRZYCISK ULUBIONE */}
          <Link href={isLoggedIn ? "/Liked" : "/Auth"}>
            <div className={styles.tablerIconHeartParent}>
              <Image src={hearticon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
              <div className={styles.ulubione}>Ulubione</div>
            </div>
          </Link>

          {/* DYNAMICZNY LINK I TEKST KONTA */}
          <Link href={isLoggedIn ? "/MojeKonto" : "/Auth"}>
            <div className={styles.tablerIconHeartParent}>
              <Image src={usericon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
              <div className={styles.ulubione}>
                {isLoggedIn ? "Moje konto" : "Zaloguj się"}
              </div>
            </div>
          </Link>

          <Link href="/Cart">
            <div className={styles.tablerIconHeartParent}>
              <Image src={bagicon} className={styles.tablerIconHeart} width={36} height={36} sizes="100vw" alt="" />
              <div className={styles.ulubione}>Koszyk</div>
            </div>
          </Link>
        </div>
      </div>
      <Category />
    </main>
  );
};

export default Nawigacja;