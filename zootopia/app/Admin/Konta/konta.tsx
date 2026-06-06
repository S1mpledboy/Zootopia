'use client';

import { useState } from 'react';
import Image from "next/image";
import styles from './konta.module.css';

import line from '@/app/Public/Images/line.svg';
import lupa from '@/app/Public/Images/lupa.svg';

import UserKarta, { DbUser } from './kontoCard';

type FilterType = 'wszystkie' | 'aktywne' | 'nieaktywne';

interface KontaProps {
  initialUsers: DbUser[];
}

const Konta: React.FC<KontaProps> = ({ initialUsers }) => {
  const [users, setUsers] = useState<DbUser[]>(initialUsers);
  const [activeFilter, setActiveFilter] = useState<FilterType>('wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Funkcja pomocnicza do usuwania użytkownika (możesz dopisać tu wywołanie API)
  const handleDeleteUser = (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      setUsers(prev => prev.filter(user => user._id !== id));
    }
  };

  // KROK 1: Najpierw filtrujemy użytkowników po frazie z wyszukiwarki (Imię, Nazwisko lub Email)
  const searchedUsers = users.filter(user => {
    const query = searchQuery.trim().toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    
    return fullName.includes(query) || email.includes(query);
  });

  // KROK 2: Obliczamy dynamiczne statystyki na podstawie wyszukanych rekordów
  const countAll = searchedUsers.length;
  const countActive = searchedUsers.filter(u => u.isActive === true).length;
  const countInactive = searchedUsers.filter(u => u.isActive === false).length;

  // KROK 3: Końcowe filtrowanie tablicy pod konkretną zakładkę statusu
  const filteredUsers = searchedUsers.filter(user => {
    if (activeFilter === 'aktywne') return user.isActive === true;
    if (activeFilter === 'nieaktywne') return user.isActive === false;
    return true; // dla 'wszystkie'
  });

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
        <div className={styles.sortowanie}>
          <div className={styles.administrator}>Administrator</div>
          <div className={styles.administrator}>{`>`}</div>
          <div className={styles.administrator}>Zarządzanie użytkownikami</div>
        </div>

        {/* TYTUŁ I WYSZUKANIE */}
        <div className={styles.tytul}>
          <div className={styles.kontaUytkownikwParent}>
            <div className={styles.kontaUytkownikw}>Konta użytkowników</div>
            
            <div className={styles.szukajUytkownikaParent} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Szukaj użytkownika..."
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
          <Image src={line} width={760} height={1} sizes="100vw" alt="" />
        </div>

        {/* STRUKTURA FILTRÓW */}
        <div className={styles.sortowanieZamwie}>
          <div className={styles.kontaUytkownikwParent}>
            <div className={styles.wszystkieParent} onClick={() => setActiveFilter('wszystkie')} style={getFilterStyle('wszystkie')}>
              <b className={styles.wszystkie}>Wszystkie</b>
              <b className={styles.wszystkie}>({countAll})</b>
            </div>
            <div className={styles.aktywneParent} onClick={() => setActiveFilter('aktywne')} style={getFilterStyle('aktywne')}>
              <b className={styles.wszystkie}>Aktywne</b>
              <b className={styles.wszystkie}>({countActive})</b>
            </div>
            <div className={styles.aktywneParent} onClick={() => setActiveFilter('nieaktywne')} style={getFilterStyle('nieaktywne')}>
              <b className={styles.wszystkie}>Nieaktywne</b>
              <b className={styles.wszystkie}>({countInactive})</b>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} width={760} height={1} sizes="100vw" alt="" />
        </div>

        {/* DYNAMICZNA LISTA UŻYTKOWNIKÓW */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={user._id} style={{ width: '100%' }}>
              <UserKarta user={user} onDelete={handleDeleteUser} />
              
              {index < filteredUsers.length - 1 && (
                <div className={styles.produktyWKoszyku}>
                  <Image src={line} width={760} height={1} sizes="100vw" alt="" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.6 }}>
            Nie znaleziono użytkowników spełniających kryteria.
          </div>
        )}

      </div>
    </div>
  );
};

export default Konta;