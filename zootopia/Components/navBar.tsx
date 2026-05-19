'use client'; // Wymagane w Next.js App Router, jeśli używamy hooków stanu

import type { NextPage } from 'next';
import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from 'react';

import styles from '@/app/modulesCSS/navBar.module.css';
import logo from "@/app/Public/Images/ZOOTOPIA.svg";
import searchicon from "@/app/Public/Images/tabler-icon-search.svg";
import hearticon from "@/app/Public/Images/tabler-icon-heart.svg";
import bagicon from "@/app/Public/Images/tabler-icon-shopping-bag.svg";
import usericon from "@/app/Public/Images/tabler-icon-user-circle.svg";
import Category from '@/Components/category';

const Nawigacja: NextPage = () => {
    // Stan przechowujący informację, czy użytkownik jest zalogowany
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        // TUTAJ dodaj swoją logikę sprawdzania autoryzacji.
        // Na potrzeby przykładu sprawdzamy, czy w pamięci przeglądarki istnieje token:
        const token = localStorage.getItem('userToken'); 
        setIsLoggedIn(!!token); // Zwróci true, jeśli token istnieje
    }, []);

    // Dynamicznie ustalamy adres URL dla sekcji "Moje konto"
    const accountLinkPath = isLoggedIn ? '/MojeKonto' : '/Auth';

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

                    {/* Poprawiona sekcja Moje Konto - dynamiczny link i cała grupa jako klikalny Link */}
                    <Link href={accountLinkPath}>
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
            <Category/>
        </main>
    );
};

export default Nawigacja;