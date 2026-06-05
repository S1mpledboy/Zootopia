'use client';

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
// INTERFEJSY DANYCH
// =========================
interface ProductProps {
  _id: string;
  name: string;
  price: number;
  promoPrice?: number | null;
  image: string;
  companyName: string;
  petCategoryId: string | null; 
  tags: string[];
}

interface CategoryProps {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
}

interface TagGroupProps {
  _id: string;
  name: string;
  category: string;
}

interface TagProps {
  _id: string;
  name: string;
  group: string;
}

// =========================
// MAIN PAGE CLIENT COMPONENT
// =========================
const KategorieClient = ({ 
  initialProducts, 
  allCategories,
  allTagGroups = [],
  allTags = []
}: { 
  initialProducts: ProductProps[]; 
  allCategories: CategoryProps[];
  allTagGroups?: TagGroupProps[];
  allTags?: TagProps[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentType = searchParams.get('type') || 'pies';

  // ===== STATE =====
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cena: true, marka: true
  });
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<string>('popularność');

  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');
  
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    setActiveCategoryId(null);
    setFilters({});
    setPriceFrom('');
    setPriceTo('');
    setOpenSections({ cena: true, marka: true });
  }, [currentType]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pies': return 'Pies';
      case 'kot': return 'Kot';
      case 'male-zwierzeta': return 'Małe zwierzęta';
      case 'promocje': return 'Promocje';
      default: return 'Pies';
    }
  };

  const currentAnimalObj = useMemo(() => {
    return allCategories.find(cat => cat.slug === currentType && cat.parent === null);
  }, [allCategories, currentType]);

  const subCategoriesForMenu = useMemo(() => {
    if (!currentAnimalObj) return [];
    return allCategories.filter(cat => cat.parent === currentAnimalObj._id);
  }, [allCategories, currentAnimalObj]);

  const activeCategoryObj = useMemo(() => {
    return allCategories.find(cat => cat._id === activeCategoryId);
  }, [activeCategoryId, allCategories]);

  // Generowanie filtrów cech
  const currentTagGroups = useMemo(() => {
    if (activeCategoryId) {
      return allTagGroups.filter(g => g.category === activeCategoryId);
    }
    const allowedSubCategoryIds = subCategoriesForMenu.map(sub => sub._id);
    const groups = allTagGroups.filter(g => allowedSubCategoryIds.includes(g.category));

    groups.forEach(g => {
      if (openSections[g._id] === undefined) {
        setOpenSections(prev => ({ ...prev, [g._id]: true }));
      }
    });

    return groups;
  }, [activeCategoryId, allTagGroups, subCategoriesForMenu]);

  const availableBrands = useMemo(() => {
    const brands = initialProducts
      .filter(p => !activeCategoryId || p.petCategoryId === activeCategoryId)
      .map(p => p.companyName);
    return Array.from(new Set(brands)).sort();
  }, [initialProducts, activeCategoryId]);

  // ===== FILTERS LOGIC =====
  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (groupKey: string, tagName: string) => {
    setFilters((prev) => {
      const current = prev[groupKey] || [];
      const updated = current.includes(tagName)
        ? current.filter((v) => v !== tagName)
        : [...current, tagName];
      return { ...prev, [groupKey]: updated };
    });
  };

  const selectSort = (value: string) => {
    setSort(value);
  };

  const selectCategory = (id: string) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
    setFilters({});
  };

  const handleResetToMainType = () => {
    setActiveCategoryId(null);
    setFilters({});
    setPriceFrom('');
    setPriceTo('');
  };

  // ==========================================
  // 📊 LICZNIKI PRODUKTÓW (FACETS PO TEKŚCIE Z EXCELA)
  // ==========================================
  const facetCounts = useMemo(() => {
    const getCountForOption = (groupType: 'category' | 'marka' | 'tag', value: string, groupKey?: string) => {
      return initialProducts.filter(product => {
        if (!product.petCategoryId) return false;

        if (groupType !== 'category' && activeCategoryId) {
          if (product.petCategoryId !== activeCategoryId) return false;
        }
        if (groupType === 'category') {
          if (product.petCategoryId !== value) return false;
        }

        if (groupType !== 'marka' && filters.marka && filters.marka.length > 0 && !filters.marka.includes(product.companyName)) return false;
        if (groupType === 'marka' && product.companyName !== value) return false;

        const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
        const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
        if (product.price < minPrice || product.price > maxPrice) return false;

        for (const [key, selectedTagNames] of Object.entries(filters)) {
          if (key === 'marka' || selectedTagNames.length === 0) continue;
          if (groupType === 'tag' && groupKey === key) continue;

          const hasMatchingTag = product.tags?.some(pTag => 
            selectedTagNames.some(sName => 
              pTag.toLowerCase().trim() === sName.toLowerCase().trim() ||
              pTag.toLowerCase().trim().endsWith(sName.toLowerCase().trim())
            )
          );
          if (!hasMatchingTag) return false;
        }

        if (groupType === 'tag') {
          const hasThisTag = product.tags?.some(pTag => 
            pTag.toLowerCase().trim() === value.toLowerCase().trim() ||
            pTag.toLowerCase().trim().endsWith(value.toLowerCase().trim())
          );
          if (!hasThisTag) return false;
        }

        return true;
      }).length;
    };

    return {
      get: (groupType: 'category' | 'marka' | 'tag', value: string, groupKey?: string) => getCountForOption(groupType, value, groupKey)
    };
  }, [initialProducts, filters, activeCategoryId, priceFrom, priceTo]);

  // ==========================================
  // FILTROWANIE I SORTOWANIE
  // ==========================================
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    if (activeCategoryId) {
      result = result.filter(p => p.petCategoryId === activeCategoryId);
    }

    if (filters.marka && filters.marka.length > 0) {
      result = result.filter(p => filters.marka.includes(p.companyName));
    }

    const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
    const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
    if (minPrice > 0 || maxPrice < Infinity) {
      result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);
    }

    for (const [groupKey, selectedTagNames] of Object.entries(filters)) {
      if (groupKey === 'marka' || selectedTagNames.length === 0) continue;
      
      result = result.filter(product => {
        return product.tags?.some(pTag => 
          selectedTagNames.some(sName => 
            pTag.toLowerCase().trim() === sName.toLowerCase().trim() ||
            pTag.toLowerCase().trim().endsWith(sName.toLowerCase().trim())
          )
        );
      });
    }

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

  const DynamicCheckbox = ({ groupKey, type, value, label }: { groupKey: string; type: 'marka' | 'tag'; value: string; label: string }) => {
    const filterValue = type === 'marka' ? value : label;
    const checked = filters[groupKey]?.includes(filterValue);
    const count = facetCounts.get(type, filterValue, groupKey);
    
    return (
      <div
        className={styles.frameParent2}
        onClick={() => toggleFilter(groupKey, filterValue)}
        style={{ cursor: 'pointer', display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.tablerIconSquareWrapper}>
            <input type="checkbox" readOnly checked={!!checked} style={{ pointerEvents: 'none' }} />
          </div>
          <div className={styles.cena}>{label}</div>
        </div>
        <span style={{ color: '#b0b0b0', fontSize: '13px', paddingLeft: '8px' }}>({count})</span>
      </div>
    );
  };

  return (
    <div className={styles.kategorie}>
      {/* ================= LEFT (PANEL FILTRÓW) ================= */}
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

        {availableBrands.length > 0 && (
          <Section id="marka" title="Marka" openSections={openSections} toggleSection={toggleSection}>
            {availableBrands.map(brand => (
              <DynamicCheckbox key={brand} groupKey="marka" type="marka" value={brand} label={brand} />
            ))}
          </Section>
        )}

        {/* 🔥 ZMIANA: GRUPY TAGÓW Z EXCELA POKAZUJĄ SIĘ TYLKO WTEDY, GDY WYBRANO KATEGORIĘ */}
        {activeCategoryId && currentTagGroups.map((group) => {
          const tagsForGroup = allTags.filter(t => t.group === group._id);
          if (tagsForGroup.length === 0) return null;

          return (
            <Section key={group._id} id={group._id} title={group.name} openSections={openSections} toggleSection={toggleSection}>
              {tagsForGroup.map(tag => (
                <DynamicCheckbox 
                  key={tag._id} 
                  groupKey={group._id} 
                  type="tag" 
                  value={tag._id} 
                  label={tag.name} 
                />
              ))}
            </Section>
          );
        })}

        <div className={styles.zastosujFiltryWrapper} onClick={handleResetToMainType} style={{ cursor: 'pointer' }}>
          <div className={styles.zastosujFiltry}>Resetuj filtry</div>
        </div>

        {/* Menu Kategorii bocznych */}
        <div className={styles.frameWrapper}>
          <div className={styles.filtrujWrapper}>
            <div className={styles.filtruj}>Kategorie</div>
          </div>
        </div>
        <Image src={line} width={216} height={1} alt="" />

        <div className={styles.frameGroup}>
          <div className={styles.tablerIconChevronCompactRiParent}>
            <div className={styles.cena} style={{ fontWeight: 'bold' }}>{getTypeLabel(currentType)}</div>
          </div>
          
          <div className={styles.frameDiv}>
            {subCategoriesForMenu.map((sub) => {
              const isActive = activeCategoryId === sub._id;
              const count = facetCounts.get('category', sub._id);
              
              return (
                <div
                  key={sub._id}
                  className={styles.karmaMokraWrapper}
                  onClick={() => selectCategory(sub._id)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#f0f0f0' : 'transparent',
                    borderRadius: '4px',
                    padding: '4px 6px',
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div className={styles.cena} style={{ fontWeight: isActive ? 'bold' : 'normal' }}>
                    {sub.name}
                  </div>
                  <span style={{ color: '#b0b0b0', fontSize: '13px', paddingLeft: '8px' }}>
                    ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= RIGHT (LISTA PRODUKTÓW) ================= */}
      <div className={styles.frameParent25}>
        <div className={styles.sortowanieParent}>
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