"use client";

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './user-info.module.css';

const FormularzPlatnosci: NextPage = () => {
  const router = useRouter();
  
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
    notes: '',
    shippingCountry: 'Polska',
    shippingStreet: '',
    shippingCity: '',
    shippingPostalCode: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [createAccount, setCreateAccount] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showOtherAddress, setShowOtherAddress] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. Próbujemy pobrać token z localStorage na wypadek, gdyby tam był
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        // 2. Budujemy nagłówki. Jeśli token istnieje, dodajemy go.
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // 3. Strzał do API (dodajemy credentials: 'include', gdybyś używał ciasteczek/sesji)
        const response = await fetch('/api/user/me', { 
          method: 'GET',
          headers: headers,
          credentials: 'include' 
        }); 

        console.log("Status odpowiedzi z /api/user/me:", response.status);

        if (response.ok) {
          const resJson = await response.json();
          console.log("Dane odebrane z bazy danych:", resJson);

          // Rozpakowanie obiektu użytkownika (obsługuje: resJson, resJson.data lub resJson.user)
          const user = resJson.user ? resJson.user : (resJson.data ? resJson.data : resJson);
          
          // 🔥 KLUCZOWA POPRAWKA: Jeśli obiekt istnieje i ma jakikolwiek identyfikator lub email
          if (user && (user._id || user.email || user.username)) {
            console.log("Pomyślnie zautoryzowano użytkownika:", user.email || user._id);
            setIsLoggedIn(true); // Ukrywa przycisk logowania i checkbox "Stwórz konto"
            
            // Wpisanie danych bezpośrednio do pól formularza
            setFormData(prev => ({
              ...prev,
              firstName: user.firstName || user.name || '',
              lastName: user.lastName || '',
              country: user.country || 'Polska',
              street: user.street || '',
              city: user.city || '',
              postalCode: user.postalCode || '',
              phone: user.phone || '',
              email: user.email || '',
              companyName: user.companyName || '',
              nip: user.nip || ''
            }));
          } else {
            console.warn("Zwrócony obiekt użytkownika jest pusty lub niepoprawny.");
            setIsLoggedIn(false);
          }
        } else {
          console.log("Użytkownik niezalogowany (brak statusu OK)");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Błąd krytyczny podczas pobierania danych:", error);
        setIsLoggedIn(false);
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

  const handleLoginRedirect = () => {
    router.push('/Auth');
  };

  if (isLoading) {
    return <div className={styles.produktyWKoszyku}>Weryfikacja sesji klienta...</div>;
  }

  return (
    <div className={styles.produktyWKoszyku}>
      
      <div className={styles.metodyDostawyParent}>
        <div className={styles.metodyDostawy}>Dane płatności:</div>
        <div className={styles.lineDivider} />
      </div>

      <div className={styles.frameParent}>
        
        {/* LEWA KOLUMNA FORMULARZA */}
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

          {/* Rejestracja widoczna tylko dla gości */}
          {!isLoggedIn && (
            <div className={styles.rectangleParent}>
              <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} className={styles.frameChild} id="createAccount" />
              <label htmlFor="createAccount" className={styles.stworzyKonto}>Stworzyć konto?</label>
            </div>
          )}

          <div className={styles.rectangleGroup}>
            <input type="checkbox" checked={showInvoice} onChange={(e) => setShowInvoice(e.target.checked)} className={styles.frameChild} id="invoice" />
            <label htmlFor="invoice" className={styles.stworzyKonto}>Faktura</label>
          </div>

          {showInvoice && (
            <div className={styles.frameParent3}>
              <div className={styles.nazwaFirmyWrapper}>
                <input type="text" name="companyName" placeholder="Nazwa firmy" value={formData.companyName} onChange={handleChange} className={styles.imi} />
              </div>
              <div className={styles.nipWrapper}>
                <input type="text" name="nip" placeholder="NIP" value={formData.nip} onChange={handleChange} className={styles.imi} />
              </div>
            </div>
          )}

          <div className={styles.rectangleGroup}>
            <input type="checkbox" checked={showOtherAddress} onChange={(e) => setShowOtherAddress(e.target.checked)} className={styles.frameChild} id="otherAddress" />
            <label htmlFor="otherAddress" className={styles.stworzyKonto}>Wysyłka na inny adres</label>
          </div>

          {showOtherAddress && (
            <div className={styles.frameGroup} style={{ gap: '14px' }}>
              <div className={styles.polskaWrapper}>
                <input type="text" name="shippingCountry" placeholder="Polska" value={formData.shippingCountry} onChange={handleChange} className={styles.imi} />
              </div>
              <div className={styles.polskaWrapper}>
                <input type="text" name="shippingStreet" placeholder="Ulica i numer" value={formData.shippingStreet} onChange={handleChange} className={styles.imi} />
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.nazwiskoWrapper}>
                  <input type="text" name="shippingCity" placeholder="Miasto" value={formData.shippingCity} onChange={handleChange} className={styles.imi} />
                </div>
                <div className={styles.kodPocztowyWrapper}>
                  <input type="text" name="shippingPostalCode" placeholder="Kod pocztowy" value={formData.shippingPostalCode} onChange={handleChange} className={styles.imi} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PRAWA KOLUMNA */}
        <div className={styles.frameParent6}>
          
          {/* 🔥 DYNAMICZNY BLOK LOGOWANIA - Zniknie natychmiast po ustawieniu isLoggedIn na true */}
          {!isLoggedIn && (
            <div className={styles.frameWrapper}>
              <div className={styles.maszJuKontoParent}>
                <div>Masz już konto?</div>
                <div className={styles.zalogujSi} onClick={handleLoginRedirect}>
                  Zaloguj się
                </div>
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