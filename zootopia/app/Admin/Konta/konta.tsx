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
  
  // NOWOŚĆ: Stan przechowujący użytkownika, którego admin chce usunąć
  const [userToDelete, setUserToDelete] = useState<DbUser | null>(null);

  // Funkcja wywoływana po kliknięciu kosza (otwiera modal)
  const handleDeleteClick = (user: DbUser) => {
    setUserToDelete(user);
  };

  // Funkcja ostatecznie usuwająca użytkownika po kliknięciu "TAK"
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // TUTAJ UMIEŚĆ STRZAŁ DO API, NP:
      // await fetch(`/api/users/${userToDelete._id}`, { method: 'DELETE' });

      // Usunięcie z lokalnego stanu (aby zniknął z listy na ekranie)
      setUsers(prev => prev.filter(user => user._id !== userToDelete._id));
      
      // Zamknięcie modala
      setUserToDelete(null);
    } catch (error) {
      console.error("Wystąpił błąd podczas usuwania użytkownika", error);
      alert("Nie udało się usunąć użytkownika.");
    }
  };

  const searchedUsers = users.filter(user => {
    const query = searchQuery.trim().toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const countAll = searchedUsers.length;
  const countActive = searchedUsers.filter(u => u.isActive === true).length;
  const countInactive = searchedUsers.filter(u => u.isActive === false).length;

  const filteredUsers = searchedUsers.filter(user => {
    if (activeFilter === 'aktywne') return user.isActive === true;
    if (activeFilter === 'nieaktywne') return user.isActive === false;
    return true;
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
              <Image src={lupa} className={styles.tablerIconSearch} width={20} height={20} sizes="100vw" alt="Szukaj" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} alt="" />
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
          <Image src={line} className={styles.dividerChild} alt="" />
        </div>

        {/* DYNAMICZNA LISTA UŻYTKOWNIKÓW */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={user._id} style={{ width: '100%' }}>
              <UserKarta user={user} onDelete={handleDeleteClick} />
              
              {index < filteredUsers.length - 1 && (
                <div className={styles.produktyWKoszyku}>
                  <Image src={line} className={styles.dividerChild} alt="" />
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

      {/* NOWOŚĆ: MODAL POTWIERDZENIA USUNIĘCIA */}
      {userToDelete && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Przyciemnienie
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
          onClick={() => setUserToDelete(null)} // Kliknięcie w tło zamyka modal
        >
          <div 
            style={{
              backgroundColor: '#1E1E1E', // Możesz dostosować do palety swojej aplikacji
              padding: '40px',
              borderRadius: '12px',
              position: 'relative',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              maxWidth: '400px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()} // Zapobiega zamknięciu przy kliknięciu w SAM modal
          >
            {/* Przycisk zamykający (X) */}
            <button 
              onClick={() => setUserToDelete(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>

            <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '30px', fontWeight: 'normal', lineHeight: '1.5' }}>
              Czy na pewno chcesz usunąć użytkownika <br/>
              <strong style={{ fontWeight: 'bold' }}>
                {`${userToDelete.firstName} ${userToDelete.lastName}`.trim() || userToDelete.email}
              </strong>?
            </h3>

            <button 
              onClick={confirmDelete}
              style={{
                backgroundColor: '#e74c3c', // Czerwony kolor akcji destrukcyjnej
                color: '#fff',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
            >
              TAK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Konta;