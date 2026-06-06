'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './tags.module.css';

import line from '@/app/Public/Images/line.svg';
import add from '@/app/Public/Images/+icon.svg';
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import DodawanieModal from './dodaj';

// Struktura danych dostosowana do bazy (każdy element ma swoje _id)
interface ITag { _id: string; name: string; }
interface ISubcategory { _id: string; name: string; tags: ITag[]; }
interface ICategory { _id: string; name: string; subcategories: ISubcategory[]; }
interface IMainCategory { _id: string; mainCategory: string; categories: ICategory[]; }

interface TagsProps {
  initialCategories: any[];
  initialTagGroups: any[];
  initialTags: any[];
}

const Tags: React.FC<TagsProps> = ({ initialCategories, initialTagGroups, initialTags }) => {
  const [data, setData] = useState<IMainCategory[]>([]);
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>({});

  // Stan Modala
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    initialValue: '',
    buttonLabel: 'DODAJ',
    onConfirm: (val: string) => {},
  });

  // Budowanie drzewa z płaskich danych z bazy przy montowaniu komponentu
  useEffect(() => {
    const mainCategories = initialCategories.filter(c => !c.parent);
    
    const tree = mainCategories.map(main => {
      const level1Cats = initialCategories.filter(c => c.parent === main._id);
      
      return {
        _id: main._id,
        mainCategory: main.name,
        categories: level1Cats.map(cat => {
          const subGroups = initialTagGroups.filter(g => g.category === cat._id);
          
          return {
            _id: cat._id,
            name: cat.name,
            subcategories: subGroups.map(group => {
              const groupTags = initialTags.filter(t => t.group === group._id);
              
              return {
                _id: group._id,
                name: group.name,
                tags: groupTags.map(t => ({ _id: t._id, name: t.name }))
              };
            })
          };
        })
      };
    });

    setData(tree);
  }, [initialCategories, initialTagGroups, initialTags]);

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

  // =========================================================================
  // LOKALNE FUNKCJE MODYFIKACJI (Wygląd i zachowanie UI przed podpięciem API)
  // =========================================================================
  
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
                setData([...data, { _id: Math.random().toString(), mainCategory: newVal, categories: [] }]);
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
            <div key={mainItem._id || mainIndex} className={styles.pies}>
              
              {/* 1. GŁÓWNA KATEGORIA */}
              <div className={styles.piesParent}>
                <div className={styles.mainCategoryFlex}>
                  <Image 
                    src={arrow} 
                    className={`${styles.arrowIcon} ${isMainCollapsed ? '' : styles.arrowExpanded}`}
                    width={18} height={18} alt="Rozwiń/Zwiń"
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
                    newData[mainIndex].categories.push({ _id: Math.random().toString(), name: newVal, subcategories: [] });
                    setData(newData);
                  })}
                >
                  <div className={styles.vectorParent}>
                    <Image src={add} className={styles.vectorIcon} width={14} height={14} alt="" />
                    <div className={styles.dodajKategori}>DODAJ KATEGORIĘ</div>
                  </div>
                </div>
              </div>

              {/* LISTA KATEGORII */}
              {!isMainCollapsed && (
                <div className={styles.frameParent}>
                  {mainItem.categories.map((category, catIndex) => {
                    const catKey = `${mainIndex}-${catIndex}`;
                    const isCatCollapsed = collapsedState[catKey];

                    return (
                      <div key={category._id || catIndex} className={styles.categoryLevelWrapper}>
                        
                        {/* 2. KATEGORIA */}
                        <div className={styles.karmyParent}>
                          <Image 
                            src={arrow} 
                            className={`${styles.arrowIcon} ${isCatCollapsed ? '' : styles.arrowExpanded}`}
                            width={16} height={16} alt="Rozwiń/Zwiń"
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
                              newData[mainIndex].categories[catIndex].subcategories.push({ _id: Math.random().toString(), name: newVal, tags: [] });
                              setData(newData);
                            })}
                          />
                          <span className={styles.globalDeleteX} onClick={() => deleteCategory(mainIndex, catIndex)}>✕</span>
                        </div>

                        {/* LISTA PODKATEGORII */}
                        {!isCatCollapsed && (
                          <div className={styles.subcategoriesContainer}>
                            {category.subcategories.map((subcat, subIndex) => {
                              const subKey = `${mainIndex}-${catIndex}-${subIndex}`;
                              const isSubCollapsed = collapsedState[subKey];

                              return (
                                <div key={subcat._id || subIndex} className={styles.frameGroup}>
                                  
                                  {/* 3. PODKATEGORIA (GRUPA TAGÓW) */}
                                  <div className={styles.wielkoRasyParent}>
                                    <Image 
                                      src={arrow} 
                                      className={`${styles.arrowIcon} ${isSubCollapsed ? '' : styles.arrowExpanded}`}
                                      width={14} height={14} alt="Rozwiń/Zwiń"
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
                                        newData[mainIndex].categories[catIndex].subcategories[subIndex].tags.push({ _id: Math.random().toString(), name: newVal });
                                        setData(newData);
                                      })}
                                    />
                                    <span className={styles.globalDeleteX} onClick={() => deleteSubcategory(mainIndex, catIndex, subIndex)}>✕</span>
                                  </div>
                                  
                                  {/* 4. TAGI */}
                                  {!isSubCollapsed && (
                                    <div className={styles.tagsContainer}>
                                      {subcat.tags.map((tagObj, tagIndex) => (
                                        <div key={tagObj._id || tagIndex} className={styles.tagWrapper}>
                                          <span 
                                            className={styles.tagText}
                                            onClick={() => openModal(`Edytuj TAG`, tagObj.name, "ZAPISZ", (newVal) => {
                                              const newData = [...data];
                                              newData[mainIndex].categories[catIndex].subcategories[subIndex].tags[tagIndex].name = newVal;
                                              setData(newData);
                                            })}
                                          >
                                            {tagObj.name}
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