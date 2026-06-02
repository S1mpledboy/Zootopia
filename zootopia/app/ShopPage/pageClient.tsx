'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './shopPage.module.css';
import { useState, useMemo, useEffect } from 'react';

import arrowDown from '@/app/Public/Images/arrowDown.svg';
import arrowRight from '@/app/Public/Images/arrowRight.svg';
import line from '@/app/Public/Images/line.svg';

import PromotionItem from '../ItemBlocks/promotionItem';

// =========================
// SECTION COMPONENT
// =========================
function Section({ id, title, children, openSections, toggleSection }: any) {
  const open = openSections[id];
  return (
    <div className={styles.frameGroup}>
      <div className={styles.tablerIconChevronCompactRiParent} onClick={() => toggleSection(id)}>
        <Image src={open ? arrowDown : arrowRight} width={24} height={24} alt="" />
        <div className={styles.cena}>{title}</div>
      </div>
      {open && <div className={styles.frameDiv}>{children}</div>}
    </div>
  );
}

// =========================
// INTERFEJSY
// =========================
interface DBAttribute {
  name: string;
  value: string;
}

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  promoPrice?: number | null;
  image: string;
  companyName: string;
  petCategoryId: string | null; // Odpowiednik product.category (ObjectId z bazy)
  attributes: DBAttribute[];
}

interface CategoryProps {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
}

