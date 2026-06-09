'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from './zamowienia.module.css'; // upewnij się, że ścieżka jest poprawna

// Importuj swoje ikony/obrazki tak jak wcześniej, np.:
// import line from '@/app/Public/Images/line.svg';

const ZarzadzanieZamowieniami: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('wszystkie');

  // Pobieranie zamówień bezpośrednio z API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać zamówień.');
        }
        const jsonData = await response.json();
        setOrders(jsonData.data || jsonData || []);
      } catch (error) {
        console.error("Błąd podczas ładowania zamówień:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Przykładowa funkcja zmiany statusu (jeśli admin ma taką opcję)
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Błąd serwera');

      // Aktualizacja lokalnego stanu po udanym strzale do API
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Błąd aktualizacji statusu:", error);
      alert("Nie udało się zmienić statusu zamówienia.");
    }
  };

  // --- LOGIKA FILTROWANIA I WYSZUKIWANIA ---
  const searchedOrders = orders.filter(order => {
    const query = searchQuery.trim().toLowerCase();
    // Dostosuj pola wyszukiwania (np. po ID zamówienia lub nazwisku klienta)
    const orderId = order._id?.toLowerCase() || '';
    const userEmail = order.user?.email?.toLowerCase() || ''; 
    return orderId.includes(query) || userEmail.includes(query);
  });

  // Liczniki do filtrów
  const countAll = searchedOrders.length;
  const countPending = searchedOrders.filter(o => o.status === 'w trakcie').length;
  const countCompleted = searchedOrders.filter(o => o.status === 'wysłane').length;

  const filteredOrders = searchedOrders.filter(order => {
    if (activeFilter === 'w trakcie') return order.status === 'w trakcie';
    if (activeFilter === 'wysłane') return order.status === 'wysłane';
    return true;
  });

  // Ekran ładowania
  if (loading) {
    return (
      <div style={{ width: '100%', padding: '100px 0', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', opacity: 0.7 }}>
        Ładowanie zamówień...
      </div>
    );
  }

  return (
    <div className={styles.prawa}>
      <div className={styles.content}>
        
        {/* NAGŁÓWEK I WYSZUKIWARKA */}
        {/* Tutaj wklej swój obecny kod wyszukiwarki, podepnij:
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
        */}

        {/* FILTRY (Wszystkie, W trakcie, Wysłane...) */}
        {/* Podepnij pod zakładki kliknięcia:
            onClick={() => setActiveFilter('w trakcie')}
            Oraz liczniki: {countAll}, {countPending}... 
        */}

        {/* LISTA ZAMÓWIEŃ */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id}>
              {/* Tutaj wyrenderuj kartę zamówienia, przekazując np. 
                  order={order} oraz ewentualnie funkcję handleUpdateStatus 
              */}
            </div>
          ))
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.6 }}>
            Nie znaleziono zamówień spełniających kryteria.
          </div>
        )}

      </div>
    </div>
  );
};

export default ZarzadzanieZamowieniami;