'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './tags.module.css';

import line from '@/app/Public/Images/line.svg';
import add from '@/app/Public/Images/+icon.svg';
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

// Definicja typów dla struktury drzewa (Frontend)
interface ISubcategory { name: string; tags: string[]; }
interface ICategory { name: string; subcategories: ISubcategory[]; }
interface IMainCategory { mainCategory: string; categories: ICategory[]; }

interface TagsProps {
  initialCategories: any[];
  initialTagGroups: any[];
  initialTags: any[];
}

const Tags: React.FC<TagsProps> = ({ initialCategories, initialTagGroups, initialTags }) => {
  // Stan trzymający przetworzone drzewo kategorii
  const [data, setData] = useState<IMainCategory[]>([]);
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>({});

  // PARSER: Zamiana płaskiej struktury z bazy danych na drzewo zagnieżdżone
  useEffect(() => {
    // 1. Znajdź główne kategorie (te, które nie mają rodzica, np. "Pies", "Kot")
    const mainCategories = initialCategories.filter(c => !c.parent);
    
    const tree = mainCategories.map(main => {
      // 2. Znajdź kategorie przypisane do tej głównej kategorii (np. "Karmy" dla "Pies")
      const level1Cats = initialCategories.filter(c => c.parent === main._id);
      
      return {
        mainCategory: main.name,
        categories: level1Cats.map(cat => {
          // 3. Znajdź grupy tagów przypisane do danej kategorii (np. "Wiek psa", "Wielkość rasy")
          const subGroups = initialTagGroups.filter(g => g.category === cat._id);
          
          return {
            name: cat.name,
            subcategories: subGroups.map(group => {
              // 4. Znajdź pojedyncze tagi przypisane do tej grupy (np. "Szczeniak", "Senior")
              const groupTags = initialTags.filter(t => t.group === group._id);
              
              return {
                name: group.name,
                tags: groupTags.map(t => t.name) // Mapujemy na tablicę stringów pod Twój JSX
              };
            })
          };
        })
      };
    });

    setData(tree);
  }, [initialCategories, initialTagGroups, initialTags]);

  const toggleCollapse = (key: string) => {
    setCollapsedState(prev => ({ ...prev, [key]: !prev[key] }));
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

        {/* NAGŁÓWEK */}
        <div className={styles.produktyWKoszykuParent}>
          <div className={styles.headerRow}>
            <div className={styles.zarzdzanieTagami2}>Zarządzanie TAGami (Podgląd z bazy)</div>
          </div>
          <div className={styles.vectorWrapper}>
            <Image src={line} className={styles.frameChild} width={760} height={1} alt="" />
          </div>
        </div>

        {/* DRZEWO KATEGORII Z BAZY DANYCH */}
        {data.map((mainItem, mainIndex) => {
          const mainKey = `${mainIndex}`;
          const isMainCollapsed = collapsedState[mainKey];

          return (
            <div key={mainIndex} className={styles.pies}>
              
              {/* 1. GŁÓWNA KATEGORIA */}
              <div className={styles.piesParent}>
                <div className={styles.mainCategoryFlex}>
                  <Image 
                    src={arrow} 
                    className={`${styles.arrowIcon} ${isMainCollapsed ? '' : styles.arrowExpanded}`}
                    width={18} height={18} alt="Rozwiń/Zwiń"
                    onClick={() => toggleCollapse(mainKey)}
                  />
                  <div className={styles.clickableMainTitle}>
                    {mainItem.mainCategory}
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
                      <div key={catIndex} className={styles.categoryLevelWrapper}>
                        
                        {/* 2. KATEGORIA */}
                        <div className={styles.karmyParent}>
                          <Image 
                            src={arrow} 
                            className={`${styles.arrowIcon} ${isCatCollapsed ? '' : styles.arrowExpanded}`}
                            width={16} height={16} alt="Rozwiń/Zwiń"
                            onClick={() => toggleCollapse(catKey)}
                          />
                          <div className={styles.clickableCategory}>
                            {category.name}
                          </div>
                        </div>

                        {/* LISTA PODKATEGORII (GRUP TAGÓW) */}
                        {!isCatCollapsed && (
                          <div className={styles.subcategoriesContainer}>
                            {category.subcategories.map((subcat, subIndex) => {
                              const subKey = `${mainIndex}-${catIndex}-${subIndex}`;
                              const isSubCollapsed = collapsedState[subKey];

                              return (
                                <div key={subIndex} className={styles.frameGroup}>
                                  
                                  {/* 3. PODKATEGORIA (GRUPA TAGÓW) */}
                                  <div className={styles.wielkoRasyParent}>
                                    <Image 
                                      src={arrow} 
                                      className={`${styles.arrowIcon} ${isSubCollapsed ? '' : styles.arrowExpanded}`}
                                      width={14} height={14} alt="Rozwiń/Zwiń"
                                      onClick={() => toggleCollapse(subKey)}
                                    />
                                    <b className={styles.clickableSubcategory}>
                                      {subcat.name}
                                    </b>
                                  </div>
                                  
                                  {/* 4. POJEDYNCZE TAGI */}
                                  {!isSubCollapsed && (
                                    <div className={styles.tagsContainer}>
                                      {subcat.tags.map((tag, tagIndex) => (
                                        <div key={tagIndex} className={styles.tagWrapper}>
                                          <span className={styles.tagText}>
                                            {tag}
                                          </span>
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
    </div>
  );
};

export default Tags;