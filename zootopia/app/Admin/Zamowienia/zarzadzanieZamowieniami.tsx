'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from './zamowienia.module.css';

import lupa from '@/app/Public/Images/lupa.svg';
import line from '@/app/Public/Images/line.svg';

import OrderCard from './zamowienieKarta';
import ZamowienieModal from './zamowienie';

type FilterType = 'wszystkie' | 'ukończone' | 'w trakcie' | 'wysłane' | 'anulowane';

const ZarzadzanieZamowieniami: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  // Pobieranie danych i mapowanie ich dokładnie tak samo, jak wcześniej robił to admin/page.tsx
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Upewnij się, że ścieżka do Twojego API jest poprawna. 
        // Jeśli masz ją w '/api/orders', zmień to poniżej.
        const res = await fetch('/api/admin/orders'); 
        if (!res.ok) throw new Error('Błąd pobierania danych');
        
        const data = await res.json();
        const rawOrders = data.orders || data.data || data || [];

        // Przeniesione mapowanie z admin/page.tsx
        const sanitizedOrders = rawOrders.map((order: any) => {
          let orderStatus = "w trakcie";
          if (order.status) {
            orderStatus = typeof order.status === "object" ? order.status.name || "w trakcie" : order.status;
          }

          let formattedDate = "";
          if (order.createdAt) {
            const dateObj = new Date(order.createdAt);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
            }
          }

          return {
            ...order,
            id: order._id?.toString(), 
            _id: order._id?.toString(), 
            status: orderStatus.toLowerCase(), 
            createdAt: formattedDate
          };
        });

        setOrders(sanitizedOrders);
      } catch (error) {
        console.error("Błąd podczas ładowania zamówień:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Funkcja pomocnicza: normalizuje status z bazy danych do formatu filtrów
  const normalizeStatus = (status: string): string => {
    if (!status) return 'w trakcie';
    const s = status.toLowerCase().trim();
    
    if (s === 'completed' || s === 'finished' || s === 'ukończone') return 'ukończone';
    if (s === 'in_progress' || s === 'in progress' || s === 'w trakcie') return 'w trakcie';
    if (s === 'shipped' || s === 'wysłane') return 'wysłane';
    if (s === 'cancelled' || s === 'anulowane') return 'anulowane';
    
    return s;
  };

  // KROK 1: Filtrowanie po wyszukiwarce
  const searchedOrders = orders.filter(order =>
    order.orderNumber
      ? order.orderNumber.toLowerCase().includes(searchQuery.trim().toLowerCase())
      : false
  );

  // KROK 2: Statystyki liczbowe korzystające z normalizacji
  const countAll = searchedOrders.length;
  const countCompleted = searchedOrders.filter(o => normalizeStatus(o.status) === 'ukończone').length;
  const countInProgress = searchedOrders.filter(o => normalizeStatus(o.status) === 'w trakcie').length;
  const countShipped = searchedOrders.filter(o => normalizeStatus(o.status) === 'wysłane').length;
  const countCancelled = searchedOrders.filter(o => normalizeStatus(o.status) === 'anulowane').length;

  // KROK 3: Główny filtr listy
  const filteredOrders = activeFilter === 'wszystkie'
    ? searchedOrders
    : searchedOrders.filter(order => normalizeStatus(order.status) === activeFilter);

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

        {/* ZAKŁADKI FILTRÓW */}
        <div className={styles.sortowanieZamwie}>
          <div className={styles.zarzdzanieZamwieniamiParent}>
            <div className={styles.wszystkieParent} onClick={() => setActiveFilter('wszystkie')} style={getFilterStyle('wszystkie')}>
              <b className={styles.wszystkie}>Wszystkie</b>
              <b className={styles.wszystkie}>({countAll})</b>
            </div>
            <div className={styles.ukoczoneParent} onClick={() => setActiveFilter('ukończone')} style={getFilterStyle('ukończone')}>
              <b className={styles.wszystkie}>Ukończone</b>
              <b className={styles.wszystkie}>({countCompleted})</b>
            </div>
            <div className={styles.ukoczoneParent} onClick={() => setActiveFilter('w trakcie')} style={getFilterStyle('w trakcie')}>
              <b className={styles.wszystkie}>W trakcie</b>
              <b className={styles.wszystkie}>({countInProgress})</b>
            </div>
            <div className={styles.ukoczoneParent} onClick={() => setActiveFilter('wysłane')} style={getFilterStyle('wysłane')}>
              <b className={styles.wszystkie}>Wysłane</b>
              <b className={styles.wszystkie}>({countShipped})</b>
            </div>
            <div className={styles.ukoczoneParent} onClick={() => setActiveFilter('anulowane')} style={getFilterStyle('anulowane')}>
              <b className={styles.wszystkie}>Anulowane</b>
              <b className={styles.wszystkie}>({countCancelled})</b>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} width={760} height={1} sizes="100vw" alt="" />
        </div>

        {/* LISTA ZAMÓWIEŃ */}
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.8, fontWeight: 'bold' }}>
            Ładowanie zamówień...
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={order.id || order._id} style={{ width: '100%' }}>
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