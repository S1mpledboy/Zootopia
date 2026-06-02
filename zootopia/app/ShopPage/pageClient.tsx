'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
// INTERFEJSY DANYCH
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
  petCategoryId: string | null;
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
  const currentType = searchParams.get('type') || 'pies';

  // ===== STATE =====
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cena: true, marka: true, wielkosc: true, wiek: true, potrzeby: true,
  });
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<string>('popularność');

  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');
  
  // Przechowujemy ID aktywnej podkategorii z bazy MongoDB
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Reset filtrów i kategorii przy przełączaniu Pies -> Kot itp.
  useEffect(() => {
    setActiveCategoryId(null);
    setFilters({});
    setPriceFrom('');
    setPriceTo('');
  }, [currentType]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pies': return 'Pies';
      case 'kot': return 'Kot';
      case 'male-zwierzeta': return 'Małe zwierzęta';
      case 'weterynaria': return 'Weterynaria';
      case 'promocje': return 'Promocje';
      default: return 'Pies';
    }
  };

  // ===== DYNAMICZNE BUDOWANIE DRZEWA KATEGORII =====
  // Pobieramy z bazy tylko główne działy nadrzędne (parent: null)
  const mainCategories = useMemo(() => {
    return allCategories.filter(cat => cat.parent === null);
  }, [allCategories]);

  // Funkcja zwracająca dzieci dla danego działu głównego
  const getSubcategoriesByParent = (parentId: string) => {
    return allCategories.filter(cat => cat.parent === parentId);
  };

  // Wyciąganie obiektów do mapy strony (breadcrumbs)
  const activeCategoryObj = useMemo(() => {
    return allCategories.find(cat => cat._id === activeCategoryId);
  }, [activeCategoryId, allCategories]);

  const parentCategoryObj = useMemo(() => {
    if (!activeCategoryObj) return null;
    return allCategories.find(cat => cat._id === activeCategoryObj.parent);
  }, [activeCategoryObj, allCategories]);

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

  const selectSort = (value: string) => setSort(value);

  const selectCategory = (id: string) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  };

  const handleResetToMainType = () => {
    setActiveCategoryId(null);
    setFilters({});
    setPriceFrom('');
    setPriceTo('');
  };

  // ==========================================
  // 📊 DYNAMICZNE WYLICZANIE LICZBY PRODUKTÓW DLA FILTRÓW (FACETS)
  // ==========================================
  const facetCounts = useMemo(() => {
    const getCountForOption = (group: string, value: string) => {
      return initialProducts.filter(product => {
        // 1. Sprawdzamy kategorię główną/podkategorię z bazy
        if (group !== 'category' && activeCategoryId && product.petCategoryId !== activeCategoryId) return false;
        if (group === 'category' && product.petCategoryId !== value) return false;

        // 2. Sprawdzamy markę
        if (group !== 'marka' && filters.marka?.length > 0 && !filters.marka.includes(product.companyName)) return false;
        if (group === 'marka' && product.companyName !== value) return false;

        // 3. Sprawdzamy cenę
        const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
        const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
        if (product.price < minPrice || product.price > maxPrice) return false;

        // Pomocnicza weryfikacja dynamicznych atrybutów [ { name, value } ]
        const hasAttr = (name: string, val: string) => product.attributes.some(a => a.name === name && a.value === val);

        // 4. Wielkość
        if (group !== 'wielkosc' && filters.wielkosc?.length > 0) {
          if (!product.attributes.some(a => a.name === 'breedSize' && filters.wielkosc.includes(a.value))) return false;
        }
        if (group === 'wielkosc' && !hasAttr('breedSize', value)) return false;

        // 5. Wiek
        if (group !== 'wiek' && filters.wiek?.length > 0) {
          if (!product.attributes.some(a => a.name === 'dogAge' && filters.wiek.includes(a.value))) return false;
        }
        if (group === 'wiek' && !hasAttr('dogAge', value)) return false;

        // 6. Potrzeby
        if (group !== 'potrzeby' && filters.potrzeby?.length > 0) {
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

    // 1. Kategoria dolna z bazy danych
    if (activeCategoryId) {
      result = result.filter(product => product.petCategoryId === activeCategoryId);
    }

    // 2. Marka
    if (filters.marka && filters.marka.length > 0) {
      result = result.filter(product => filters.marka.includes(product.companyName));
    }

    // 3. Filtry atrybutów tablicowych
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

  const Checkbox = ({ group, value, dbValue }: { group: string; value: string; dbValue?: string }) => {
    const internalVal = dbValue || value;
    const checked = filters[group]?.includes(internalVal);
    const count = facetCounts.get(group, internalVal);
    
    return (
      <div 
        className={styles.frameParent2} 
        onClick={() => toggleFilter(group, internalVal)} 
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
          {["AlphaWolf", "Brit", "Royal Canin", "Trixie", "NatureBite"].map(brand => (
            <Checkbox key={brand} group="marka" value={brand} />
          ))}
        </Section>

        <Section id="wielkosc" title="Wielkość rasy" openSections={openSections} toggleSection={toggleSection}>
          <Checkbox group="wielkosc" value="Mini/Mała <10kg" dbValue="mini" />
          <Checkbox group="wielkosc" value="Średnia 10-25kg" dbValue="medium" />
          <Checkbox group="wielkosc" value="Duża >25kg" dbValue="large" />
        </Section>

        <Section id="wiek" title="Wiek psa" openSections={openSections} toggleSection={toggleSection}>
          <Checkbox group="wiek" value="Szczenię" dbValue="puppy" />
          <Checkbox group="wiek" value="Dorosły" dbValue="adult" />
          <Checkbox group="wiek" value="Senior" dbValue="senior" />
        </Section>

        <Section id="potrzeby" title="Specjalne potrzeby" openSections={openSections} toggleSection={toggleSection}>
          <Checkbox group="potrzeby" value="Bezzbożowa" dbValue="grainFree" />
          <Checkbox group="potrzeby" value="Dla alergików" dbValue="hypoallergenic" />
          <Checkbox group="potrzeby" value="Nadwaga" dbValue="overweight" />
          <Checkbox group="potrzeby" value="Wysoka aktywność" dbValue="active" />
        </Section>

        <div className={styles.zastosujFiltryWrapper} onClick={handleResetToMainType} style={{ cursor: 'pointer' }}>
          <div className={styles.zastosujFiltry}>Resetuj filtry</div>
        </div>

        {/* ===== DYNAMICZNE KATEGORIE Z BAZY ===== */}
        <div className={styles.frameWrapper}>
          <div className={styles.filtrujWrapper}>
            <div className={styles.filtruj}>Kategorie</div>
          </div>
        </div>
        <Image src={line} width={216} height={1} alt="" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {mainCategories.map((mainCat) => {
            const subCategories = getSubcategoriesByParent(mainCat._id);
            if (subCategories.length === 0) return null;

            return (
              <div key={mainCat._id} className={styles.frameGroup} style={{ gap: '6px' }}>
                <div className={styles.cena} style={{ fontWeight: 'bold', color: '#333', textTransform: 'uppercase', fontSize: '13px' }}>
                  {mainCat.name}
                </div>
                <div className={styles.frameDiv} style={{ paddingLeft: '4px', gap: '4px' }}>
                  {subCategories.map((sub) => {
                    const isActive = activeCategoryId === sub._id;
                    const count = facetCounts.get('category', sub._id);

                    return (
                      <div 
                        key={sub._id} 
                        onClick={() => selectCategory(sub._id)}
                        style={{ 
                          cursor: 'pointer',
                          backgroundColor: isActive ? '#f0f0f0' : 'transparent',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div className={styles.cena} style={{ fontWeight: isActive ? 'bold' : 'normal', fontSize: '14px' }}>
                          {sub.name}
                        </div>
                        <span style={{ color: '#b0b0b0', fontSize: '12px' }}>({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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

        {/* STRUKTURA WYŚWIETLANIA ELEMENTÓW */}
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