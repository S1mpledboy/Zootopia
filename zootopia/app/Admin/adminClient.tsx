"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import styles from "./admin.module.css";
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import ZarzadzanieZamowieniami from "./Zamowienia/zarzadzanieZamowieniami";
import Konta from "./Konta/konta";
import Tags from "./Tags/tags";
import AdminProductsTab from "./Prosukty/zarzadzanieProduktami";
import ZarzadzanieAdopcjami from "./Adopcje/zarzadzanieAdopcjami";

type TabType = "dane" | "zamowienia" | "produkty" | "uzytkownicy" | "tags" | "adopcje";

interface AdminClientProps {
  ordersData: any[];
  productsData: any[];
  usersData: any[];
  categoriesData: any[];
  tagGroupsData: any[];
  tagsData: any[];
}

const AdminClient: React.FC<AdminClientProps> = ({
  ordersData,
  productsData,
  usersData,
  categoriesData,
  tagGroupsData,
  tagsData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("dane");
  const [isClientReady, setIsClientReady] = useState(false); // Stan ładowania

  // Czekamy na pełne zamontowanie komponentu z danymi
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  const getMenuClass = (tabName: TabType) => {
    const baseClass = styles.listaUlubionychParent;
    return activeTab === tabName ? `${baseClass} ${styles.activeTab}` : baseClass;
  };

  const renderRightSection = () => {
    switch (activeTab) {
      case "zamowienia":
        return <ZarzadzanieZamowieniami initialOrders={ordersData} />;
      case "produkty":
        return (
          <AdminProductsTab
            initialProducts={productsData}
            allCategories={categoriesData}
            allTagGroups={tagGroupsData}
            allTags={tagsData}
          />
        );
      case "uzytkownicy":
        return <Konta initialUsers={usersData} />;
      case "tags":
        return (
          <Tags
            initialCategories={categoriesData}
            initialTagGroups={tagGroupsData}
            initialTags={tagsData}
          />
        );
      case "adopcje":
        return <ZarzadzanieAdopcjami />;
      default:
        return <ZarzadzanieZamowieniami initialOrders={ordersData} />;
    }
  };

  // EKRAN ŁADOWANIA - Wyświetlany dopóki dane i klient nie są w pełni gotowe
  if (!isClientReady) {
    return (
      <div className={styles.produktyWKoszyku} style={{ justifyContent: 'center', padding: '100px 0' }}>
        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', opacity: 0.7 }}>
          Wczytywanie panelu i danych z bazy...
        </div>
      </div>
    );
  }

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