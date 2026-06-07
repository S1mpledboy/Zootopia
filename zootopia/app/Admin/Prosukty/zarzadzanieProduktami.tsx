'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import styles from './zarzadzanieProduktami.module.css';

import arrowDown from '@/app/Public/Images/arrowDown.svg';
import arrowRight from '@/app/Public/Images/arrowRight.svg';
import line from '@/app/Public/Images/line.svg';
import closeIcon from '@/app/Public/Images/Xicon.svg';

import ProductModal from './dodaj';

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

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  promoPrice?: number | null;
  image: string;
  companyName: string;
  company?: string; 
  petCategoryId: string | null; 
  category?: string;
  tags: string[];
  description?: string;
  ingredients?: string;
  additionalInfo?: string;
}

interface CategoryProps { _id: string; name: string; slug: string; parent: string | null; }
interface TagGroupProps { _id: string; name: string; category: string; }
interface TagProps { _id: string; name: string; group: string; }

const AdminProductsTab = ({ 
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
  const currentType = searchParams.get('type') || 'pies';

  const [products, setProducts] = useState<ProductProps[]>(initialProducts);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ cena: true, marka: true });
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<string>('popularność');
  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const urlCategorySlug = searchParams.get('category');
    const urlTagName = searchParams.get('tag');

    if (urlCategorySlug) {
      const foundCategory = allCategories.find(c => c.slug === urlCategorySlug);
      if (foundCategory) {
        setActiveCategoryId(foundCategory._id);
        if (urlTagName) {
          const foundTag = allTags.find(t => t.name.toLowerCase().trim() === urlTagName.toLowerCase().trim());
          if (foundTag) {
            setFilters({ [foundTag.group]: [urlTagName] });
            setOpenSections(prev => ({ ...prev, [foundTag.group]: true, cena: true, marka: true }));
          } else {
            setFilters({});
          }
        } else {
          setFilters({});
        }
      }
    } else {
      setActiveCategoryId(null);
      setFilters({});
      setPriceFrom('');
      setPriceTo('');
      setOpenSections({ cena: true, marka: true });
    }
  }, [currentType, searchParams, allCategories, allTags]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pies': return 'Pies';
      case 'kot': return 'Kot';
      case 'male-zwierzeta': return 'Małe zwierzęta';
      case 'promocje': return 'Promocje';
      default: return 'Pies';
    }
  };

  const currentAnimalObj = useMemo(() => allCategories.find(cat => cat.slug === currentType && cat.parent === null), [allCategories, currentType]);

  const subCategoriesForMenu = useMemo(() => {
    if (currentType === 'promocje') return allCategories.filter(cat => cat.parent === null && cat.slug !== 'promocje');
    if (!currentAnimalObj) return [];
    return allCategories.filter(cat => cat.parent === currentAnimalObj._id);
  }, [allCategories, currentAnimalObj, currentType]);

  const activeCategoryObj = useMemo(() => allCategories.find(cat => cat._id === activeCategoryId), [activeCategoryId, allCategories]);

  const childCategoryIdsForSelectedAnimal = useMemo(() => {
    if (currentType !== 'promocje' || !activeCategoryId) return [];
    return allCategories.filter(cat => cat.parent === activeCategoryId).map(cat => cat._id);
  }, [currentType, activeCategoryId, allCategories]);

  const currentTagGroups = useMemo(() => {
    if (!activeCategoryId) return [];
    let groups = [];
    if (currentType === 'promocje') {
      groups = allTagGroups.filter(g => childCategoryIdsForSelectedAnimal.includes(g.category));
    } else {
      groups = allTagGroups.filter(g => g.category === activeCategoryId);
    }
    groups.forEach(g => {
      if (openSections[g._id] === undefined) setOpenSections(prev => ({ ...prev, [g._id]: true }));
    });
    return groups;
  }, [activeCategoryId, allTagGroups, currentType, childCategoryIdsForSelectedAnimal, openSections]);

  const availableBrands = useMemo(() => {
    const brands = products
      .filter(p => {
        const catId = p.category || p.petCategoryId || '';
        if (!activeCategoryId) return true;
        if (currentType === 'promocje') return childCategoryIdsForSelectedAnimal.includes(catId);
        return catId === activeCategoryId;
      })
      .map(p => p.companyName || p.company || 'Nieznana marka');
    return Array.from(new Set(brands)).sort();
  }, [products, activeCategoryId, currentType, childCategoryIdsForSelectedAnimal]);

  const toggleSection = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  
  const toggleFilter = (groupKey: string, tagName: string) => {
    setFilters(prev => {
      const current = prev[groupKey] || [];
      const updated = current.includes(tagName) ? current.filter(v => v !== tagName) : [...current, tagName];
      return { ...prev, [groupKey]: updated };
    });
  };

  const selectSort = (value: string) => setSort(value);
  const selectCategory = (id: string) => {
    setActiveCategoryId(prev => (prev === id ? null : id));
    setFilters({});
  };

  const handleResetToMainType = () => {
    setActiveCategoryId(null);
    setFilters({});
    setPriceFrom('');
    setPriceTo('');
  };

  const facetCounts = useMemo(() => {
    const getCountForOption = (groupType: 'category' | 'marka' | 'tag', value: string, groupKey?: string) => {
      return products.filter(product => {
        const catId = product.category || product.petCategoryId;
        if (!catId) return false;
        
        const prBrand = product.companyName || product.company || '';

        if (currentType === 'promocje') {
          if (groupType === 'category') {
            const subIds = allCategories.filter(cat => cat.parent === value).map(cat => cat._id);
            if (!subIds.includes(catId)) return false;
          } else if (activeCategoryId) {
            if (!childCategoryIdsForSelectedAnimal.includes(catId)) return false;
          }
        } else {
          if (groupType !== 'category' && activeCategoryId) {
            if (catId !== activeCategoryId) return false;
          }
          if (groupType === 'category') {
            if (catId !== value) return false;
          }
        }

        if (groupType !== 'marka' && filters.marka && filters.marka.length > 0 && !filters.marka.includes(prBrand)) return false;
        if (groupType === 'marka' && prBrand !== value) return false;

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

    return { get: (groupType: 'category' | 'marka' | 'tag', value: string, groupKey?: string) => getCountForOption(groupType, value, groupKey) };
  }, [products, filters, activeCategoryId, priceFrom, priceTo, currentType, allCategories, childCategoryIdsForSelectedAnimal]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (activeCategoryId) {
      if (currentType === 'promocje') {
        result = result.filter(p => childCategoryIdsForSelectedAnimal.includes(p.category || p.petCategoryId || ''));
      } else {
        result = result.filter(p => (p.category || p.petCategoryId) === activeCategoryId);
      }
    }

    if (filters.marka && filters.marka.length > 0) {
      result = result.filter(p => filters.marka.includes(p.companyName || p.company || ''));
    }

    const minPrice = priceFrom ? parseFloat(priceFrom) : 0;
    const maxPrice = priceTo ? parseFloat(priceTo) : Infinity;
    if (minPrice > 0 || maxPrice < Infinity) result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

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
  }, [products, filters, priceFrom, priceTo, sort, activeCategoryId, currentType, childCategoryIdsForSelectedAnimal]);

  const openAddModal = () => { setSelectedProduct(null); setIsModalOpen(true); };
  const openEditModal = (product: any) => { setSelectedProduct(product); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedProduct(null); };

  // ── INTEGRACJA Z ENDPOINTAMI API ──────────────────────────────────────────

  const handleCreateOrUpdateProduct = async (payload: any, isEdit: boolean) => {
    const url = isEdit ? `/api/products/${selectedProduct._id}` : '/api/products';
    const method = isEdit ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Wystąpił problem z operacją zapisu.');
    }

    const updatedData = await response.json();
    
    // Normalizacja obiektu pod interfejs widoku przed zapisem w state
    const normalizedProduct = {
      ...updatedData.data,
      companyName: payload.brand, 
      petCategoryId: payload.category
    };

    if (isEdit) {
      setProducts(prev => prev.map(p => p._id === selectedProduct._id ? normalizedProduct : p));
    } else {
      setProducts(prev => [normalizedProduct, ...prev]);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Czy na pewno chcesz bezpowrotnie usunąć produkt "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Błąd serwera podczas usuwania.');
      
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error: any) {
      alert(error.message || 'Nie udało się usunąć produktu.');
    }
  };

  const DynamicCheckbox = ({ groupKey, type, value, label }: { groupKey: string; type: 'marka' | 'tag'; value: string; label: string }) => {
    const filterValue = type === 'marka' ? value : label;
    const checked = filters[groupKey]?.includes(filterValue);
    const count = facetCounts.get(type, filterValue, groupKey);
    return (
      <div className={styles.frameParent2} onClick={() => toggleFilter(groupKey, filterValue)} style={{ cursor: 'pointer', display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.tablerIconSquareWrapper}><input type="checkbox" readOnly checked={!!checked} style={{ pointerEvents: 'none' }} /></div>
          <div className={styles.cena}>{label}</div>
        </div>
        <span style={{ color: '#b0b0b0', fontSize: '13px', paddingLeft: '8px' }}>({count})</span>
      </div>
    );
  };

  return (
    <div className={styles.kategorie}>
      
      {/* --- FILTRY --- */}
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}><div className={styles.filtrujWrapper}><div className={styles.filtruj}>Filtruj (Admin)</div></div></div>
        <Image src={line} width={216} height={1} alt="" />

        <Section id="cena" title="Cena" openSections={openSections} toggleSection={toggleSection}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="number" placeholder="od" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} style={{ width: '80px' }} />
            <input type="number" placeholder="do" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} style={{ width: '80px' }} />
          </div>
        </Section>

        {availableBrands.length > 0 && (
          <Section id="marka" title="Marka" openSections={openSections} toggleSection={toggleSection}>
            {availableBrands.map(brand => <DynamicCheckbox key={brand} groupKey="marka" type="marka" value={brand} label={brand} />)}
          </Section>
        )}

        {activeCategoryId && currentTagGroups.map((group) => {
          const tagsForGroup = allTags.filter(t => t.group === group._id);
          if (tagsForGroup.length === 0) return null;
          return (
            <Section key={group._id} id={group._id} title={group.name} openSections={openSections} toggleSection={toggleSection}>
              {tagsForGroup.map(tag => <DynamicCheckbox key={tag._id} groupKey={group._id} type="tag" value={tag._id} label={tag.name} />)}
            </Section>
          );
        })}

        <div className={styles.zastosujFiltryWrapper} onClick={handleResetToMainType} style={{ cursor: 'pointer', marginTop: '10px' }}>
          <div className={styles.zastosujFiltry}>Resetuj filtry</div>
        </div>

        <div className={styles.frameWrapper} style={{ marginTop: '20px' }}><div className={styles.filtrujWrapper}><div className={styles.filtruj}>Kategorie</div></div></div>
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
                <div key={sub._id} onClick={() => selectCategory(sub._id)} style={{ cursor: 'pointer', backgroundColor: isActive ? '#f0f0f0' : 'transparent', borderRadius: '4px', padding: '4px 6px', display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className={styles.cena} style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{sub.name}</div>
                  <span style={{ color: '#b0b0b0', fontSize: '13px', paddingLeft: '8px' }}>({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- PRODUKTY --- */}
      <div className={styles.frameParent25}>
        <div className={styles.sortowanieParent}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div className={styles.sortowanie}>
              <div className={styles.stronaGwna} onClick={handleResetToMainType} style={{ cursor: 'pointer', fontWeight: !activeCategoryId ? 'bold' : 'normal' }}>{getTypeLabel(currentType)}</div>
              {activeCategoryObj && (
                <><div className={styles.stronaGwna}>{'>'}</div><div className={styles.stronaGwna} style={{ fontWeight: 'bold' }}>{activeCategoryObj.name}</div></>
              )}
            </div>
            
            <button 
              onClick={openAddModal}
              style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + DODAJ PRODUKT
            </button>
          </div>

          <div className={styles.sortujPoParent}>
            <div className={styles.sortujPo}>Sortuj po</div>
            <div className={styles.sortowanie2}>
              {['Nazwa rosnąco', 'Nazwa malejąco', 'Cena rosnąco', 'Cena malejąco', 'popularność'].map((s) => (
                <div key={s} className={styles.opcjaSortowania} onClick={() => selectSort(s)} style={{ cursor: 'pointer', opacity: sort === s ? 1 : 0.6 }}>
                  <b className={styles.nazwaRosnco}>{s}</b>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.sortowanie3}><div className={styles.stronaGwna}>{filteredAndSortedProducts.length} produktów</div></div>
        </div>

        {/* --- SIATKA KART PRODUKTOWYCH --- */}
        <div className={styles.produktPromocjaPiesParent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <div 
                key={product._id} 
                style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px', 
                  padding: '16px', 
                  background: '#fff', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  //justify: 'space-between',
                  position: 'relative' // Potrzebne do pozycjonowania X
                }}
              >
                {/* PRZYCISK USUNIĘCIA (X) */}
                <div 
                  onClick={() => handleDeleteProduct(product._id, product.name)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    cursor: 'pointer',
                    zIndex: 10,
                    padding: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image src={closeIcon} width={10} height={10} alt="Usuń" />
                </div>

                <div>
                  <div style={{ width: '100%', height: '160px', position: 'relative', marginBottom: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>
                    {product.companyName || product.company}
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937', marginBottom: '8px', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    {product.promoPrice ? (
                      <>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>{product.promoPrice.toFixed(2)} zł</span>
                        <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' }}>{product.price.toFixed(2)} zł</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>{product.price.toFixed(2)} zł</span>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => openEditModal(product)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    textAlign: 'center',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b5563')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
                >
                  Edytuj produkt
                </button>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', fontSize: '16px', gridColumn: '1/-1' }}>Brak produktów spełniających kryteria.</div>
          )}
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        productData={selectedProduct} 
        allCategories={allCategories} 
        onSave={handleCreateOrUpdateProduct}
      />
    </div>
  );
};

export default AdminProductsTab;