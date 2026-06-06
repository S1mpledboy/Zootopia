"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import styles from "./admin.module.css";
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import { adminData, updateAdminData } from "./adminData";
import DaneIBezpieczenstwo from "./daneIBezpieczenstwo";
import ZarzadzanieZamowieniami from "./Zamowienia/zarzadzanieZamowieniami";
import Zamowienie from "./Zamowienia/zamowienie";
import Konta from "./Konta/konta";
import ZarzadzanieProduktami from "./Prosukty/zarzadzanieProduktami";
import DodajProdukt from "./Prosukty/dodaj";
import Tags from "./Tags/tags";

type TabType = "dane" | "zamowienia" | "produkty" | "uzytkownicy" | "tags";

const ProduktyWKoszyku: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dane");

  // Dynamiczne i poprawne generowanie klas dla menu
  const getMenuClass = (tabName: TabType) => {
    // Pierwsza zakładka ma w Figmie klasę "mojeDaneParent", pozostałe mają "listaUlubionychParent"
    const baseClass = styles.listaUlubionychParent
    
    // Sprawdzamy, czy ta konkretna zakładka jest aktualnie aktywna
    return activeTab === tabName 
      ? `${baseClass} ${styles.activeTab}` 
      : baseClass;
  };

  const renderRightSection = () => {
    switch (activeTab) {
      case "dane":
        return <DaneIBezpieczenstwo />;
      case "zamowienia":
        return <ZarzadzanieZamowieniami />;
      case "produkty":
        return <ZarzadzanieProduktami />;
      case "uzytkownicy":
        return <Konta />;
      case "tags":
        return <Tags />;
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
              
              {/* Opcja: Dane i bezpieczeństwo */}
              <div 
                className={getMenuClass("dane")} 
                onClick={() => setActiveTab("dane")}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.mojeDane}>Dane i bezpieczeństwo</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              {/* Opcja: Zarządzanie zamówieniami */}
              <div 
                className={getMenuClass("zamowienia")} 
                onClick={() => setActiveTab("zamowienia")}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.mojeDane}>Zarządzanie zamówieniami</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              {/* Opcja: Zarządzanie produktami */}
              <div 
                className={getMenuClass("produkty")} 
                onClick={() => setActiveTab("produkty")}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.mojeDane}>Zarządzanie produktami</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              {/* Opcja: Zarządzanie użytkownikami */}
              <div 
                className={getMenuClass("uzytkownicy")} 
                onClick={() => setActiveTab("uzytkownicy")}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.mojeDane}>Zarządzanie użytkownikami</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              {/* Opcja: Zarządzanie TAGami */}
              <div 
                className={getMenuClass("tags")} 
                onClick={() => setActiveTab("tags")}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.mojeDane}>Zarządzanie TAGami</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>

              <div className={styles.frameItem} />

              {/* Opcja: Wyloguj się */}
              <div 
                className={styles.listaUlubionychParent}
                onClick={() => alert("Wylogowywanie...")}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.mojeDane}>Wyloguj się</div>
                <Image src={arrow} className={styles.tablerIconChevronCompactRi} width={24} height={24} sizes="100vw" alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* PRAWA STRONA */}
        <div 
          className={
            activeTab === "produkty" 
              ? `${styles.frameDiv} ${styles.fullWidthContainer}` 
              : styles.frameDiv
          }
        >
            <div className={styles.sortowanieParent}>
              {renderRightSection()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProduktyWKoszyku;