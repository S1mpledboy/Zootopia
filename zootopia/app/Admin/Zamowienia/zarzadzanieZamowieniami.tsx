'use client';

import { useState } from 'react';
import Image from "next/image";
import styles from './zamowienia.module.css';

import lupa from '@/app/Public/Images/lupa.svg';
import line from '@/app/Public/Images/line.svg';

import OrderCard from './zamowienieKarta';
import ZamowienieModal from './zamowienie';

interface ZarzadzanieZamowieniamiProps {
  initialOrders: any[];
}

const ZarzadzanieZamowieniami: React.FC<ZarzadzanieZamowieniamiProps> = ({ initialOrders }) => {
  // Stan ustawiany bezpośrednio z bazy danych
  const [orders] = useState(initialOrders);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  // Dynamiczne przeliczanie liczników na podstawie realnych danych
  const countAll = orders.length;
  const countCompleted = orders.filter(o => o.status === 'ukończone').length;
  const countInProgress = orders.filter(o => o.status === 'w trakcie').length;
  const countShipped = orders.filter(o => o.status === 'wysłane').length;
  const countCancelled = orders.filter(o => o.status === 'anulowane').length;

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

        {/* STATYSTYKI */}
        <div className={styles.sortowanieZamwie}>
          <div className={styles.zarzdzanieZamwieniamiParent}>
            <div className={styles.wszystkieParent}>
              <b className={styles.wszystkie}>Wszystkie</b>
              <b className={styles.wszystkie}>({countAll})</b>
            </div>
            <div className={styles.ukoczoneParent}>
              <b className={styles.wszystkie}>Ukończone</b>
              <b className={styles.wszystkie}>({countCompleted})</b>
            </div>
            <div className={styles.ukoczoneParent}>
              <b className={styles.wszystkie}>W trakcie</b>
              <b className={styles.wszystkie}>({countInProgress})</b>
            </div>
            <div className={styles.ukoczoneParent}>
              <b className={styles.wszystkie}>Wysłane</b>
              <b className={styles.wszystkie}>({countShipped})</b>
            </div>
            <div className={styles.ukoczoneParent}>
              <b className={styles.wszystkie}>Anulowane</b>
              <b className={styles.wszystkie}>({countCancelled})</b>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} width={760} height={1} sizes="100vw" alt="" />
        </div>

        {/* LISTA ZAMÓWIEŃ Z BAZY */}
        {orders.map((order, index) => (
          <div key={order.id} style={{ width: '100%' }}>
            <OrderCard order={order} onOpenDetails={() => setActiveOrder(order)} />
            
            {index < orders.length - 1 && (
              <div className={styles.produktyWKoszyku}>
                <Image src={line} className={styles.dividerChild} width={760} height={1} sizes="100vw" alt="" />
              </div>
            )}
          </div>
        ))}

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