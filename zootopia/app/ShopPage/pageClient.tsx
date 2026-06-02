'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import styles from './shopPage.module.css';
import { useState, useMemo } from 'react';

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
// INTERFEJS PRODUKTU
// =========================
interface ProductProps {
  _id: string;
  name: string;
  price: number;
  promoPrice?: number;
  image: string;
  companyName: string;
  category?: string;
}

// =========================
// PAGE CLIENT COMPONENT
// =========================
const KategorieClient = ({ initialProducts }: { initialProducts: ProductProps[] }) => {
  // ===== STATE =====
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cena: true, marka: true, wielkosc: true, wiek: true, potrzeby: true,
  });
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<string>('popularność');

  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  const selectCategory = (value: string) => {
    setActiveCategory((prev) => (prev === value ? null : value));
  };

  // ==========================================
  // 📊 DYNAMICZNE WYLICZANIE LICZBY PRODUKTÓW DLA FILTRÓW
  // ==========================================
  const facetCounts = useMemo(() => {
    const getCountForOption = (group: string, value: string) => {
      return initialProducts.filter(product => {
        // 1. Sprawdzamy kategorię (jeśli liczymy dla innej grupy, uwzględniamy aktywną kategorię)
        if (group !== 'category' && activeCategory && product.category !== activeCategory) return false;
        if (group === 'category' && product.category !== value) return false;

        // 2. Sprawdzamy markę
        if (group !== 'marka' && filters.marka && filters.marka.length > 0 && !filters.marka.includes(product.companyName)) return false;
        if (group === 'marka' && product.companyName !== value) return false;

        // 3. Sprawdzamy cenę (zawsze uwzględniana)
        const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
        const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
        const actualPrice = product.promoPrice || product.price;
        if (actualPrice < minPrice || actualPrice > maxPrice) return false;

        // 4. Bezpieczna weryfikacja przyszłych pól (wiek, wielkość, potrzeby)
        if (group !== 'wielkosc' && filters.wielkosc && filters.wielkosc.length > 0 && !filters.wielkosc.includes((product as any).wielkosc)) return false;
        if (group === 'wielkosc' && (product as any).wielkosc !== value) return false;

        if (group !== 'wiek' && filters.wiek && filters.wiek.length > 0 && !filters.wiek.includes((product as any).wiek)) return false;
        if (group === 'wiek' && (product as any).wiek !== value) return false;

        if (group !== 'potrzeby' && filters.potrzeby && filters.potrzeby.length > 0 && !((product as any).potrzeby?.some((r: string) => filters.potrzeby.includes(r)))) return false;
        if (group === 'potrzeby' && !((product as any).potrzeby?.includes(value))) return false;

        return true;
      }).length;
    };

    return {
      get: (group: string, value: string) => getCountForOption(group, value)
    };
  }, [initialProducts, filters, activeCategory, priceFrom, priceTo]);

  // ==========================================
  // 🔥 GŁÓWNA LOGIKA FILTROWANIA I SORTOWANIA (WYNIK KOŃCOWY)
  // ==========================================
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    if (activeCategory) {
      result = result.filter(product => product.category === activeCategory);
    }

    if (filters.marka && filters.marka.length > 0) {
      result = result.filter(product => filters.marka.includes(product.companyName));
    }

    const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
    const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
    
    if (minPrice > 0 || maxPrice < Infinity) {
      result = result.filter(product => {
        const actualPrice = product.promoPrice || product.price;
        return actualPrice >= minPrice && actualPrice <= maxPrice;
      });
    }

    result.sort((a, b) => {
      const priceA = a.promoPrice || a.price;
      const priceB = b.promoPrice || b.price;

      switch (sort) {
        case 'Nazwa rosnąco': return a.name.localeCompare(b.name);
        case 'Nazwa malejąco': return b.name.localeCompare(a.name);
        case 'Cena rosnąco': return priceA - priceB;
        case 'Cena malejąco': return priceB - priceA;
        default: return 0;
      }
    });

    return result;
  }, [initialProducts, filters, priceFrom, priceTo, sort, activeCategory]);

  // ==========================================

  const Checkbox = ({ group, value }: { group: string; value: string }) => {
    const checked = filters[group]?.includes(value);
    const count = facetCounts.get(group, value); // Pobranie liczby produktów dla tego checkboxa
    
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
          onClick={() => { setFilters({}); setPriceFrom(''); setPriceTo(''); setActiveCategory(null); }} 
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.zastosujFiltry}>Resetuj filtry</div>
        </div>

        {/* ===== KATEGORIE ===== */}
        <div className={styles.frameWrapper}>
          <div className={styles.filtrujWrapper}>
            <div className={styles.filtruj}>Kategorie</div>
          </div>
        </div>
        <Image src={line} width={216} height={1} alt="" />

        <div className={styles.frameGroup}>
          <div className={styles.cena}>Pies</div>
          <div className={styles.frameDiv}>
            {['Karma mokra', 'Karma sucha', 'Przysmaki i gryzaki', 'Spacer i podróż', 'Legowiska i dom'].map((c) => {
              const isActive = activeCategory === c;
              const count = facetCounts.get('category', c); // Pobranie liczby produktów dla tej kategorii
              
              return (
                <div 
                  key={c} 
                  className={styles.karmaMokraWrapper} 
                  onClick={() => selectCategory(c)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#f0f0f0' : 'transparent',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div className={styles.cena} style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{c}</div>
                  <span style={{ color: '#b0b0b0', fontSize: '13px', paddingLeft: '8px' }}>({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= RIGHT (PRODUKTY) ================= */}
      <div className={styles.frameParent25}>
        <div className={styles.sortowanieParent}>
          <div className={styles.sortowanie}>
            <div className={styles.stronaGwna}>Strona główna</div>
            <div className={styles.stronaGwna}>{'>'}</div>
            <div className={styles.stronaGwna}>Pies</div>
            {activeCategory && (
              <>
                <div className={styles.stronaGwna}>{'>'}</div>
                <div className={styles.stronaGwna}>{activeCategory}</div>
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

        {/* WYSWIETLAMY PRZEFILTROWANA TABLICE */}
        <div className={styles.produktPromocjaPiesParent}>
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <PromotionItem
                key={product._id}
                id={product._id}
                brandName={product.companyName}
                productName={product.name}
                price={product.price}
                promoPrice={product.promoPrice}
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