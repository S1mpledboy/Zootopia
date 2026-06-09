"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./admin.module.css";
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import ZarzadzanieZamowieniami from "./Zamowienia/zarzadzanieZamowieniami";
import Konta from "./Konta/konta";
import Tags from "./Tags/tags";
import AdminProductsTab from "./Prosukty/zarzadzanieProduktami";
import ZarzadzanieAdopcjami from "./Adopcje/zarzadzanieAdopcjami";

type TabType = "dane" | "zamowienia" | "produkty" | "uzytkownicy" | "tags" | "adopcje";

// Komponent nie przyjmuje już żadnych danych z serwera przez props
const AdminClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("zamowienia"); // Zmieniłem domyślny na "zamowienia", bo "dane" były zakomentowane

  const getMenuClass = (tabName: TabType) => {
    const baseClass = styles.listaUlubionychParent;
    return activeTab === tabName ? `${baseClass} ${styles.activeTab}` : baseClass;
  };

  // Wszystkie komponenty-córki są teraz samodzielne i same dbają o swoje API
  const renderRightSection = () => {
    switch (activeTab) {
      case "zamowienia":
        return <ZarzadzanieZamowieniami />;
      case "produkty":
        return <AdminProductsTab />;
      case "uzytkownicy":
        return <Konta />; // Nasz zaktualizowany komponent bez propsów
      case "tags":
        return <Tags />;
      case "adopcje":
        return <ZarzadzanieAdopcjami />;
      default:
        return <ZarzadzanieZamowieniami />;
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

              <div className={getMenuClass("adopcje")} onClick={() => setActiveTab("adopcje")} style={{ cursor: "pointer" }}>
                <div className={styles.mojeDane}>Zarządzanie adopcjami</div>
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
          {renderRightSection()}
        </div>

      </div>
    </div>
  );
};

export default AdminClient;