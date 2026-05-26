"use client";

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from './user-info.module.css';

const FormularzPlatnosci: NextPage = () => {
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/me'); 
        if (response.ok) {
          const resJson = await response.json();
          const user = resJson.data ? resJson.data : resJson;
          
          if (user && (user.email || user._id)) {
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
        console.error("Błąd pobierania danych:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className={styles.produktyWKoszyku}>Ładowanie danych...</div>;
  }

  return (
    <div className={styles.produktyWKoszyku}>
      
      {/* NAGŁÓWEK FORMULARZA */}
      <div className={styles.metodyDostawyParent}>
        <div className={styles.metodyDostawy}>Dane płatności:</div>
        <div className={styles.lineDivider} />
      </div>

      <div className={styles.frameParent}>
        
        {/* LEWA KOLUMNA: POLA INPUT */}
        <div className={styles.frameGroup}>
          <div className={styles.frameContainer}>
            <div className={styles.imiWrapper}>
              <input type="text" name="firstName" placeholder="Imię" value={formData.firstName} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.nazwiskoWrapper}>
              <input type="text" name="lastName" placeholder="Nazwisko" value={formData.lastName} onChange={handleChange} className={styles.imi} />
            </div>
          </div>

          <div className={styles.polskaWrapper}>
            <input type="text" name="country" placeholder="Polska" value={formData.country} onChange={handleChange} className={styles.imi} />
          </div>

          <div className={styles.polskaWrapper}>
            <input type="text" name="street" placeholder="Ulica i numer" value={formData.street} onChange={handleChange} className={styles.imi} />
          </div>

          <div className={styles.frameDiv}>
            <div className={styles.nazwiskoWrapper}>
              <input type="text" name="city" placeholder="Miasto" value={formData.city} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.kodPocztowyWrapper}>
              <input type="text" name="postalCode" placeholder="Kod pocztowy" value={formData.postalCode} onChange={handleChange} className={styles.imi} />
            </div>
          </div>

          <div className={styles.frameParent2}>
            <div className={styles.telefonWrapper}>
              <input type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.eMailWrapper}>
              <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} className={styles.imi} />
            </div>
          </div>

          {/* CHECKBOXY */}
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

          {/* DANE FIRMY */}
          <div className={styles.frameParent3}>
            <div className={styles.nazwaFirmyWrapper}>
              <input type="text" name="companyName" placeholder="Nazwa firmy" value={formData.companyName} onChange={handleChange} className={styles.imi} />
            </div>
            <div className={styles.nipWrapper}>
              <input type="text" name="nip" placeholder="NIP" value={formData.nip} onChange={handleChange} className={styles.imi} />
            </div>
          </div>

          <div className={styles.rectangleGroup}>
            <input type="checkbox" className={styles.frameChild} id="otherAddress" />
            <label htmlFor="otherAddress" className={styles.stworzyKonto}>Wysyłka na inny adres</label>
          </div>

          <div className={styles.polskaWrapper}>
            <input type="text" placeholder="Polska" className={styles.imi} readOnly />
          </div>
          <div className={styles.polskaWrapper}>
            <input type="text" placeholder="Ulica i numer" className={styles.imi} />
          </div>
          <div className={styles.frameDiv}>
            <div className={styles.nazwiskoWrapper}>
              <input type="text" placeholder="Miasto" className={styles.imi} />
            </div>
            <div className={styles.kodPocztowyWrapper}>
              <input type="text" placeholder="Kod pocztowy" className={styles.imi} />
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA: LOGOWANIE + UWAGI */}
        <div className={styles.frameParent6}>
          {!isLoggedIn && (
            <div className={styles.frameWrapper}>
              <div className={styles.maszJuKontoParent}>
                <div>Masz już konto?</div>
                <div className={styles.zalogujSi}>Zaloguj się</div>
              </div>
            </div>
          )}

          <div className={styles.uwagiDoZamwieniaNpInfoWrapper}>
            <textarea 
              name="notes"
              placeholder="Uwagi do zamówienia, np. informacje o dostarczeniu przesyłki."
              value={formData.notes}
              onChange={handleChange}
              className={styles.uwagiDoZamwienia}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FormularzPlatnosci;