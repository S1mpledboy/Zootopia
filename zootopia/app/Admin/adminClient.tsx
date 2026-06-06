"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import styles from "./admin.module.css";
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import DaneIBezpieczenstwo from "./daneIBezpieczenstwo";
import ZarzadzanieZamowieniami from "./Zamowienia/zarzadzanieZamowieniami";
import Konta from "./Konta/konta";
import ZarzadzanieProduktami from "./Prosukty/zarzadzanieProduktami";
import Tags from "./Tags/tags";

type TabType = "dane" | "zamowienia" | "produkty" | "uzytkownicy" | "tags";

interface AdminClientProps {
  ordersData: any[];
  productsData: any[];
  usersData: any[]; // NOWOŚĆ: Przekazujemy tablicę użytkowników pobraną z bazy MongoDB
  categoriesData: any[]; // NOWOŚĆ
  tagGroupsData: any[];  // NOWOŚĆ
  tagsData: any[];       // NOWOŚĆ
}

const AdminClient: React.FC<AdminClientProps> = ({ ordersData, productsData, usersData, categoriesData, tagGroupsData, tagsData }) => {
  const [activeTab, setActiveTab] = useState<TabType>("dane");

  const getMenuClass = (tabName: TabType) => {
    const baseClass = styles.listaUlubionychParent;
    return activeTab === tabName ? `${baseClass} ${styles.activeTab}` : baseClass;
  };

  const renderRightSection = () => {
    switch (activeTab) {
      case "dane":
        return <DaneIBezpieczenstwo />;
      case "zamowienia":
        return <ZarzadzanieZamowieniami initialOrders={ordersData} />;
      case "produkty":
        //return <ZarzadzanieProduktami initialProducts={productsData} />;
      case "uzytkownicy":
        // ZMIANA: Przekazujemy tablicę użytkowników do komponentu Konta
        return <Konta initialUsers={usersData} />;
      case "tags":
        return <Tags 
          initialCategories={categoriesData} 
          initialTagGroups={tagGroupsData} 
          initialTags={tagsData} 
        />;
      default:
        return <DaneIBezpieczenstwo />;
    }
  };

  return (
    <div className={styles.produktyWKoszyku}>
      <div className={styles.frameParent}>
        
        {/* LEWE MENU */}
        <div className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.mojeKontoParent}>
              <div className={styles.mojeKonto}>Administrator</div>
              <div className={styles.frameChild} />
            </div>

            <div className={styles.frameContainer}>
              <div className={getMenuClass("dane")} onClick={() => setActiveTab("dane")} style={{ cursor: "pointer" }}>
                <div className={styles.mojeDane}>Dane i bezpieczeństwo</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              <div className={getMenuClass("zamowienia")} onClick={() => setActiveTab("zamowienia")} style={{ cursor: "pointer" }}>
                <div className={styles.mojeDane}>Zarządzanie zamówieniami</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              <div className={getMenuClass("produkty")} onClick={() => setActiveTab("produkty")} style={{ cursor: "pointer" }}>
                <div className={styles.mojeDane}>Zarządzanie produktami</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              <div className={getMenuClass("uzytkownicy")} onClick={() => setActiveTab("uzytkownicy")} style={{ cursor: "pointer" }}>
                <div className={styles.mojeDane}>Zarządzanie użytkownikami</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              <div className={getMenuClass("tags")} onClick={() => setActiveTab("tags")} style={{ cursor: "pointer" }}>
                <div className={styles.mojeDane}>Zarządzanie TAGami</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              <div className={styles.listaUlubionychParent} onClick={() => alert("Wylogowywanie...")} style={{ cursor: "pointer" }}>
                <div className={styles.mojeDane}>Wyloguj się</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* PRAWA STRONA */}
        <div className={styles.frameDiv}>
            <div className={styles.sortowanieParent}>
              {renderRightSection()}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminClient;