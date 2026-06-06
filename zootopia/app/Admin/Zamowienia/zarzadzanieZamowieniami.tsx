'use client';

import { useState } from 'react';
import Image from "next/image";
import styles from './zamowienia.module.css';

import lupa from '@/app/Public/Images/lupa.svg';
import line from '@/app/Public/Images/line.svg';

import OrderCard from './zamowienieKarta';
import ZamowienieModal from './zamowienie';

// Definicja dostępnych typów filtrów
type FilterType = 'wszystkie' | 'ukończone' | 'w trakcie' | 'wysłane' | 'anulowane';

interface ZarzadzanieZamowieniamiProps {
  initialOrders: any[];
}

const ZarzadzanieZamowieniami: React.FC<ZarzadzanieZamowieniamiProps> = ({ initialOrders }) => {
  // Pełna lista zamówień z bazy danych
  const [orders] = useState(initialOrders);
  
  // NOWOŚĆ: Stan przechowujący aktualnie wybrany filtr
  const [activeFilter, setActiveFilter] = useState<FilterType>('wszystkie');
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  // Statystyki zawsze obliczamy z PEŁNEJ listy (orders), dzięki czemu cyfry są stałe
  const countAll = orders.length;
  const countCompleted = orders.filter(o => o.status === 'ukończone').length;
  const countInProgress = orders.filter(o => o.status === 'w trakcie').length;
  const countShipped = orders.filter(o => o.status === 'wysłane').length;
  const countCancelled = orders.filter(o => o.status === 'anulowane').length;

  // NOWOŚĆ: Logika filtrująca zamówienia przed ich wyrenderowaniem
  const filteredOrders = activeFilter === 'wszystkie'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  // Funkcja pomocnicza do nadawania stylów aktywnym filtrom
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
            <div className={styles.szukajZamwieniaParent}>
              <div className={styles.administrator}>Szukaj zamówienia...</div>
              <Image src={lupa} className={styles.tablerIconSearch} width={20} height={20} sizes="100vw" alt="" />
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} width={760} height={1} sizes="100vw" alt="" />
        </div>

        {/* STATYSTYKI Z FUNKCJĄ FILTROWANIA (Zmienione kontenery div) */}
        <div className={styles.sortowanieZamwie}>
          <div className={styles.zarzdzanieZamwieniamiParent}>
            
            <div 
              className={styles.wszystkieParent} 
              onClick={() => setActiveFilter('wszystkie')}
              style={getFilterStyle('wszystkie')}
            >
              <b className={styles.wszystkie}>Wszystkie</b>
              <b className={styles.wszystkie}>({countAll})</b>
            </div>

            <div 
              className={styles.ukoczoneParent} 
              onClick={() => setActiveFilter('ukończone')}
              style={getFilterStyle('ukończone')}
            >
              <b className={styles.wszystkie}>Ukończone</b>
              <b className={styles.wszystkie}>({countCompleted})</b>
            </div>

            <div 
              className={styles.ukoczoneParent} 
              onClick={() => setActiveFilter('w trakcie')}
              style={getFilterStyle('w trakcie')}
            >
              <b className={styles.wszystkie}>W trakcie</b>
              <b className={styles.wszystkie}>({countInProgress})</b>
            </div>

            <div 
              className={styles.ukoczoneParent} 
              onClick={() => setActiveFilter('wysłane')}
              style={getFilterStyle('wysłane')}
            >
              <b className={styles.wszystkie}>Wysłane</b>
              <b className={styles.wszystkie}>({countShipped})</b>
            </div>

            <div 
              className={styles.ukoczoneParent} 
              onClick={() => setActiveFilter('anulowane')}
              style={getFilterStyle('anulowane')}
            >
              <b className={styles.wszystkie}>Anulowane</b>
              <b className={styles.wszystkie}>({countCancelled})</b>
            </div>

          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} width={760} height={1} sizes="100vw" alt="" />
        </div>

        {/* LISTA ZAMÓWIEŃ (Teraz iterujemy po filteredOrders zamiast orders) */}
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
          <div style={{ padding: '20px 0', textAlign: 'center', opacity: 0.6 }}>
            Brak zamówień o statusie: <strong>{activeFilter}</strong>
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