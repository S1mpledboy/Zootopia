'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import styles from './zarzadzanieProduktami.module.css';

import { useState } from 'react';

import testimg from '@/app/Public/Images/KotCat.png';
import arrowDown from '@/app/Public/Images/arrowDown.svg';
import arrowRight from '@/app/Public/Images/arrowRight.svg';
import line from '@/app/Public/Images/line.svg';

import {PromoItems} from "@/app/Public/Data/promoItems";
import PromotionItem from '@/app/ItemBlocks/promotionItem';


// =========================
// SECTION (WYCIĄGNIĘTY NA ZEWNĄTRZ — FIX FOCUS)
// =========================
function Section({
  id,
  title,
  children,
  openSections,
  toggleSection,
}: any) {
  const open = openSections[id];

  return (
    <div className={styles.frameGroup}>
      <div
        className={styles.tablerIconChevronCompactRiParent}
        onClick={() => toggleSection(id)}
      >
        <Image
          src={open ? arrowDown : arrowRight}
          width={24}
          height={24}
          alt=""
        />
        <div className={styles.cena}>{title}</div>
      </div>

      {open && <div className={styles.frameDiv}>{children}</div>}
    </div>
  );
}

// =========================
// PAGE
// =========================
const Kategorie: NextPage = () => {
  // ===== STATE =====
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cena: true,
    marka: true,
    wielkosc: true,
    wiek: true,
    potrzeby: true,
  });

  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const [sort, setSort] = useState<string>('popularność');

  // ===== CENA STATE =====
  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');

  // ===== TOGGLE SECTION =====
  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ===== CHECKBOX =====
  const toggleFilter = (group: string, value: string) => {
    setFilters((prev) => {
      const current = prev[group] || [];

      const exists = current.includes(value);
      const updated = exists
        ? current.filter((v) => v !== value)
        : [...current, value];

      return {
        ...prev,
        [group]: updated,
      };
    });
  };

  // ===== APPLY FILTERS =====
  const applyFilters = () => {
    alert(
      `Wybrane filtry:\n` +
        Object.entries(filters)
          .map(([k, v]) => `${k}: ${v.join(', ') || 'brak'}`)
          .join('\n') +
        `\nCena: ${priceFrom || 'brak'} - ${priceTo || 'brak'}`
    );
  };

  // ===== CATEGORY =====
  const selectCategory = (value: string) => {
    alert(`Wybrana kategoria: ${value}`);
  };

  // ===== SORT =====
  const selectSort = (value: string) => {
    setSort(value);
    alert(`Sortowanie: ${value}`);
  };

  // ===== CHECKBOX COMPONENT =====
  const Checkbox = ({
    group,
    value,
  }: {
    group: string;
    value: string;
  }) => {
    const checked = filters[group]?.includes(value);

    return (
      <div
        className={styles.frameParent2}
        onClick={() => toggleFilter(group, value)}
      >
        <div className={styles.tablerIconSquareWrapper}>
          <input type="checkbox" readOnly checked={!!checked} />
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
          <div className={styles.filtrujWrapper}>
            <div className={styles.filtruj}>Filtruj</div>
          </div>
        </div>

        <Image src={line} width={216} height={1} alt="" />

        {/* ===== CENA ===== */}
        <Section
          id="cena"
          title="Cena"
          openSections={openSections}
          toggleSection={toggleSection}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              placeholder="od"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              style={{ width: '80px' }}
            />

            <input
              type="number"
              placeholder="do"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              style={{ width: '80px' }}
            />
          </div>
        </Section>

        {/* ===== MARKA ===== */}
        <Section
          id="marka"
          title="Marka"
          openSections={openSections}
          toggleSection={toggleSection}
        >
          <Checkbox group="marka" value="AlphaWolf" />
          <Checkbox group="marka" value="Brit" />
          <Checkbox group="marka" value="Royal Canin" />
          <Checkbox group="marka" value="Trixie" />
          <Checkbox group="marka" value="NatureBite" />
        </Section>

        {/* ===== WIEK / RESZTA BEZ ZMIAN ===== */}
        <Section
          id="wielkosc"
          title="Wielkość rasy"
          openSections={openSections}
          toggleSection={toggleSection}
        >
          <Checkbox group="wielkosc" value="Mini/Mała <10kg" />
          <Checkbox group="wielkosc" value="Średnia 10-25kg" />
          <Checkbox group="wielkosc" value="Duża >25kg" />
        </Section>

        <Section
          id="wiek"
          title="Wiek psa"
          openSections={openSections}
          toggleSection={toggleSection}
        >
          <Checkbox group="wiek" value="Szczenię" />
          <Checkbox group="wiek" value="Dorosły" />
          <Checkbox group="wiek" value="Senior" />
        </Section>

        <Section
          id="potrzeby"
          title="Specjalne potrzeby"
          openSections={openSections}
          toggleSection={toggleSection}
        >
          <Checkbox group="potrzeby" value="Bezzbożowa" />
          <Checkbox group="potrzeby" value="Dla alergików" />
          <Checkbox group="potrzeby" value="Nadwaga" />
          <Checkbox group="potrzeby" value="Wysoka aktywność" />
        </Section>

        <div className={styles.zastosujFiltryWrapper} onClick={applyFilters}>
          <div className={styles.zastosujFiltry}>Zastosuj filtry</div>
        </div>

        <Image src={line} width={216} height={1} alt="" />

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
            {[
              'Karma mokra',
              'Karma sucha',
              'Przysmaki i gryzaki',
              'Spacer i podróż',
              'Legowiska i dom',
            ].map((c) => (
              <div
                key={c}
                className={styles.karmaMokraWrapper}
                onClick={() => selectCategory(c)}
              >
                <div className={styles.cena}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className={styles.frameParent25}>
        <div className={styles.sortowanieParent}>
          <div className={styles.sortowanie}>
            <div className={styles.stronaGwna}>Strona główna</div>
            <div className={styles.stronaGwna}>{'>'}</div>
            <div className={styles.stronaGwna}>Pies</div>
          </div>

          <div className={styles.sortujPoParent}>
            <div className={styles.sortujPo}>Sortuj po</div>

            <div className={styles.sortowanie2}>
              {[
                'Nazwa rosnąco',
                'Nazwa malejąco',
                'Cena rosnąco',
                'Cena malejąco',
                'popularność',
              ].map((s) => (
                <div
                  key={s}
                  className={styles.opcjaSortowania}
                  onClick={() => selectSort(s)}
                >
                  <b className={styles.nazwaRosnco}>{s}</b>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sortowanie3}>
            <div className={styles.stronaGwna}>
              200 produktów • sort: {sort}
            </div>
          </div>
        </div>

        {/* ===== NOWY SYSTEM RENDERU PRODUKTÓW ===== */}
        <div className={styles.produktPromocjaPiesParent}>
          {PromoItems.map((item) => (
            <PromotionItem
              key={item.id}
              id={item.id}
              brandName={item.brandName}
              productName={item.productName}
              price={item.price}
              promoPrice={item.promoPrice}
              image="https://yts5oeiwfp7gpem4.public.blob.vercel-storage.com/SafeWalk%20Odblaskowa%20Smycz%20Miejska%20Z%20Amortyzatorem%20200cm%20%28Czerwie%C5%84%29%20img1.png"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kategorie;