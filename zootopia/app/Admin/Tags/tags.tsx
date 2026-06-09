'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './tags.module.css';

import line from '@/app/Public/Images/line.svg';
import add from '@/app/Public/Images/+icon.svg';
import arrow from "@/app/Public/Images/tabler-icon-chevron-compact-right.svg";

import DodawanieModal from './dodaj';

interface ITag { _id: string; name: string; }
interface ISubcategory { _id: string; name: string; tags: ITag[]; }
interface ICategory { _id: string; name: string; subcategories: ISubcategory[]; }
interface IMainCategory { _id: string; mainCategory: string; categories: ICategory[]; }

interface TagsProps {
  initialCategories: any[];
  initialTagGroups: any[];
  initialTags: any[];
}

interface DeleteTarget {
  id: string;
  name: string;
  type: 'main' | 'category' | 'subcategory' | 'tag';
  label: string;
}

const Tags: React.FC<TagsProps> = ({ initialCategories, initialTagGroups, initialTags }) => {
  const [data, setData] = useState<IMainCategory[]>([]);
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>({});

  // Stan Modalu Dodawania/Edycji
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    initialValue: '',
    buttonLabel: 'DODAJ',
    onConfirm: (val: string) => {},
  });

  // Stan Modalu Potwierdzenia Usunięcia
  const [itemToDelete, setItemToDelete] = useState<DeleteTarget | null>(null);

  // Budowanie drzewa z danych wejściowych
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

  // OBSŁUGA INTERFEJSU API (Zarządzanie bazą danych i stanem lokalnym)

  // --- DODAWANIE ---
  const handleAddMainCategory = async (name: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setData(prev => [...prev, { _id: saved.data._id, mainCategory: saved.data.name, categories: [] }]);
    } catch {
      alert("Błąd podczas dodawania głównej kategorii.");
    }
  };

  const handleAddCategory = async (name: string, parentId: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parent: parentId }),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      
      setData(prev => prev.map(main => main._id === parentId ? {
        ...main,
        categories: [...main.categories, { _id: saved.data._id, name: saved.data.name, subcategories: [] }]
      } : main));
    } catch {
      alert("Błąd podczas dodawania kategorii.");
    }
  };

  const handleAddSubcategory = async (name: string, categoryId: string) => {
    try {
      const res = await fetch('/api/tag-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category: categoryId }),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();

      setData(prev => prev.map(main => ({
        ...main,
        categories: main.categories.map(cat => cat._id === categoryId ? {
          ...cat,
          subcategories: [...cat.subcategories, { _id: saved.data._id, name: saved.data.name, tags: [] }]
        } : cat)
      })));
    } catch {
      alert("Błąd podczas dodawania podkategorii.");
    }
  };

  const handleAddTag = async (name: string, groupId: string) => {
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, group: groupId }),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();

      setData(prev => prev.map(main => ({
        ...main,
        categories: main.categories.map(cat => ({
          ...cat,
          subcategories: cat.subcategories.map(sub => sub._id === groupId ? {
            ...sub,
            tags: [...sub.tags, { _id: saved.data._id, name: saved.data.name }]
          } : sub)
        }))
      })));
    } catch {
      alert("Błąd podczas dodawania TAGa.");
    }
  };

  // --- EDYCJA ---
  const handleEditField = async (id: string, newVal: string, endpoint: 'categories' | 'tag-groups' | 'tags', type: 'main' | 'cat' | 'sub' | 'tag') => {
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newVal }),
      });
      if (!res.ok) throw new Error();

      setData(prev => prev.map(main => {
        if (type === 'main' && main._id === id) return { ...main, mainCategory: newVal };
        return {
          ...main,
          categories: main.categories.map(cat => {
            if (type === 'cat' && cat._id === id) return { ...cat, name: newVal };
            return {
              ...cat,
              subcategories: cat.subcategories.map(sub => {
                if (type === 'sub' && sub._id === id) return { ...sub, name: newVal };
                return {
                  ...sub,
                  tags: sub.tags.map(t => (type === 'tag' && t._id === id) ? { ...t, name: newVal } : t)
                };
              })
            };
          })
        };
      }));
    } catch {
      alert("Błąd zapisu zmian.");
    }
  };

  // --- USUNIĘCIE (POTWIERDZENIE Z MODALA) ---
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;

    try {
      let endpoint = '';
      if (type === 'main' || type === 'category') endpoint = `/api/categories/${id}`;
      if (type === 'subcategory') endpoint = `/api/tag-groups/${id}`;
      if (type === 'tag') endpoint = `/api/tags/${id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error();

      // Czyszczenie lokalnego drzewa stanu na podstawie usuniętego typu
      setData(prev => prev.filter(m => m._id !== id).map(main => ({
        ...main,
        categories: main.categories.filter(c => c._id !== id).map(cat => ({
          ...cat,
          subcategories: cat.subcategories.filter(s => s._id !== id).map(sub => ({
            ...sub,
            tags: sub.tags.filter(t => t._id !== id)
          }))
        }))
      })));

      setItemToDelete(null);
    } catch {
      alert("Nie udało się usunąć wybranego elementu.");
    }
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
              onClick={() => openModal("Dodaj nową główną kategorię", "", "DODAJ", handleAddMainCategory)}
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
            <div key={mainItem._id} className={styles.pies}>
              
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
                    onClick={() => openModal(`Edytuj główną kategorię`, mainItem.mainCategory, "ZAPISZ", (val) => handleEditField(mainItem._id, val, 'categories', 'main'))}
                  >
                    {mainItem.mainCategory}
                  </div>
                  <span className={styles.globalDeleteX} onClick={() => setItemToDelete({ id: mainItem._id, name: mainItem.mainCategory, type: 'main', label: 'główną kategorię wraz z zawartością' })}>✕</span>
                </div>
                
                <div 
                  className={styles.doKasy} 
                  onClick={() => openModal(`Dodaj kategorię do: ${mainItem.mainCategory}`, "", "DODAJ", (val) => handleAddCategory(val, mainItem._id))}
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
                      <div key={category._id} className={styles.categoryLevelWrapper}>
                        
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
                            onClick={() => openModal(`Edytuj kategorię`, category.name, "ZAPISZ", (val) => handleEditField(category._id, val, 'categories', 'cat'))}
                          >
                            {category.name}
                          </div>

                          <Image 
                            src={add} 
                            className={styles.vectorIcon2} 
                            width={14} height={14} alt="" 
                            onClick={() => openModal(`Dodaj podkategorię do: ${category.name}`, "", "DODAJ", (val) => handleAddSubcategory(val, category._id))}
                          />
                          <span className={styles.globalDeleteX} onClick={() => setItemToDelete({ id: category._id, name: category.name, type: 'category', label: 'kategorię wraz z zawartością' })}>✕</span>
                        </div>

                        {/* LISTA PODKATEGORII */}
                        {!isCatCollapsed && (
                          <div className={styles.subcategoriesContainer}>
                            {category.subcategories.map((subcat, subIndex) => {
                              const subKey = `${mainIndex}-${catIndex}-${subIndex}`;
                              const isSubCollapsed = collapsedState[subKey];

                              return (
                                <div key={subcat._id} className={styles.frameGroup}>
                                  
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
                                      onClick={() => openModal(`Edytuj podkategorię`, subcat.name, "ZAPISZ", (val) => handleEditField(subcat._id, val, 'tag-groups', 'sub'))}
                                    >
                                      {subcat.name}
                                    </b>

                                    <Image 
                                      src={add} 
                                      className={styles.vectorIcon2} 
                                      width={14} height={14} alt="" 
                                      onClick={() => openModal(`Dodaj TAG do: ${subcat.name}`, "", "DODAJ", (val) => handleAddTag(val, subcat._id))}
                                    />
                                    <span className={styles.globalDeleteX} onClick={() => setItemToDelete({ id: subcat._id, name: subcat.name, type: 'subcategory', label: 'podkategorię wraz z TAGami' })}>✕</span>
                                  </div>
                                  
                                  {/* 4. TAGI */}
                                  {!isSubCollapsed && (
                                    <div className={styles.tagsContainer}>
                                      {subcat.tags.map((tagObj) => (
                                        <div key={tagObj._id} className={styles.tagWrapper}>
                                          <span 
                                            className={styles.tagText}
                                            onClick={() => openModal(`Edytuj TAG`, tagObj.name, "ZAPISZ", (val) => handleEditField(tagObj._id, val, 'tags', 'tag'))}
                                          >
                                            {tagObj.name}
                                          </span>
                                          <span className={styles.tagDeleteX} onClick={() => setItemToDelete({ id: tagObj._id, name: tagObj.name, type: 'tag', label: 'TAG' })}>✕</span>
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

      {/* BEZPIECZNY MODAL POTWIERDZENIA USUNIĘCIA*/}
      {itemToDelete && (
        <div className={styles.overlay} onClick={() => setItemToDelete(null)}>
          <div className={styles.modalUsun} onClick={(e) => e.stopPropagation()}>
            
            <button className={styles.przyciskX} onClick={() => setItemToDelete(null)}>
              ✕
            </button>

            <div className={styles.modalTytul}>
              Czy na pewno chcesz usunąć {itemToDelete.label} <br />
              <span style={{ color: '#e74c3c' }}>
                {itemToDelete.name}
              </span>?
            </div>

            <div className={styles.frameParentModal}>
              <button 
                className={styles.przyciskAnuluj} 
                onClick={() => setItemToDelete(null)}
              >
                Anuluj
              </button>
              
              <button 
                className={styles.przyciskUsun} 
                onClick={confirmDelete}
              >
                TAK, usuń
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;