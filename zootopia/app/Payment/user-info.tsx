"use client"; // Dołączone, by stany useState/useEffect działały poprawnie

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from './user-info.module.css';

const ProduktyWKoszyku: NextPage = () => {
  // 1. Definiujemy stan dla wszystkich pól formularza
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'Polska',
    street: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    companyName: '',
    nip: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. Pobieramy dane zalogowanego użytkownika przy montowaniu komponentu
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/me'); 
        
        if (response.ok) {
          const resJson = await response.json();
          
          // Dopasowanie do struktury `{ ok: true, data: { ... } }` z API
          if (resJson.ok && resJson.data) {
            const user = resJson.data;
            setIsLoggedIn(true);
            
            setFormData(prev => ({
              ...prev,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              country: user.country || 'Polska',
              street: user.street || '',
              city: user.city || '',
              postalCode: user.postalCode || '',
              phone: user.phone || '',
              email: user.email || ''
            }));
          }
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 3. Funkcja obsługująca wpisywanie danych przez użytkownika
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className={styles.produktyWKoszyku}>Ładowanie danych koszyka...</div>;
  }

  return (
    <div className={styles.produktyWKoszyku}>
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          
          {/* Imię i Nazwisko */}
          <div className={styles.frameContainer}>
            <div className={styles.imiWrapper}>
              <input 
                type="text"
                name="firstName"
                placeholder="Imię"
                value={formData.firstName}
                onChange={handleChange}
                className={styles.imi}
              />
            </div>
            <div className={styles.nazwiskoWrapper}>
              <input 
                type="text"
                name="lastName"
                placeholder="Nazwisko"
                value={formData.lastName}
                onChange={handleChange}
                className={styles.imi}
              />
            </div>
          </div>

          {/* Kraj */}
          <div className={styles.polskaWrapper}>
            <input 
              type="text"
              name="country"
              placeholder="Kraj"
              value={formData.country}
              onChange={handleChange}
              className={styles.imi}
            />
          </div>

          {/* Ulica i numer */}
          <div className={styles.polskaWrapper}>
            <input 
              type="text"
              name="street"
              placeholder="Ulica i numer"
              value={formData.street}
              onChange={handleChange}
              className={styles.imi}
            />
          </div>

          {/* Miasto i Kod pocztowy */}
          <div className={styles.frameDiv}>
            <div className={styles.nazwiskoWrapper}>
              <input 
                type="text"
                name="city"
                placeholder="Miasto"
                value={formData.city}
                onChange={handleChange}
                className={styles.imi}
              />
            </div>
            <div className={styles.kodPocztowyWrapper}>
              <input 
                type="text"
                name="postalCode"
                placeholder="Kod pocztowy"
                value={formData.postalCode}
                onChange={handleChange}
                className={styles.imi}
              />
            </div>
          </div>

          {/* Telefon i E-mail */}
          <div className={styles.frameParent2}>
            <div className={styles.telefonWrapper}>
              <input 
                type="tel"
                name="phone"
                placeholder="Telefon"
                value={formData.phone}
                onChange={handleChange}
                className={styles.imi}
              />
            </div>
            <div className={styles.eMailWrapper}>
              <input 
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className={styles.imi}
              />
            </div>
          </div>

        </div>

        {/* Sekcja opcji dodatkowych (Konto, Faktura) */}
        {!isLoggedIn && (
          <div className={styles.rectangleParent}>
            <input type="checkbox" className={styles.frameChild} id="createAccount" />
            <label htmlFor="createAccount" className={styles.stworzyKonto}>Stworzyć konto?</label>
          </div>
        )}

        <div className={styles.rectangleGroup}>
          <input type="checkbox" className={styles.frameChild} id="invoice" />
          <label htmlFor="invoice" className={styles.stworzyKonto}>Faktura</label>
        </div>

        {/* Dane do faktury */}
        <div className={styles.frameParent3}>
          <div className={styles.nazwaFirmyWrapper}>
            <input 
              type="text"
              name="companyName"
              placeholder="Nazwa firmy"
              value={formData.companyName}
              onChange={handleChange}
              className={styles.imi}
            />
          </div>
          <div className={styles.nipWrapper}>
            <input 
              type="text"
              name="nip"
              placeholder="NIP"
              value={formData.nip}
              onChange={handleChange}
              className={styles.imi}
            />
          </div>
        </div>

        <div className={styles.rectangleGroup}>
          <input type="checkbox" className={styles.frameChild} id="otherAddress" />
          <label htmlFor="otherAddress" className={styles.stworzyKonto}>Wysyłka na inny adres</label>
        </div>

        {/* Uwagi i blok logowania */}
        <div className={styles.frameParent6}>
          <div className={styles.frameWrapper}>
            {!isLoggedIn && (
              <div className={styles.maszJuKontoParent}>
                <div className={styles.imi}>{`Masz już konto? `}</div>
                <b className={styles.zalogujSi} style={{ cursor: 'pointer' }}>Zaloguj się</b>
              </div>
            )}
          </div>
          
          <div className={styles.uwagiDoZamwieniaNpInfoWrapper}>
            <textarea 
              name="notes"
              placeholder="Uwagi do zamówienia, np. informacje o dostarczeniu przesyłki."
              value={formData.notes}
              onChange={handleChange}
              className={styles.uwagiDoZamwienia}
              rows={3}
              style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none', outline: 'none' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// 👇 KLUCZOWA POPRAWKA: Eksportujemy komponent jako domyślny moduł pliku 👇
export default ProduktyWKoszyku;