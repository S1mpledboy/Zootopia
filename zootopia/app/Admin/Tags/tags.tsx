'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import styles from './tags.module.css';

import line from '@/app/Public/Images/line.svg';
import add from '@/app/Public/Images/+icon.svg';
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import { tagsData as initialTagsData } from './testTags';
import DodawanieModal from './dodaj';

const Tags: NextPage = () => {
  const [data, setData] = useState(initialTagsData);
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>({});

  // Stan Modala
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    initialValue: '',
    buttonLabel: 'DODAJ',
    onConfirm: (val: string) => {},
  });

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const openModal = (title: string, initialValue: string, buttonLabel: string, onConfirmHandler: (val: string) => void) => {
    setModalConfig({
      isOpen: true,
      title,
      initialValue,
      buttonLabel,
      onConfirm: (val) => {
        onConfirmHandler(val);
        closeModal();
      }
    });
  };

  const toggleCollapse = (key: string) => {
    setCollapsedState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ==========================================
  // FUNKCJE USUWANIA (DELETE)
  // ==========================================
  const deleteMainCategory = (mainIdx: number) => {
    if(confirm("Czy na pewno chcesz usunąć tę główną kategorię wraz z całą zawartością?")) {
      setData(data.filter((_, idx) => idx !== mainIdx));
    }
  };

  const deleteCategory = (mainIdx: number, catIdx: number) => {
    const newData = [...data];
    newData[mainIdx].categories.splice(catIdx, 1);
    setData(newData);
  };

  const deleteSubcategory = (mainIdx: number, catIdx: number, subIdx: number) => {
    const newData = [...data];
    newData[mainIdx].categories[catIdx].subcategories.splice(subIdx, 1);
    setData(newData);
  };

  const deleteTag = (mainIdx: number, catIdx: number, subIdx: number, tagIdx: number) => {
    const newData = [...data];
    newData[mainIdx].categories[catIdx].subcategories[subIdx].tags.splice(tagIdx, 1);
    setData(newData);
  };

  return (
    <div className={styles.prawa}>
      <div className={styles.sortowanieParent}>
        
        {/* BREADCRUMBS */}
        <div className={styles.sortowanie}>
          <div className={styles.administrator}>Administrator</div>
          <div className={styles.administrator}>{`>`}</div>
          <div className={styles.administrator}>Zarządzanie TAGami</div>
        </div>

        {/* NAGŁÓWEK I GLOBALNY PRZYCISK */}
        <div className={styles.produktyWKoszykuParent}>
          <div className={styles.headerRow}>
            <div className={styles.zarzdzanieTagami2}>Zarządzanie TAGami</div>
            <button 
              className={styles.globalAddBtn}
              onClick={() => openModal("Dodaj nową główną kategorię", "", "DODAJ", (newVal) => {
                setData([...data, { mainCategory: newVal, categories: [] }]);
              })}
            >
              + NOWA GŁÓWNA KATEGORIA
            </button>
          </div>
          <div className={styles.vectorWrapper}>
            <Image src={line} className={styles.frameChild} width={760} height={1} alt="" />
          </div>
        </div>

        {/* DRZEWO KATEGORII */}
        {data.map((mainItem, mainIndex) => {
          const mainKey = `${mainIndex}`;
          const isMainCollapsed = collapsedState[mainKey];

          return (
            <div key={mainIndex} className={styles.pies}>
              
              {/* 1. GŁÓWNA KATEGORIA */}
              <div className={styles.piesParent}>
                <div className={styles.mainCategoryFlex}>
                  {/* Nowa strzałka SVG - obraca się, gdy jest otwarta */}
                  <Image 
                    src={arrow} 
                    className={`${styles.arrowIcon} ${isMainCollapsed ? '' : styles.arrowExpanded}`}
                    width={18} 
                    height={18} 
                    alt="Rozwiń/Zwiń"
                    onClick={() => toggleCollapse(mainKey)}
                  />
                  
                  <div 
                    className={styles.clickableMainTitle}
                    onClick={() => openModal(`Edytuj główną kategorię`, mainItem.mainCategory, "ZAPISZ", (newVal) => {
                      const newData = [...data];
                      newData[mainIndex].mainCategory = newVal;
                      setData(newData);
                    })}
                  >
                    {mainItem.mainCategory}
                  </div>
                  <span className={styles.globalDeleteX} onClick={() => deleteMainCategory(mainIndex)}>✕</span>
                </div>
                
                <div 
                  className={styles.doKasy} 
                  onClick={() => openModal(`Dodaj kategorię do: ${mainItem.mainCategory}`, "", "DODAJ", (newVal) => {
                    const newData = [...data];
                    newData[mainIndex].categories.push({ name: newVal, subcategories: [] });
                    setData(newData);
                  })}
                >
                  <div className={styles.vectorParent}>
                    <Image src={add} className={styles.vectorIcon} width={14} height={14} alt="" />
                    <div className={styles.dodajKategori}>DODAJ KATEGORIĘ</div>
                  </div>
                </div>
              </div>

              {/* LISTA KATEGORII (Posiada wcięcie określone w klasie .frameParent) */}
              {!isMainCollapsed && (
                <div className={styles.frameParent}>
                  {mainItem.categories.map((category, catIndex) => {
                    const catKey = `${mainIndex}-${catIndex}`;
                    const isCatCollapsed = collapsedState[catKey];

                    return (
                      <div key={catIndex} className={styles.categoryLevelWrapper}>
                        
                        {/* 2. KATEGORIA (np. Karmy) */}
                        <div className={styles.karmyParent}>
                          <Image 
                            src={arrow} 
                            className={`${styles.arrowIcon} ${isCatCollapsed ? '' : styles.arrowExpanded}`}
                            width={16} 
                            height={16} 
                            alt="Rozwiń/Zwiń"
                            onClick={() => toggleCollapse(catKey)}
                          />

                          <div 
                            className={styles.clickableCategory}
                            onClick={() => openModal(`Edytuj kategorię`, category.name, "ZAPISZ", (newVal) => {
                              const newData = [...data];
                              newData[mainIndex].categories[catIndex].name = newVal;
                              setData(newData);
                            })}
                          >
                            {category.name}
                          </div>

                          <Image 
                            src={add} 
                            className={styles.vectorIcon2} 
                            width={14} height={14} alt="" 
                            onClick={() => openModal(`Dodaj podkategorię do: ${category.name}`, "", "DODAJ", (newVal) => {
                              const newData = [...data];
                              newData[mainIndex].categories[catIndex].subcategories.push({ name: newVal, tags: [] });
                              setData(newData);
                            })}
                          />
                          <span className={styles.globalDeleteX} onClick={() => deleteCategory(mainIndex, catIndex)}>✕</span>
                        </div>

                        {/* LISTA PODKATEGORII (Ukrywana, posiada kolejne wcięcie w .frameGroup) */}
                        {!isCatCollapsed && (
                          <div className={styles.subcategoriesContainer}>
                            {category.subcategories.map((subcat, subIndex) => {
                              const subKey = `${mainIndex}-${catIndex}-${subIndex}`;
                              const isSubCollapsed = collapsedState[subKey];

                              return (
                                <div key={subIndex} className={styles.frameGroup}>
                                  
                                  {/* 3. PODKATEGORIA (np. WIELKOŚĆ RASY) */}
                                  <div className={styles.wielkoRasyParent}>
                                    <Image 
                                      src={arrow} 
                                      className={`${styles.arrowIcon} ${isSubCollapsed ? '' : styles.arrowExpanded}`}
                                      width={14} 
                                      height={14} 
                                      alt="Rozwiń/Zwiń"
                                      onClick={() => toggleCollapse(subKey)}
                                    />

                                    <b 
                                      className={styles.clickableSubcategory}
                                      onClick={() => openModal(`Edytuj podkategorię`, subcat.name, "ZAPISZ", (newVal) => {
                                        const newData = [...data];
                                        newData[mainIndex].categories[catIndex].subcategories[subIndex].name = newVal;
                                        setData(newData);
                                      })}
                                    >
                                      {subcat.name}
                                    </b>

                                    <Image 
                                      src={add} 
                                      className={styles.vectorIcon2} 
                                      width={14} height={14} alt="" 
                                      onClick={() => openModal(`Dodaj TAG do: ${subcat.name}`, "", "DODAJ", (newVal) => {
                                        const newData = [...data];
                                        newData[mainIndex].categories[catIndex].subcategories[subIndex].tags.push(newVal);
                                        setData(newData);
                                      })}
                                    />
                                    <span className={styles.globalDeleteX} onClick={() => deleteSubcategory(mainIndex, catIndex, subIndex)}>✕</span>
                                  </div>
                                  
                                  {/* 4. TAGI (Posiadają wcięcie zdefiniowane w .tagsContainer) */}
                                  {!isSubCollapsed && (
                                    <div className={styles.tagsContainer}>
                                      {subcat.tags.map((tag, tagIndex) => (
                                        <div key={tagIndex} className={styles.tagWrapper}>
                                          <span 
                                            className={styles.tagText}
                                            onClick={() => openModal(`Edytuj TAG`, tag, "ZAPISZ", (newVal) => {
                                              const newData = [...data];
                                              newData[mainIndex].categories[catIndex].subcategories[subIndex].tags[tagIndex] = newVal;
                                              setData(newData);
                                            })}
                                          >
                                            {tag}
                                          </span>
                                          <span className={styles.tagDeleteX} onClick={() => deleteTag(mainIndex, catIndex, subIndex, tagIndex)}>✕</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

      </div>

      <DodawanieModal 
        isOpen={modalConfig.isOpen} 
        title={modalConfig.title} 
        initialValue={modalConfig.initialValue}
        buttonLabel={modalConfig.buttonLabel}
        onClose={closeModal} 
        onConfirm={modalConfig.onConfirm} 
      />
    </div>
  );
};

export default Tags;