import React from 'react';
import Image from 'next/image';
import styles from './konta.module.css';

import kalendarz from '@/app/Public/Images/kalendarz.svg';
import kosz from '@/app/Public/Images/kosz.svg';

export interface DbUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

interface UserKartaProps {
  user: DbUser;
  onDelete?: (user: DbUser) => void; // ZMIANA: Przekazujemy cały obiekt użytkownika
}

const UserKarta: React.FC<UserKartaProps> = ({ user, onDelete }) => {
  const fullName = `${user.firstName} ${user.lastName}`.trim() || "Brak danych (Profil nieuzupełniony)";
  
  return (
    <div className={styles.kontaUytkownikwParent}>
      <div className={styles.janKowalskiParent}>
        <div className={styles.janKowalski}>{fullName}</div>
        <b className={styles.jankowalskigmailcom}>{user.email}</b>
      </div>
      <div className={styles.frameWrapper}>
        <div className={user.isActive ? styles.frameContainer : styles.frameParent6}>
          <div className={styles.vectorParent}>
            <Image src={kalendarz} className={styles.vectorIcon} width={16} height={18} sizes="100vw" alt="Data rejestracji" />
            <div className={styles.div2}>{user.createdAt}</div>
          </div>
          
          <b className={user.isActive ? styles.aktywny : styles.nieaktywny}>
            {user.isActive ? "AKTYWNY" : "NIEAKTYWNY"}
          </b>

          <Image 
            src={kosz} 
            className={styles.vectorIcon} 
            width={16} 
            height={18} 
            sizes="100vw" 
            alt="Usuń" 
            style={{ cursor: 'pointer' }}
            // ZMIANA: Przekazanie całego usera przy kliknięciu kosza
            onClick={() => onDelete && onDelete(user)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserKarta;