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
// INTERFEJS PRODUKTU
// =========================
interface ProductProps {
  _id: string;
  name: string;
  price: number;
  promoPrice?: number;
  image: string;
  companyName: string;
  category: string; // Dodane pole kategorii
}

// Składnik sekcji (Cena, Marka itd.)
function Section({ id, title, children, openSections, toggleSection }: any) {
  const open = openSections[id];
  return (
    <div className={styles.frameGroup}>
      <div className={styles.tablerIconChevronCompactRiParent} onClick={() => toggleSection(id)} style={{ cursor: 'pointer' }}>
        <Image src={open ? arrowDown : arrowRight} width={24} height={24} alt="" />
        <div className={styles.cena}>{title}</div>
      </div>
      {open && <div className={styles.frameDiv}>{children}</div>}
    </div>
  );
}

const KategorieClient = ({ initialProducts }: { initialProducts: ProductProps[] }) => {
  // ===== STATE =====
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cena: true, marka: true, wielkosc: true, wiek: true, potrzeby: true,
  });
  
  // Filtry: dodajemy 'mainCategory' do obsługi sekcji na dole
  const [filters, setFilters] = useState<Record<string, string[]>>({
    mainCategory: [] 
  });
  
  const [sort, setSort] = useState<string>('popularność');
  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');

  // ===== LOGIKA =====
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

  // Funkcja specjalna dla dolnych kategorii (wybór jednej na raz lub wielu)
  const toggleMainCategory = (cat: string) => {
    toggleFilter('mainCategory', cat);
  };

  // ==========================================
  // 🔥 FILTROWANIE I SORTOWANIE (W TYM KATEGORIE)
  // ==========================================
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Filtrowanie po Głównej Kategorii (Karma mokra, sucha itd.)
    if (filters.mainCategory && filters.mainCategory.length > 0) {
      result = result.filter(product => filters.mainCategory.includes(product.category));
    }

    // 2. Filtrowanie po Marce
    if (filters.marka && filters.marka.length > 0) {
      result = result.filter(product => filters.marka.includes(product.companyName));
    }

    // 3. Filtrowanie po Cenie
    const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
    const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
    if (minPrice > 0 || maxPrice < Infinity) {
      result = result.filter(product => {
        const actualPrice = product.promoPrice || product.price;
        return actualPrice >= minPrice && actualPrice <= maxPrice;
      });
    }

    // 4. Sortowanie
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
  }, [initialProducts, filters, priceFrom, priceTo, sort]);

  // Pomocniczy komponent Checkboxa
  const Checkbox = ({ group, value }: { group: string; value: string }) => {
    const checked = filters[group]?.includes(value);
    return (
      <div className={styles.frameParent2} onClick={() => toggleFilter(group, value)} style={{ cursor: 'pointer' }}>
        <div className={styles.tablerIconSquareWrapper}>
          <input type="checkbox" readOnly checked={!!checked} style={{ pointerEvents: 'none' }} />
        </div>
        <div className={styles.cena}>{value}</div>
      </div>
    );
  };

  return (
    <div className={styles.kategorie}>
      {/* ================= LEFT ================= */}
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.filtruj}>Filtruj</div>
        </div>
        <Image src={line} width={216} height={1} alt="" />

        <Section id="cena" title="Cena" openSections={openSections} toggleSection={toggleSection}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="number" placeholder="od" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} style={{ width: '80px' }} />
            <input type="number" placeholder="do" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} style={{ width: '80px' }} />
          </div>
        </Section>

        <Section id="marka" title="Marka" openSections={openSections} toggleSection={toggleSection}>
          {['AlphaWolf', 'Brit', 'Royal Canin', 'Trixie', 'NatureBite'].map(m => (
            <Checkbox key={m} group="marka" value={m} />
          ))}
        </Section>

        <div className={styles.zastosujFiltryWrapper} onClick={() => { setFilters({ mainCategory: [] }); setPriceFrom(''); setPriceTo(''); }} style={{ cursor: 'pointer' }}>
          <div className={styles.zastosujFiltry}>Resetuj filtry</div>
        </div>

        <Image src={line} width={216} height={1} alt="" />

        {/* ===== PRZYWRÓCONE KATEGORIE ===== */}
        <div className={styles.frameWrapper} style={{ marginTop: '20px' }}>
          <div className={styles.filtruj}>Kategorie</div>
        </div>
        <Image src={line} width={216} height={1} alt="" />

        <div className={styles.frameGroup}>
          <div className={styles.cena} style={{ fontWeight: 'bold', marginBottom: '10px' }}>Pies</div>
          <div className={styles.frameDiv}>
            {[
              'Karma mokra',
              'Karma sucha',
              'Przysmaki i gryzaki',
              'Spacer i podróż',
              'Legowiska i dom',
            ].map((c) => {
              const isActive = filters.mainCategory?.includes(c);
              return (
                <div
                  key={c}
                  className={styles.karmaMokraWrapper}
                  onClick={() => toggleMainCategory(c)}
                  style={{ 
                    cursor: 'pointer', 
                    backgroundColor: isActive ? '#f0f0f0' : 'transparent',
                    borderRadius: '4px',
                    padding: '2px 5px'
                  }}
                >
                  <div className={styles.cena} style={{ color: isActive ? '#000' : 'inherit' }}>
                    {isActive ? `• ${c}` : c}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className={styles.frameParent25}>
        <div className={styles.sortowanieParent}>
          <div className={styles.sortowanie}>
            <div className={styles.stronaGwna}>Strona główna {'>'} Pies</div>
          </div>

          <div className={styles.sortujPoParent}>
            <div className={styles.sortujPo}>Sortuj po</div>
            <div className={styles.sortowanie2}>
              {['Nazwa rosnąco', 'Nazwa malejąco', 'Cena rosnąco', 'Cena malejąco'].map((s) => (
                <div key={s} className={styles.opcjaSortowania} onClick={() => selectSort(s)} style={{ cursor: 'pointer', opacity: sort === s ? 1 : 0.6 }}>
                  <b className={styles.nazwaRosnco}>{s}</b>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.sortowanie3}>
            <div className={styles.stronaGwna}>{filteredAndSortedProducts.length} produktów</div>
          </div>
        </div>

        <div className={styles.produktPromocjaPiesParent}>
          {filteredAndSortedProducts.map((product) => (
            <PromotionItem
              key={product._id}
              id={product._id}
              brandName={product.companyName}
              productName={product.name}
              price={product.price}
              promoPrice={product.promoPrice}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KategorieClient;