// =========================
// PAGE CLIENT COMPONENT
// =========================
const KategorieClient = ({ 
  initialProducts, 
  allCategories 
}: { 
  initialProducts: ProductProps[]; 
  allCategories: CategoryProps[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Odczytujemy typ z URL (np. 'pies', 'kot', 'male-zwierzeta', 'promocje'). Domyślnie 'pies'.
  const currentType = searchParams.get('type') || 'pies';

  // ===== STATE =====
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cena: true, marka: true, wielkosc: true, wiek: true, potrzeby: true,
  });
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<string>('popularność');

  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');
  
  // Przechowujemy zaznaczone ID podkategorii z MongoDB (zamiast starego stringa tekstowego)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Resetowanie podkategorii w przypadku zmiany głównego typu w URL
  useEffect(() => {
    setActiveCategoryId(null);
    setFilters({});
    setPriceFrom('');
    setPriceTo('');
  }, [currentType]);

  // Pomocnicza funkcja do ładnego formatowania tekstu w mapie strony
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pies': return 'Pies';
      case 'kot': return 'Kot';
      case 'male-zwierzeta': return 'Małe zwierzęta';
      case 'promocje': return 'Promocje';
      default: return 'Pies';
    }
  };

  // ==========================================================
  // 🧭 DYNAMICZNA LOGIKA DRZEWA KATEGORII Z MONGO
  // ==========================================================
  // 1. Znajdujemy dokument zwierzaka (np. Pies, parent: null)
  const currentAnimalObj = useMemo(() => {
    return allCategories.find(cat => cat.slug === currentType && cat.parent === null);
  }, [allCategories, currentType]);

  // 2. Znajdujemy działy nadrzędne (Karma, LEGOWISKA itp.), których rodzicem jest ten zwierzak
  const mainCategoriesForMenu = useMemo(() => {
    if (!currentAnimalObj) return [];
    return allCategories.filter(cat => cat.parent === currentAnimalObj._id);
  }, [allCategories, currentAnimalObj]);

  // 3. Pobieramy podkategorie przypisane bezpośrednio do danego działu nadrzędnego
  const getSubcategoriesByParent = (parentId: string) => {
    return allCategories.filter(cat => cat.parent === parentId);
  };

  const activeCategoryObj = useMemo(() => allCategories.find(cat => cat._id === activeCategoryId), [activeCategoryId, allCategories]);
  const parentCategoryObj = useMemo(() => activeCategoryObj ? allCategories.find(cat => cat._id === activeCategoryObj.parent) : null, [activeCategoryObj, allCategories]);

  // ===== TOGGLE LOGIC =====
  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (group: string, value: string) => {
    setFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  const selectSort = (value: string) => {
    setSort(value);
  };

  // Naprawiona funkcja przełączania kategorii po ID z bazy danych
  const selectCategory = (id: string) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  };

  // Funkcja resetująca filtry i cofająca mapę strony do poziomu głównego zwierzęcia
  const handleResetToMainType = () => {
    setActiveCategoryId(null);
    setFilters({});
    setPriceFrom('');
    setPriceTo('');
  };

  // ==========================================
  // 📊 DYNAMICZNE WYLICZANIE LICZBY PRODUKTÓW DLA FILTRÓW
  // ==========================================
  const facetCounts = useMemo(() => {
    const getCountForOption = (group: string, value: string) => {
      return initialProducts.filter(product => {
        // 1. Sprawdzamy kategorię po ID z bazy danych
        if (group !== 'category' && activeCategoryId && product.petCategoryId !== activeCategoryId) return false;
        if (group === 'category' && product.petCategoryId !== value) return false;

        // 2. Sprawdzamy markę
        if (group !== 'marka' && filters.marka && filters.marka.length > 0 && !filters.marka.includes(product.companyName)) return false;
        if (group === 'marka' && product.companyName !== value) return false;

        // 3. Sprawdzamy cenę
        const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
        const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
        const actualPrice = product.price;
        if (actualPrice < minPrice || actualPrice > maxPrice) return false;

        const hasAttr = (name: string, val: string) => product.attributes.some(a => a.name === name && a.value === val);

        // 4. Pola atrybutów tablicowych
        if (group !== 'wielkosc' && filters.wielkosc && filters.wielkosc.length > 0) {
          if (!product.attributes.some(a => a.name === 'breedSize' && filters.wielkosc.includes(a.value))) return false;
        }
        if (group === 'wielkosc' && !hasAttr('breedSize', value)) return false;

        if (group !== 'wiek' && filters.wiek && filters.wiek.length > 0) {
          if (!product.attributes.some(a => a.name === 'dogAge' && filters.wiek.includes(a.value))) return false;
        }
        if (group === 'wiek' && !hasAttr('dogAge', value)) return false;

        if (group !== 'potrzeby' && filters.potrzeby && filters.potrzeby.length > 0) {
          if (!product.attributes.some(a => a.name === 'specialNeeds' && filters.potrzeby.includes(a.value))) return false;
        }
        if (group === 'potrzeby' && !hasAttr('specialNeeds', value)) return false;

        return true;
      }).length;
    };

    return {
      get: (group: string, value: string) => getCountForOption(group, value)
    };
  }, [initialProducts, filters, activeCategoryId, priceFrom, priceTo]);

  // ==========================================
  // 🔥 GŁÓWNA LOGIKA FILTROWANIA I SORTOWANIA
  // ==========================================
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Kategoria dolna przefiltrowana po ObjectId
    if (activeCategoryId) {
      result = result.filter(product => product.petCategoryId === activeCategoryId);
    }

    // 2. Marka
    if (filters.marka && filters.marka.length > 0) {
      result = result.filter(product => filters.marka.includes(product.companyName));
    }

    // 3. Atrybuty
    if (filters.wielkosc && filters.wielkosc.length > 0) {
      result = result.filter(p => p.attributes.some(a => a.name === 'breedSize' && filters.wielkosc.includes(a.value)));
    }
    if (filters.wiek && filters.wiek.length > 0) {
      result = result.filter(p => p.attributes.some(a => a.name === 'dogAge' && filters.wiek.includes(a.value)));
    }
    if (filters.potrzeby && filters.potrzeby.length > 0) {
      result = result.filter(p => p.attributes.some(a => a.name === 'specialNeeds' && filters.potrzeby.includes(a.value)));
    }

    // 4. Cena
    const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
    const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
    
    if (minPrice > 0 || maxPrice < Infinity) {
      result = result.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    // 5. Sortowanie
    result.sort((a, b) => {
      switch (sort) {
        case 'Nazwa rosnąco': return a.name.localeCompare(b.name);
        case 'Nazwa malejąco': return b.name.localeCompare(a.name);
        case 'Cena rosnąco': return a.price - b.price;
        case 'Cena malejąco': return b.price - a.price;
        default: return 0;
      }
    });

    return result;
  }, [initialProducts, filters, priceFrom, priceTo, sort, activeCategoryId]);

  // ==========================================

  const Checkbox = ({ group, value }: { group: string; value: string }) => {
    const checked = filters[group]?.includes(value);
    const count = facetCounts.get(group, value);
    
    return (
      <div
        className={styles.frameParent2}
        onClick={() => toggleFilter(group, value)}
        style={{ cursor: 'pointer', display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.tablerIconSquareWrapper}>
            <input type="checkbox" readOnly checked={!!checked} style={{ pointerEvents: 'none' }} />
          </div>
          <div className={styles.cena}>{value}</div>
        </div>
        <span style={{ color: '#b0b0b0', fontSize: '13px', paddingLeft: '8px' }}>({count})</span>
      </div>
    );
  };

  return (
    <div className={styles.kategorie}>
      {/* ================= LEFT (FILTRY) ================= */}
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.filtrujWrapper}>
            <div className={styles.filtruj}>Filtruj</div>
          </div>
        </div>
        <Image src={line} width={216} height={1} alt="" />

        <Section id="cena" title="Cena" openSections={openSections} toggleSection={toggleSection}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="number" placeholder="od" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} style={{ width: '80px' }} />
            <input type="number" placeholder="do" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} style={{ width: '80px' }} />
          </div>
        </Section>

        <Section id="marka" title="Marka" openSections={openSections} toggleSection={toggleSection}>
          <Checkbox group="marka" value="AlphaWolf" />
          <Checkbox group="marka" value="Brit" />
          <Checkbox group="marka" value="Royal Canin" />
          <Checkbox group="marka" value="Trixie" />
          <Checkbox group="marka" value="NatureBite" />
        </Section>

        <Section id="wielkosc" title="Wielkość rasy" openSections={openSections} toggleSection={toggleSection}>
          <Checkbox group="wielkosc" value="Mini/Mała <10kg" />
          <Checkbox group="wielkosc" value="Średnia 10-25kg" />
          <Checkbox group="wielkosc" value="Duża >25kg" />
        </Section>

        <Section id="wiek" title="Wiek psa" openSections={openSections} toggleSection={toggleSection}>
          <Checkbox group="wiek" value="Szczenię" />
          <Checkbox group="wiek" value="Dorosły" />
          <Checkbox group="wiek" value="Senior" />
        </Section>

        <Section id="potrzeby" title="Specjalne potrzeby" openSections={openSections} toggleSection={toggleSection}>
          <Checkbox group="potrzeby" value="Bezzbożowa" />
          <Checkbox group="potrzeby" value="Dla alergików" />
          <Checkbox group="potrzeby" value="Nadwaga" />
          <Checkbox group="potrzeby" value="Wysoka aktywność" />
        </Section>

        <div
          className={styles.zastosujFiltryWrapper}
          onClick={handleResetToMainType}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.zastosujFiltry}>Resetuj filtry</div>
        </div>

        {/* ===== KATEGORIE - ORYGINALNY WYGLĄD ZACHOWUJĄCY KLASY Z PLIKU CSS ===== */}
        <div className={styles.frameWrapper}>
          <div className={styles.filtrujWrapper}>
            <div className={styles.filtruj}>Kategorie</div>
          </div>
        </div>
        <Image src={line} width={216} height={1} alt="" />

        {mainCategoriesForMenu.map((mainCat) => {
          const subCategories = getSubcategoriesByParent(mainCat._id);
          return (
            <div key={mainCat._id} className={styles.frameGroup}>
              {/* Nagłówek Sekcji Głównej (np. Karma, LEGOWISKA) z zachowaniem klasy i ikonki zwijania */}
              <div className={styles.tablerIconChevronCompactRiParent}>
                <div className={styles.cena} style={{ fontWeight: 'bold' }}>{mainCat.name}</div>
              </div>
              
              {/* Blok z podkategoriami ułożonymi pionowo z wcięciem (paddingLeft) */}
              <div className={styles.frameDiv} style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '14px', width: '100%' }}>
                {subCategories.map((sub) => {
                  const isActive = activeCategoryId === sub._id;
                  // Dynamiczny licznik produktów wyciągany dla konkretnego ID podkategorii
                  const count = facetCounts.get('category', sub._id);
                  
                  return (
                    <div
                      key={sub._id}
                      onClick={() => selectCategory(sub._id)}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {/* Nazwa podkategorii - pogrubia się automatycznie po kliknięciu */}
                      <div 
                        className={styles.cena} 
                        style={{ 
                          fontWeight: isActive ? 'bold' : 'normal',
                          color: isActive ? '#000000' : '#444444'
                        }}
                      >
                        {sub.name}
                      </div>
                      
                      {/* Licznik produktów po prawej stronie w tej samej linii */}
                      <span style={{ color: '#b0b0b0', fontSize: '13px' }}>
                        ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= RIGHT (PRODUKTY) ================= */}
      <div className={styles.frameParent25}>
        <div className={styles.sortowanieParent}>
          
          {/* MAPA STRONY (BREADCRUMBS) */}
          <div className={styles.sortowanie}>
            <Link href="/" className={styles.stronaGwna} style={{ textDecoration: 'none', cursor: 'pointer' }}>
              Strona główna
            </Link>
            <div className={styles.stronaGwna}>{'>'}</div>
            <div
              className={styles.stronaGwna}
              onClick={handleResetToMainType}
              style={{ cursor: 'pointer', fontWeight: !activeCategoryId ? 'bold' : 'normal' }}
            >
              {getTypeLabel(currentType)}
            </div>
            {parentCategoryObj && (
              <>
                <div className={styles.stronaGwna}>{'>'}</div>
                <div className={styles.stronaGwna}>{parentCategoryObj.name}</div>
              </>
            )}
            {activeCategoryObj && (
              <>
                <div className={styles.stronaGwna}>{'>'}</div>
                <div className={styles.stronaGwna} style={{ fontWeight: 'bold' }}>{activeCategoryObj.name}</div>
              </>
            )}
          </div>

          <div className={styles.sortujPoParent}>
            <div className={styles.sortujPo}>Sortuj po</div>
            <div className={styles.sortowanie2}>
              {['Nazwa rosnąco', 'Nazwa malejąco', 'Cena rosnąco', 'Cena malejąco', 'popularność'].map((s) => (
                <div
                  key={s}
                  className={styles.opcjaSortowania}
                  onClick={() => selectSort(s)}
                  style={{ cursor: 'pointer', opacity: sort === s ? 1 : 0.6 }}
                >
                  <b className={styles.nazwaRosnco}>{s}</b>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sortowanie3}>
            <div className={styles.stronaGwna}>
              {filteredAndSortedProducts.length} produktów • sort: {sort}
            </div>
          </div>
        </div>

        {/* WYSWIETLAMY PRZEFILTROWANĄ TABLICĘ PRODUKTÓW */}
        <div className={styles.produktPromocjaPiesParent}>
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <PromotionItem
                key={product._id}
                id={product._id}
                brandName={product.companyName}
                productName={product.name}
                price={product.price}
                promoPrice={product.promoPrice || undefined}
                image={product.image}
              />
            ))
          ) : (
            <div style={{ padding: '20px', fontSize: '18px' }}>Brak produktów spełniających kryteria.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KategorieClient;