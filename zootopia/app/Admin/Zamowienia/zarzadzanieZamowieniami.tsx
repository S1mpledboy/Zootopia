'use client';

import { useState } from 'react';
import Image from "next/image";
import styles from './zamowienia.module.css';

import lupa from '@/app/Public/Images/lupa.svg';
import line from '@/app/Public/Images/line.svg';

import OrderCard from './zamowienieKarta';
import ZamowienieModal from './zamowienie';

type FilterType = 'wszystkie' | 'FINISHED' | 'IN_PROGRESS' | 'SHIPPED' | 'CANCELLED';

interface ZarzadzanieZamowieniamiProps {
  initialOrders: any[];
}

const ZarzadzanieZamowieniami: React.FC<ZarzadzanieZamowieniamiProps> = ({ initialOrders }) => {
  const [orders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState<FilterType>('wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  // KROK 1: Najpierw filtrujemy całą bazę TYLKO po wpisanym numerze zamówienia
  const searchedOrders = orders.filter(order =>
    order.orderNumber
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );

  // KROK 2: Statystyki obliczamy z przefiltrowanych przez wyszukiwarkę zamówień (teraz liczby będą się zmieniać!)
  const countAll = searchedOrders.length;
  const countCompleted = searchedOrders.filter(o => o.status === 'FINISHED').length;
  const countInProgress = searchedOrders.filter(o => o.status === 'IN_PROGRESS').length;
  const countShipped = searchedOrders.filter(o => o.status === 'SHIPPED').length;
  const countCancelled = searchedOrders.filter(o => o.status === 'CANCELLED').length;

  // KROK 3: Do końcowego wyrenderowania na liście bierzemy zamówienia spełniające też kryterium zakładki statusu
  const filteredOrders = activeFilter === 'wszystkie'
    ? searchedOrders
    : searchedOrders.filter(order => order.status === activeFilter);

  const getFilterStyle = (filterName: FilterType) => {
    return {
      cursor: 'pointer',
      opacity: activeFilter === filterName ? 1 : 0.5,
      transition: 'opacity 0.2s ease',
    };
  };

  return (
    <div className={styles.prawa}>
      <div className={styles.content}>
        
        {/* BREADCRUMBS */}
        <div className={styles.menuMiejsce}>
          <div className={styles.administrator}>Administrator</div>
          <div className={styles.administrator}>{`>`}</div>
          <div className={styles.administrator}>Zarządzanie zamówieniami</div>
        </div>

        {/* TYTUŁ I WYSZUKIWARKA */}
        <div className={styles.tytul}>
          <div className={styles.zarzdzanieZamwieniamiParent}>
            <div className={styles.zarzdzanieZamwieniami2}>Zarządzanie zamówieniami</div>
            
            <div className={styles.szukajZamwieniaParent} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Szukaj zamówienia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  width: '100%',
                  paddingRight: '30px'
                }}
              />
              <Image 
                src={lupa} 
                className={styles.tablerIconSearch} 
                width={20} 
                height={20} 
                sizes="100vw" 
                alt="Szukaj"
                style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} width={760} height={1} sizes="100vw" alt="" />
        </div>

        {/* STATYSTYKI (Teraz z dynamicznymi wartościami) */}
        <div className={styles.sortowanieZamwie}>
          <div className={styles.zarzdzanieZamwieniamiParent}>
            <div className={styles.wszystkieParent} onClick={() => setActiveFilter('wszystkie')} style={getFilterStyle('wszystkie')}>
              <b className={styles.wszystkie}>Wszystkie</b>
              <b className={styles.wszystkie}>({countAll})</b>
            </div>
            <div className={styles.ukoczoneParent} onClick={() => setActiveFilter('FINISHED')} style={getFilterStyle('FINISHED')}>
              <b className={styles.wszystkie}>Ukończone</b>
              <b className={styles.wszystkie}>({countCompleted})</b>
            </div>
            <div className={styles.ukoczoneParent} onClick={() => setActiveFilter('IN_PROGRESS')} style={getFilterStyle('IN_PROGRESS')}>
              <b className={styles.wszystkie}>W trakcie</b>
              <b className={styles.wszystkie}>({countInProgress})</b>
            </div>
            <div className={styles.ukoczoneParent} onClick={() => setActiveFilter('SHIPPED')} style={getFilterStyle('SHIPPED')}>
              <b className={styles.wszystkie}>Wysłane</b>
              <b className={styles.wszystkie}>({countShipped})</b>
            </div>
            <div className={styles.ukoczoneParent} onClick={() => setActiveFilter('CANCELLED')} style={getFilterStyle('CANCELLED')}>
              <b className={styles.wszystkie}>Anulowane</b>
              <b className={styles.wszystkie}>({countCancelled})</b>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} width={760} height={1} sizes="100vw" alt="" />
        </div>

        {/* LISTA ZAMÓWIEŃ */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={order.id} style={{ width: '100%' }}>
              <OrderCard order={order} onOpenDetails={() => setActiveOrder(order)} />
              
              {index < filteredOrders.length - 1 && (
                <div className={styles.produktyWKoszyku}>
                  <Image src={line} className={styles.dividerChild} width={760} height={1} sizes="100vw" alt="" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.6 }}>
            Nie znaleziono zamówień spełniających kryteria.
          </div>
        )}

      </div>

      {/* WARUNKOWE RENDEROWANIE MODALA */}
      {activeOrder && (
        <ZamowienieModal 
          order={activeOrder} 
          onClose={() => setActiveOrder(null)} 
        />
      )}
    </div>
  );
};

export default ZarzadzanieZamowieniami;